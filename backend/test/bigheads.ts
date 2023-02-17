import { strict as assert } from 'assert'
import web3 from 'web3'
import * as utils from './utils'

const BigHeads = artifacts.require('BigHeads')

describe('BigHeads', () => {
  const url = 'fake url'
  const defaultURIs = ['uri 1', 'uri 2']

  contract('mint', async (accounts) => {
    const owner = accounts[0]
    const user = accounts[1]

    it('has zero minted bigheads by default', async () => {
      const instance = await BigHeads.new(defaultURIs, { from: owner })
      const minted = await instance.getMinted()

      assert.equal(minted.length, 0)
    })

    it('has zero minted bigheads by default', async () => {
      const instance = await BigHeads.deployed()
      const minted = await instance.getMinted()

      assert.equal(minted.length, 0)
    })

    it('has 0 balance for user', async () => {
      const instance = await BigHeads.deployed()
      const balance = await instance.balanceOf(user)

      assert.equal(Number(balance), 0)
    })

    it('shows content as not owned based on url', async () => {
      // TODO
    })

    it('mints', async () => {
      const instance = await BigHeads.deployed()
      const transaction = await instance.mint(user, {
        from: user,
        value: web3.utils.toWei('0.01'),
      })

      assert.ok(!!transaction.tx)
      const transferLogEvent = transaction.logs.find(utils.isTransferLog)
      const logEvent = utils.isTransferLog(transferLogEvent)
        ? transferLogEvent
        : undefined
      console.log('FIXME 1: ', logEvent?.args)
      // assert.equal(
      //   utils.isTransferLog(transferLogEvent) &&
      //     transferLogEvent.args.tokenId.toString(),
      //   '0',
      // )
    })

    // it('fails to mint the same nft twice, using the same url', async () => {
    //   const instance = await BigHeads.deployed()

    //   await utils.assertThrows(
    //     async () =>
    //       await instance.mint(owner, {
    //         from: owner,
    //         value: web3.utils.toWei('0.01'),
    //       }),
    //     'NFT already minted!',
    //   )
    // })

    it('minting increases nft balance of user', async () => {
      const instance = await BigHeads.deployed()
      const balance = await instance.balanceOf(user)

      assert.equal(Number(balance), 1)
    })

    // it('shows content as owned based on url', async () => {
    // })

    // it('shows content as not owned based on url', async () => {
    // })

    it('increases the number of minted bigheads', async () => {
      const instance = await BigHeads.deployed()
      const minted = await instance.getMinted()

      assert.equal(minted.length, 1)
    })

    it('sets correct uri for first minted token', async () => {
      const instance = await BigHeads.deployed()
      const tokenUri = await instance.tokenURI('0')

      assert.ok(tokenUri.startsWith('ipfs://'))
    })

    it('retrieves token uri based on token id', async () => {
      const instance = await BigHeads.deployed()
      const tokenUri = await instance.tokenURI('0')

      assert.equal(tokenUri, 'ipfs://fake url')
    })

    it('fails to retrieve token uri if token id does not exist', async () => {
      const instance = await BigHeads.deployed()

      await utils.assertThrows(
        async () => await instance.tokenURI('1'),
        'invalid token ID',
      )
    })

    it('fails if eth amount sent to mint the nft is too low', async () => {
      const instance = await BigHeads.deployed()

      await utils.assertThrows(
        async () =>
          await instance.mint(owner, {
            from: owner,
            value: web3.utils.toWei('0.001'),
          }),
        'Minimum amount of ether to mint: 0.01',
      )
    })
  })

  contract('safeMint', (accounts) => {
    const owner = accounts[0]

    it('safely mints', async () => {
      const instance = await BigHeads.deployed()
      const transaction = await instance.safeMint(owner)

      assert.ok(!!transaction.tx)
      const transferLogEvent = transaction.logs.find(utils.isTransferLog)
      assert.equal(
        utils.isTransferLog(transferLogEvent) &&
          transferLogEvent.args.tokenId.toString(),
        '0',
      )
    })
  })
})
