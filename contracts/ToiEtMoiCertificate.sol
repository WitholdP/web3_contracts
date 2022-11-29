//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ToiEtMoiCertificate is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint256[] certificates;

    constructor() ERC721("Toi Et Moi Certificates", "TEM") {}

    event NewCertificate(address owner, uint256 certificateId);

    function mintNFT(string memory tokenURI)
        public
        onlyOwner
        returns (uint256)
    {
        uint256 certificateId = _tokenIds.current();
        _mint(msg.sender, certificateId);
        _setTokenURI(certificateId, tokenURI);
        certificates.push(certificateId);

        emit NewCertificate(msg.sender, certificateId);

        _tokenIds.increment();

        return certificateId;
    }

    function getCertificates() public view returns (uint256[] memory) {
        return certificates;
    }
}
