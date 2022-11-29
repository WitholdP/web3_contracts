//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TwnklNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint256[] tokens;
    uint256 price;

    constructor() ERC721("Twnkl NFT", "TWNKLN") {
        // in WEI 0.1 ETH
        price = 100000000000000000;
    }

    event NewToken(address owner, uint256 tokenId);

    function mintNFT(string memory tokenURI) public payable returns (uint256) {
        require(msg.value >= price);
        payable(owner()).transfer(msg.value);
        uint256 tokenId = _tokenIds.current();

        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        tokens.push(tokenId);

        emit NewToken(msg.sender, tokenId);

        _tokenIds.increment();

        return tokenId;
    }

    function getTokenList() public view returns (uint256[] memory) {
        return tokens;
    }

    function getPrice() public view returns (uint256) {
        // Returns NFT price for minting in WEI. Will be converted to ETH by backend
        return price;
    }

    function setPrice(uint256 newPrice) public onlyOwner returns (uint256) {
        price = newPrice;
        return price;
    }
}
