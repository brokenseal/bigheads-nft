import * as dotenv from 'dotenv'
import { create, IPFSHTTPClient } from 'ipfs-http-client'

dotenv.config()

const projectId = process.env.INFURA_PROJECT_ID
const projectSecret = process.env.INFURA_API_KEY_SECRET
const auth =
  'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

export const createClient = () =>
  create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    apiPath: '/api/v0',
    headers: {
      authorization: auth,
    },
  })

export const uploadFile = (client: IPFSHTTPClient, fileContent: string) =>
  client.add(fileContent)
// const url = `https://yourdedicatedgwname.infura-ipfs.io/ipfs/${added.path}`
