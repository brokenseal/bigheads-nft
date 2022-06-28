"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const web3_1 = __importDefault(require("web3"));
const utils_1 = require("./utils");
const BigHeads = artifacts.require('BigHeads');
describe('BigHeads', () => {
    const url = 'fake url';
    contract('mint', async (accounts) => {
        const owner = accounts[0];
        const user = accounts[1];
        it('has zero minted bigheads by default', async () => {
            const instance = await BigHeads.deployed();
            const count = await instance.count();
            assert_1.strict.equal(Number(count), 0);
        });
        it('has 0 balance for user', async () => {
            const instance = await BigHeads.deployed();
            const balance = await instance.balanceOf(user);
            assert_1.strict.equal(Number(balance), 0);
        });
        it('shows content as not owned based on url', async () => {
            const instance = await BigHeads.deployed();
            const isContentOwned = await instance.isContentOwned(url);
            assert_1.strict.equal(isContentOwned, false);
        });
        it('mints', async () => {
            const instance = await BigHeads.deployed();
            const transaction = await instance.mint(user, url, {
                from: user,
                value: web3_1.default.utils.toWei('0.01'),
            });
            assert_1.strict.ok(!!transaction.tx);
            const transferLogEvent = transaction.logs.find(utils_1.isTransferLog);
            assert_1.strict.equal((0, utils_1.isTransferLog)(transferLogEvent) &&
                transferLogEvent.args.tokenId.toString(), '0');
        });
        it('increases balance for user', async () => {
            const instance = await BigHeads.deployed();
            const balance = await instance.balanceOf(user);
            assert_1.strict.equal(Number(balance), 1);
        });
        it('shows content as owned based on url', async () => {
            const instance = await BigHeads.deployed();
            const isContentOwned = await instance.isContentOwned(url);
            assert_1.strict.equal(isContentOwned, true);
        });
        it('shows content as not owned based on url', async () => {
            const instance = await BigHeads.deployed();
            const isContentOwned = await instance.isContentOwned('another url');
            assert_1.strict.equal(isContentOwned, false);
        });
        it('increases the number of minted bigheads', async () => {
            const instance = await BigHeads.deployed();
            const count = await instance.count();
            assert_1.strict.equal(Number(count), 1);
        });
        it('sets correct base uri for the token uri', async () => {
            const instance = await BigHeads.deployed();
            const tokenUri = await instance.tokenURI('0');
            assert_1.strict.ok(tokenUri.startsWith('ipfs://'));
        });
        it('retrieves token uri based on token id', async () => {
            const instance = await BigHeads.deployed();
            const tokenUri = await instance.tokenURI('0');
            assert_1.strict.equal(tokenUri, 'ipfs://fake url');
        });
        it('fails to retrieve token uri if token id does not exist', async () => {
            const instance = await BigHeads.deployed();
            (0, utils_1.assertThrows)(() => instance.tokenURI('1'), 'URI query for nonexistent token');
        });
        it('fails to mint the same nft twice', async () => {
            const instance = await BigHeads.deployed();
            (0, utils_1.assertThrows)(() => instance.mint(accounts[0], url, {
                from: accounts[0],
                value: web3_1.default.utils.toWei('0.01'),
            }), 'NFT already minted!');
        });
        it('fails if eth amount sent to mint the nft is too low', async () => {
            const instance = await BigHeads.deployed();
            (0, utils_1.assertThrows)(() => instance.mint(accounts[0], 'another url', {
                from: accounts[0],
                value: web3_1.default.utils.toWei('0.001'),
            }), 'Minimum amount of ether to mint: 0.01');
        });
    });
    contract('safeMint', (accounts) => {
        it('safely mints', async () => {
            const instance = await BigHeads.deployed();
            const transaction = await instance.safeMint(accounts[0], 'different uri');
            assert_1.strict.ok(!!transaction.tx);
            const transferLogEvent = transaction.logs.find(utils_1.isTransferLog);
            assert_1.strict.equal((0, utils_1.isTransferLog)(transferLogEvent) &&
                transferLogEvent.args.tokenId.toString(), '0');
        });
    });
});
