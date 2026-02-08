
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env');

try {
    // Try reading as UTF-16LE
    const content = fs.readFileSync(envPath, 'utf16le');
    console.log('--- DECODED CONTENT START ---');
    console.log(content);
    console.log('--- DECODED CONTENT END ---');

    // Write back as UTF-8 to a new file for verification
    fs.writeFileSync(path.resolve(process.cwd(), '.env.utf8'), content, 'utf8');
    console.log('Successfully converted to UTF-8 at .env.utf8');
} catch (err) {
    console.error('Error reading/converting .env:', err);
}
