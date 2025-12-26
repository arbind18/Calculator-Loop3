import fs from 'node:fs'

const report = JSON.parse(fs.readFileSync('business-tools-report.json', 'utf8'))
const ids = (report.missingInRegistry || []).map((x) => x.id).filter(Boolean)

const seen = new Set()
const unique = []
for (const id of ids) {
  if (seen.has(id)) continue
  seen.add(id)
  unique.push(id)
}

fs.writeFileSync('tmp-business-ids-unique.txt', unique.map((id) => `  '${id}',`).join('\n') + '\n')
console.log(`missing ${ids.length} ids, unique ${unique.length} ids`)