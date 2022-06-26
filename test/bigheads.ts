import { strict as assert } from 'assert'
import Web3 from 'web3'
import { isTransferLog, assertThrows } from './utils'

const BigHeads = artifacts.require('BigHeads')

describe('BigHeads', () => {
  contract('mint', async (accounts) => {
    const url = 'fake url'

    it('has zero minted bigheads by default', async () => {
      const instance = await BigHeads.deployed()

      const count = await instance.count()
      assert.equal(Number(count), 0)
    })

    it('shows content as not owned based on url', async () => {
      const instance = await BigHeads.deployed()

      const isContentOwned = await instance.isContentOwned(url)
      assert.equal(isContentOwned, false)
    })

    it('mints', async () => {
      const instance = await BigHeads.deployed()

      const transaction = await instance.mint(accounts[0], url, {
        from: accounts[0],
        value: Web3.utils.toWei('0.01'),
      })

      assert.ok(!!transaction.tx)
      const transferLogEvent = transaction.logs.find(isTransferLog)
      assert.equal(
        isTransferLog(transferLogEvent) &&
          transferLogEvent.args.tokenId.toString(),
        '0',
      )
    })

    it('shows content as owned based on url', async () => {
      const instance = await BigHeads.deployed()

      const isContentOwned = await instance.isContentOwned(url)
      assert.equal(isContentOwned, true)
    })

    it('shows content as not owned based on url', async () => {
      const instance = await BigHeads.deployed()

      const isContentOwned = await instance.isContentOwned('another url')
      assert.equal(isContentOwned, false)
    })

    it('increases the number of minted bigheads', async () => {
      const instance = await BigHeads.deployed()

      const count = await instance.count()
      assert.equal(Number(count), 1)
    })

    it('sets correct base uri for the token uri', async () => {
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

      assertThrows(
        () => instance.tokenURI('1'),
        'URI query for nonexistent token',
      )
    })

    it('fails to mint the same nft twice', async () => {
      const instance = await BigHeads.deployed()

      assertThrows(
        () =>
          instance.mint(accounts[0], url, {
            from: accounts[0],
            value: Web3.utils.toWei('0.01'),
          }),
        'NFT already minted!',
      )
    })

    it('fails if eth amount sent to mint the nft is too low', async () => {
      const instance = await BigHeads.deployed()

      assertThrows(
        () =>
          instance.mint(accounts[0], 'another url', {
            from: accounts[0],
            value: Web3.utils.toWei('0.001'),
          }),
        'Minimum amount of ether to mint: 0.01',
      )
    })
  })
})
