import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'

const lock = JSON.parse(readFileSync('lib/contracts/v1/contract-lock.json', 'utf8'))
const hash = createHash('sha256').update(readFileSync('lib/contracts/v1/schema.ts')).digest('hex')
if (hash !== lock.sourceSha256 || !/^[a-f0-9]{40}$/.test(lock.apiCommit)) {
  throw new Error('Coffeo v1 generated contract or API commit lock is invalid')
}
console.log(`Coffeo v1 contract verified: ${hash}`)
