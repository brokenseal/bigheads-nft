// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BigHeads is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    mapping(string => uint8) private existingURIs;

    constructor() ERC721("BigHeads", "BIGH") {}

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    // istanbul ignore next
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
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

    function isContentOwned(string memory uri) public view returns(bool) {
        return existingURIs[uri] == 1;
    }

    function mint(address recipient, string memory uri) public payable returns (bool, uint256) {
        require(!isContentOwned(uri), "NFT already minted!");
        require(msg.value >= 0.01 ether, "Minimum amount of ether to mint: 0.01");

        uint256 newItemId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        existingURIs[uri] = 1; 

        _mint(recipient, newItemId);
        _setTokenURI(newItemId, uri);

        return (true, newItemId);
    }

    function count() public view returns(uint256) {
        return _tokenIdCounter.current();
    }
}
