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
    const Utils = artifacts.require('Utils')
    const BigHeads = artifacts.require('BigHeads')

    await deployer.deploy(Utils)
    await deployer.link(Utils, BigHeads)

    const uploadedFile = readFileSync(
      join(
        __dirname,
        '..',
        '..',
        'bigheads-management',
        'src',
        'generated',
        'uploaded.json',
      ),
    )
    const uploaded: UploadResult[] = JSON.parse(uploadedFile.toString())
    const existingURIs = uploaded.map((data) => {
      return data.fullPath
    })

    await deployer.deploy(BigHeads, existingURIs)

    console.log(
      `BigHeads cointract deployed at ${BigHeads.address} in network: ${network}.`,
    )
  }
}
