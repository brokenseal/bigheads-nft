import { UploadResult } from '@bigheads-nft/bigheads-management'
import { readFileSync } from 'fs'
import { join } from 'path'

type Network = 'development' | 'kovan' | 'mainnet'

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
      return data.uniqueUriId
    })

    await deployer.deploy(BigHeads, existingURIs)

    console.log(
      `BigHeads cointract deployed at ${BigHeads.address} in network: ${network}.`,
    )
  }
}
