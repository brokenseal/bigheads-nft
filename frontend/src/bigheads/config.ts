import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const fileName = fileURLToPath(import.meta.url)
const dirName = dirname(fileName)

export const rootDir = join(dirName, '../../')
export const generatedDirPath = join(rootDir, 'public', 'bigheads', 'generated')
export const bigHeadsCount = 1000
