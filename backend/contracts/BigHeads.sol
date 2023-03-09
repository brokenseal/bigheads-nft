// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// import "truffle/console.sol";

import "./Utils.sol";

contract BigHeads is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private tokenIdCounter;

    uint256[] private minted;
    string[] private availableTokenURIs;

    constructor(string[] memory tokenURIs) ERC721("BigHeads", "BIGH") {
        availableTokenURIs = tokenURIs;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://bigheads-nft.infura-ipfs.io/ipfs/";
    }

    // Override required by Solidity.
    // Currently not exposed to the external world.
    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        address tokenOwner = ownerOf(tokenId);

        require(
            msg.sender == tokenOwner,
            "Only token owner can burn the token"
        );

        super._burn(tokenId);
    }

    // Override required by Solidity.
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
        require(availableTokenURIs.length != 0, "All NFTs have been minted!");

        uint256 newTokenId = tokenIdCounter.current();
        tokenIdCounter.increment();

        (string memory uri, string[] memory newAvailableTokens) = Utils
            .getRandomItemFromArray(availableTokenURIs);

        availableTokenURIs = newAvailableTokens;
        minted.push(newTokenId);

        _safeMint(recipient, newTokenId);
        _setTokenURI(newTokenId, uri);

        return (newTokenId, uri);
    }

    function getMinted() public view returns (uint256[] memory) {
        return minted;
    }

    function getAvailableCount() public view returns (uint256) {
        return availableTokenURIs.length;
    }
}
