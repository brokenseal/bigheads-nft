import { expect } from 'chai'
import web3 from 'web3'

const BigHeads = artifacts.require('BigHeads')

contract('BigHeads', (accounts) => {
  const defaultURIs = ['uri 1', 'uri 2', 'uri 3', 'uri 4']
  const owner = accounts[0]
  const user = accounts[1]

  const createNewInstance = async () => {
    return await BigHeads.new(defaultURIs, { from: owner })
  }

  it('has zero minted nfts at the beginning', async () => {
    const instance = await createNewInstance()
    const minted = await instance.getMinted()

    expect(minted).to.have.lengthOf(0)
  })

  it('mints one', async () => {
    const instance = await createNewInstance()
    await instance.mint(user, {
      from: user,
      value: web3.utils.toWei('0.01', 'ether'),
    })
    const minted = await instance.getMinted()

    expect(minted).to.have.lengthOf(1)
    expect(defaultURIs).to.include(minted[0])
  })

  it('mints two', async () => {
    const instance = await createNewInstance()
    await instance.mint(user, {
      from: user,
      value: web3.utils.toWei('0.01', 'ether'),
    })
    await instance.mint(user, {
      from: user,
      value: web3.utils.toWei('0.01', 'ether'),
    })
    const minted = await instance.getMinted()

    expect(minted).to.have.lengthOf(2)
    expect(defaultURIs).to.include(minted[0])
    expect(defaultURIs).to.include(minted[1])
  })

  it('mints three', async () => {
    const instance = await createNewInstance()
    await instance.mint(user, {
      from: user,
      value: web3.utils.toWei('0.01', 'ether'),
    })
    await instance.mint(user, {
      from: user,
      value: web3.utils.toWei('0.01', 'ether'),
    })
    await instance.mint(user, {
      from: user,
      value: web3.utils.toWei('0.01', 'ether'),
    })
    const minted = await instance.getMinted()

    expect(minted).to.have.lengthOf(3)
    expect(defaultURIs).to.include(minted[0])
    expect(defaultURIs).to.include(minted[1])
    expect(defaultURIs).to.include(minted[2])
  })
})
