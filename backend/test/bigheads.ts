import { expect } from 'chai'
import web3 from 'web3'

const BigHeads = artifacts.require('BigHeads')
const Utils = artifacts.require('Utils')

contract('Utils', (accounts) => {
  const user = accounts[0]
  // const maxLoops = 200 // for stress testing
  const maxLoops = 10

  it('retrieves a random string from given array', async () => {
    const instance = await Utils.new()
    const testArray = ['one', 'two', 'three', 'four']

    const transactionResult = await instance.getRandomItemFromArray(testArray, {
      from: user,
    })

    expect(testArray).to.contain(transactionResult[0])
    expect(transactionResult[1]).to.deep.equal(
      testArray.filter((item) => item !== transactionResult[0]),
    )
  })

  it('returns an empty', async () => {
    const instance = await Utils.new()
    const testArray = ['one', 'two', 'three', 'four']

    const transactionResult = await instance.getRandomItemFromArray(testArray, {
      from: user,
    })

    expect(testArray).to.contain(transactionResult[0])
    expect(transactionResult[1]).to.deep.equal(
      testArray.filter((item) => item !== transactionResult[0]),
    )
  })

  it('exhausts all strings from an array', async () => {
    const instance = await Utils.new()
    let testArray = ['one', 'two', 'three', 'four']

    let transactionResult = await instance.getRandomItemFromArray(testArray, {
      from: user,
    })

    expect(testArray).to.contain(transactionResult[0])
    expect(transactionResult[1]).to.have.length(3)

    testArray = transactionResult[1]

    transactionResult = await instance.getRandomItemFromArray(testArray, {
      from: user,
    })

    expect(testArray).to.contain(transactionResult[0])
    expect(transactionResult[1]).to.have.length(2)

    testArray = transactionResult[1]

    transactionResult = await instance.getRandomItemFromArray(testArray, {
      from: user,
    })

    expect(testArray).to.contain(transactionResult[0])
    expect(transactionResult[1]).to.have.length(1)

    testArray = transactionResult[1]

    transactionResult = await instance.getRandomItemFromArray(testArray, {
      from: user,
    })

    expect(testArray).to.contain(transactionResult[0])
    expect(transactionResult[1]).to.have.length(0)
  })
})

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

  it('has 4 NFTs to mint at the beginning', async () => {
    const instance = await createNewInstance()
    const availableCount = await instance.getAvailableCount()

    expect((availableCount as any).words[0]).to.eq(4)
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

    for (const _ in [1, 2]) {
      await instance.mint(user, {
        from: user,
        value: web3.utils.toWei('0.01', 'ether'),
      })
    }
    const minted = await instance.getMinted()

    expect(minted).to.have.lengthOf(2)
    expect(defaultURIs).to.include(minted[1])
  })

  it('mints three', async () => {
    const instance = await createNewInstance()

    for (const _ in [1, 2, 3]) {
      await instance.mint(user, {
        from: user,
        value: web3.utils.toWei('0.01', 'ether'),
      })
    }
    const minted = await instance.getMinted()

    expect(minted).to.have.lengthOf(3)
    expect(defaultURIs).to.include(minted[2])
  })

  it('mints four', async () => {
    const instance = await createNewInstance()

    for (const _ in [1, 2, 3, 4]) {
      await instance.mint(user, {
        from: user,
        value: web3.utils.toWei('0.01', 'ether'),
      })
    }

    const minted = await instance.getMinted()

    expect(minted).to.have.lengthOf(4)
    expect(defaultURIs).to.include(minted[3])
  })

  it('does not mint more than available URIs', async () => {
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
    await instance.mint(user, {
      from: user,
      value: web3.utils.toWei('0.01', 'ether'),
    })

    await instance
      .mint(user, {
        from: user,
        value: web3.utils.toWei('0.01', 'ether'),
      })
      .then(() => {
        assert.fail("It should have thrown an exception but it didn't")
      })
      .catch((error) => {
        assert.ok(!!error)
      })
  })
})
