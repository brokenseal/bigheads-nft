import { join } from 'path'
import { getFilePath } from './utils.js'

const dirName = getFilePath(import.meta.url)

export const generatedDirPath = join(dirName, 'generated')
export const bigHeadsCount = 5
