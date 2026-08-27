import { constants } from 'node:fs'
import { copyFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const templates = [
  ['.env.example', '.env'],
  ['apps/cms/.env.example', 'apps/cms/.env'],
  ['apps/web/.env.example', 'apps/web/.env.local'],
]

for (const [source, destination] of templates) {
  const sourcePath = path.join(repositoryRoot, source)
  const destinationPath = path.join(repositoryRoot, destination)

  await mkdir(path.dirname(destinationPath), { recursive: true })

  try {
    await copyFile(sourcePath, destinationPath, constants.COPYFILE_EXCL)
    console.log(`Created ${destination} from ${source}`)
  } catch (error) {
    if (error?.code === 'EEXIST') {
      console.log(`Kept existing ${destination}`)
      continue
    }

    throw error
  }
}
