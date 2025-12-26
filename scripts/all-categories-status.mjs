import fs from 'node:fs/promises';
import path from 'node:path';

const rootDir = path.resolve(process.cwd());

function toInt(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function padRight(text, width) {
  const s = String(text);
  if (s.length >= width) return s;
  return s + ' '.repeat(width - s.length);
}

async function main() {
  const entries = await fs.readdir(rootDir, { withFileTypes: true });
  const reportFiles = entries
    .filter((e) => e.isFile() && e.name.endsWith('-tools-report.json'))
    .map((e) => e.name)
    .sort();

  const reports = [];
  for (const file of reportFiles) {
    const raw = await fs.readFile(path.join(rootDir, file), 'utf8');
    const json = JSON.parse(raw);
    const summary = json.summary || {};

    const categoryKey = String(json.categoryKey || file.replace(/-tools-report\.json$/, ''));

    const missingInRegistry = toInt(summary.missingInRegistry);
    const registryEntriesWithMissingFiles = toInt(summary.registryEntriesWithMissingFiles);
    const totalToolsInToolsData = toInt(summary.totalToolsInToolsData);
    const implementedInRegistry = toInt(summary.implementedInRegistry);
    const advancedImplemented = toInt(summary.advancedImplemented);
    const basicImplemented = toInt(summary.basicImplemented);

    const subcategoryBreakdown = Array.isArray(json.subcategoryBreakdown)
      ? json.subcategoryBreakdown
      : [];

    const subcategoryMissing = subcategoryBreakdown
      .filter((s) => toInt(s.missing) > 0)
      .map((s) => ({
        key: String(s.subcategoryKey || ''),
        name: String(s.subcategoryName || ''),
        missing: toInt(s.missing),
        total: toInt(s.total),
      }));

    reports.push({
      file,
      categoryKey,
      totalToolsInToolsData,
      implementedInRegistry,
      missingInRegistry,
      registryEntriesWithMissingFiles,
      advancedImplemented,
      basicImplemented,
      subcategoryMissing,
    });
  }

  const totalCategories = reports.length;
  const categoriesWithMissing = reports.filter((r) => r.missingInRegistry > 0 || r.registryEntriesWithMissingFiles > 0 || r.subcategoryMissing.length > 0);

  const lines = [];
  lines.push('# All categories readiness (registry-level)');
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Categories scanned: ${totalCategories}`);
  lines.push(`Categories with missing tools/files: ${categoriesWithMissing.length}`);
  lines.push('');

  lines.push('## Summary table');
  lines.push('');
  lines.push('| Category | Total (tools data) | Implemented (registry) | Missing (registry) | Missing files | Advanced | Basic | Report |');
  lines.push('|---|---:|---:|---:|---:|---:|---:|---|');

  for (const r of reports) {
    lines.push(
      `| ${r.categoryKey} | ${r.totalToolsInToolsData} | ${r.implementedInRegistry} | ${r.missingInRegistry} | ${r.registryEntriesWithMissingFiles} | ${r.advancedImplemented} | ${r.basicImplemented} | ${r.file} |`
    );
  }

  lines.push('');
  lines.push('## Categories with missing items');
  lines.push('');

  if (categoriesWithMissing.length === 0) {
    lines.push('- None (all scanned categories report missing = 0 at registry-level).');
  } else {
    for (const r of categoriesWithMissing) {
      lines.push(`- ${r.categoryKey}: missingInRegistry=${r.missingInRegistry}, missingFiles=${r.registryEntriesWithMissingFiles}`);
      for (const s of r.subcategoryMissing) {
        lines.push(`  - ${s.key}: missing ${s.missing}/${s.total} ${s.name ? `(${s.name})` : ''}`);
      }
    }
  }

  lines.push('');
  lines.push('## Notes');
  lines.push('');
  lines.push('- This report is based on `*-tools-report.json` files and reflects registry/data coverage, not UI-level “Not Configured” fallbacks inside individual Generic*Tool components.');

  await fs.writeFile(path.join(rootDir, 'all-categories-tools-status.md'), lines.join('\n'), 'utf8');

  // Also print a small console summary
  const col1 = Math.max(...reports.map((r) => r.categoryKey.length), 'Category'.length);
  const header = `${padRight('Category', col1)}  Missing(reg)  MissingFiles`;
  console.log(header);
  console.log('-'.repeat(header.length));
  for (const r of reports) {
    console.log(`${padRight(r.categoryKey, col1)}  ${padRight(r.missingInRegistry, 11)}  ${r.registryEntriesWithMissingFiles}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
