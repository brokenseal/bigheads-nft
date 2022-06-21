const Web3 = require('web3')
const BigHeads = artifacts.require('BigHeads')

contract('BigHeads', async (accounts) => {
  it('increases the number of minted pandoros', async () => {
    let instance = await BigHeads.deployed()

    await instance.mint(accounts[0], 'fake url', {
      from: accounts[0],
      value: Web3.utils.toWei('0.01'),
    })

    const count = await instance.count()
    assert.equal(Number(count), 1)
  })
})
