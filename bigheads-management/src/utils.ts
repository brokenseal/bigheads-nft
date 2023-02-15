import { dirname } from 'path'
import { fileURLToPath } from 'url'

export const getFilePath = (fileUrl: string) => {
  return dirname(fileURLToPath(fileUrl))
}
