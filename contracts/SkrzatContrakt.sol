// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SkrzatContract is ERC20, Ownable {
    event NewSkrzatCoins(address skrzatWallet, uint256 amount);

    constructor() ERC20("SkrzatCoint", "SKC") {
        // ERC20 tokens have 18 decimals
        // number of tokens minted = n * 10^18
        uint256 n = 1000;
        _mint(msg.sender, n * 10**uint256(decimals()));
        emit NewSkrzatCoins(msg.sender, n);
    }

    function addSkrzatCoint(uint256 tokenAmount) public onlyOwner {
        _mint(msg.sender, tokenAmount * 10**uint256(decimals()));
        emit NewSkrzatCoins(msg.sender, tokenAmount);
    }
}
