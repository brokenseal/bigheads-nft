// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "truffle/console.sol";

import "./Utils.sol";

contract BigHeads is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private tokenIdCounter;

    string[] private minted;
    string[] private availableTokenURIs;

    constructor(string[] memory tokenURIs) ERC721("BigHeads", "BIGH") {
        availableTokenURIs = tokenURIs;
    }

    // function _baseURI() internal pure override returns (string memory) {
    //     return "ipfs://";
    // }

    function safeMint(address recipient)
        public
        onlyOwner
        returns (uint256, string memory)
    {
        return _mint(recipient);
    }

    // The following functions are overrides required by Solidity.

    // istanbul ignore next
    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function mint(address recipient)
        public
        payable
        returns (uint256, string memory)
    {
        require(
            msg.value >= 0.01 ether,
            "Minimum amount of ether to mint: 0.01"
        );

        return _mint(recipient);
    }

    function _mint(address recipient) private returns (uint256, string memory) {
        require(availableTokenURIs.length != 0, "All NFTs have been minted!");

        uint256 newItemId = tokenIdCounter.current();
        tokenIdCounter.increment();

        (string memory uri, string[] memory newAvailableTokens) = Utils
            .getRandomItemFromArray(availableTokenURIs);

        console.log("minted! 1");
        console.log(uri);
        for (uint256 i = 0; i < newAvailableTokens.length; i++) {
            console.log(newAvailableTokens[i]);
        }
        console.log(
            "---------------------------------------------------------------"
        );

        availableTokenURIs = newAvailableTokens;
        minted.push(uri);

        _mint(recipient, newItemId);
        _setTokenURI(newItemId, uri);

        return (newItemId, uri);
    }

    function getMinted() public view returns (string[] memory) {
        return minted;
    }
}
