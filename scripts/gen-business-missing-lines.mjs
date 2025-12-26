import fs from 'node:fs'

const report = JSON.parse(fs.readFileSync('business-tools-report.json', 'utf8'))
const ids = (report.missingInRegistry || []).map((x) => x.id).filter(Boolean)

const out = ids.map((id) => `  '${id}',`).join('\n') + '\n'
fs.writeFileSync('tmp-business-ids.txt', out)
console.log(`wrote ${ids.length} ids to tmp-business-ids.txt`)
