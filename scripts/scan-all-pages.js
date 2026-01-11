const fs = require('fs');
const path = require('path');
const http = require('http');

// Configuration
const BASE_URL = 'http://localhost:3000';
const REGISTRY_PATH = path.join(__dirname, '../src/lib/calculatorRegistry.ts');

// regex to find all calculator IDs in the arrays
// Matches strings usually found in arrays like: 'some-id',
const ID_REGEX = /'([a-z0-9-]+)',/g;

async function getAllCalculatorIds() {
    console.log('Reading calculator registry...');
    const content = fs.readFileSync(REGISTRY_PATH, 'utf8');
    const ids = new Set();

    let match;
    while ((match = ID_REGEX.exec(content)) !== null) {
        // Filter out common false positives if any, or very short strings that might not be IDs
        if (match[1].length > 2 && !['default', 'import', 'dynamic', 'from'].includes(match[1])) {
            ids.add(match[1]);
        }
    }

    // Also manually add categories if needed, but let's focus on calculators first
    // We can also add some standard pages
    ids.add(''); // Home
    ids.add('about');
    ids.add('contact');
    ids.add('privacy');

    console.log(`Found ${ids.size} unique paths to check.`);
    return Array.from(ids);
}

function checkUrl(id) {
    return new Promise((resolve) => {
        let urlPath = id === '' ? '/' : (['about', 'contact', 'privacy'].includes(id) ? `/${id}` : `/calculator/${id}`);
        const url = `${BASE_URL}${urlPath}`;

        const req = http.get(url, (res) => {
            // Consume response data to free up memory
            res.resume();

            if (res.statusCode >= 400) {
                resolve({ id, url, status: res.statusCode, error: true });
            } else {
                process.stdout.write('.'); // Progress indicator
                resolve({ id, url, status: res.statusCode, error: false });
            }
        });

        req.on('error', (e) => {
            resolve({ id, url, status: 'CONN_ERR', error: true, message: e.message });
        });

        req.setTimeout(5000, () => {
            req.destroy();
            resolve({ id, url, status: 'TIMEOUT', error: true });
        });
    });
}

async function runScan() {
    const ids = await getAllCalculatorIds();
    const errors = [];
    const start = Date.now();

    // Process in chunks to avoid overwhelming the server
    const CHUNK_SIZE = 5;
    for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
        const chunk = ids.slice(i, i + CHUNK_SIZE);
        const results = await Promise.all(chunk.map(id => checkUrl(id)));

        for (const res of results) {
            if (res.error) {
                console.log(`\n[FAIL] ${res.url} returned ${res.status}`);
                errors.push(res);
            }
        }
    }

    const duration = ((Date.now() - start) / 1000).toFixed(2);
    console.log(`\n\nScan complete in ${duration}s`);
    console.log(`Total checked: ${ids.length}`);
    console.log(`Total errors: ${errors.length}`);

    if (errors.length > 0) {
        console.log('\n--- FAILED PAGES ---');
        errors.forEach(e => console.log(`${e.status}: ${e.url}`));
        process.exit(1);
    } else {
        console.log('\nAll pages healthy!');
        process.exit(0);
    }
}

runScan();
