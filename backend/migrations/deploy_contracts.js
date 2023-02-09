"use strict";
module.exports = (artifacts, _web3) => {
    return async (deployer, network, _accounts) => {
        const BigHeads = artifacts.require('BigHeads');
        await deployer.deploy(BigHeads);
        console.log(`BigHeads cointract deployed at ${BigHeads.address} in network: ${network}.`);
    };
};
