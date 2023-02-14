import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const fileName = fileURLToPath(import.meta.url)
const dirName = dirname(fileName)

export const rootDir = join(dirName, '../../frontend')
export const generatedDirPath = join(dirName, 'generated')
export const bigHeadsCount = 10
