import { readFileSync } from 'fs'
import { join } from 'path'
import { AddResult } from 'ipfs-core-types/dist/src/root.js'

type Network = 'development' | 'kovan' | 'mainnet'
type UploadResult = { ipfsPath: AddResult; fileName: string; fullPath: string }

module.exports = (artifacts: Truffle.Artifacts, _web3: Web3) => {
  return async (
    deployer: Truffle.Deployer,
    network: Network,
    _accounts: string[],
  ) => {
    const BigHeads = artifacts.require('BigHeads')
    const uploadedFile = readFileSync(
      join(
        __dirname,
        '..',
        '..',
        'bigheads',
        'src',
        'generated',
        'uploaded.json',
      ),
    )
    const uploaded: UploadResult[] = JSON.parse(uploadedFile.toString())
    const existingURIs = uploaded.map((data) => data.fullPath)

    await deployer.deploy(BigHeads, existingURIs)

    console.log(
      `BigHeads cointract deployed at ${BigHeads.address} in network: ${network}.`,
    )
  }
}
