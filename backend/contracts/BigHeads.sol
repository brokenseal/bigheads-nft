// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// import "truffle/console.sol";

import "./Utils.sol";

/*
Gas improvements:
1/5: 253185
5/5: 167025

1/20: 424461
2/20: 445781
3/20: 423154
4/20: 412119
5/20: 383696

1/20: 426930
2/20: 395530
3/20: 395530
4/20: 395530
5/20: 395530
*/

contract BigHeads is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private tokenIdCounter;

    uint256[] private minted;
    uint private cursor;
    string[] private availableTokenURIs;

    constructor(string[] memory tokenURIs) ERC721("BigHeads", "BIGH") {
        availableTokenURIs = tokenURIs;
        cursor = tokenURIs.length - 1;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://bigheads-nft.infura-ipfs.io/ipfs/";
    }

    // Override required by Solidity.
    // Currently not exposed to the external world.
    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        address tokenOwner = ownerOf(tokenId);

        require(
            msg.sender == tokenOwner,
            "Only token owner can burn the token"
        );

        super._burn(tokenId);
    }

    // Override required by Solidity.
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function mint(
        address recipient
    ) public payable returns (uint256, string memory) {
        require(
            msg.value >= 0.01 ether,
            "Minimum amount of ether to mint: 0.01"
        );
        require(availableTokenURIs.length != 0, "All NFTs have been minted!");

        uint256 newTokenId = tokenIdCounter.current();
        tokenIdCounter.increment();

        (
            string memory uri,
            string[] memory newAvailableTokens,
            uint newCursor
        ) = Utils.getRandomItemFromArray(availableTokenURIs, cursor);

        cursor = newCursor;
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
        return cursor + 1;
    }
}
