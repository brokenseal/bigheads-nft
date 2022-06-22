type Network = 'development' | 'kovan' | 'mainnet'

module.exports = (artifacts: Truffle.Artifacts, _web3: Web3) => {
  return async (
    deployer: Truffle.Deployer,
    network: Network,
    accounts: string[],
  ) => {
    const BigHeads = artifacts.require('BigHeads')

    await deployer.deploy(BigHeads)

    console.log(
      `BigHeads cointract deployed at ${BigHeads.address} in network: ${network}.`,
    )
  }
}
