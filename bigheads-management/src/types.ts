import { AddResult } from 'ipfs-core-types/dist/src/root.js'

export type UploadResult = {
  ipfsPath: AddResult
  fileName: string
  fullPath: string
  uniqueUriId: string
  baseUri: string
}
