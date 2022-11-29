//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TwnkleSignatures is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint256[] certificates;
    uint256 price;

    constructor() ERC721("Twnkle Signatures", "TWNKL") {
        // in WEI 0.2 ETH
        price = 200000000000000000;
    }

    struct Certificate {
        uint256 certificateId;
        address certficateOwner;
        uint256 level;
        string[] signatures;
    }

    event NewCertificate(address certficateOwner, uint256 certificateId);

    mapping(uint256 => Certificate) private tokenIdToCertificate;

    function mintCertificate(
        string memory tokenURI,
        string[] memory signatureList
    ) public payable returns (uint256) {
        require(msg.value >= price);
        uint256 certificateId = _tokenIds.current();
        address owner = owner();
        _mint(owner, certificateId);
        _setTokenURI(certificateId, tokenURI);
        certificates.push(certificateId);

        Certificate memory certificate = Certificate(
            certificateId,
            msg.sender,
            0,
            signatureList
        );
        tokenIdToCertificate[certificateId] = certificate;

        emit NewCertificate(msg.sender, certificateId);
        payable(owner).transfer(msg.value);

        _tokenIds.increment();

        return certificateId;
    }

    function addSignature(
        uint256 _certificateId,
        string[] memory _newSignatures
    ) public returns (Certificate memory) {
        Certificate storage certificate = tokenIdToCertificate[_certificateId];
        require(certificate.certficateOwner == msg.sender);

        for (uint256 i = 0; i < _newSignatures.length; i++) {
            certificate.signatures.push(_newSignatures[i]);
        }
        return certificate;
    }

    function getCertificateIdList() public view returns (uint256[] memory) {
        return certificates;
    }

    function getCertificateDetails(uint256 tokenId)
        public
        view
        returns (Certificate memory)
    {
        return tokenIdToCertificate[tokenId];
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
