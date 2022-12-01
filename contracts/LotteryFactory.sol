//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract LotteryFactory is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _lotteryIds;
    uint256[] lotteryIdsList;

    constructor() {}

    struct LotteryItem {
        uint256 lotteryId;
        string item;
        uint32 minPeople;
        uint256 price;
        uint256 finishDate;
        bool status;
        address[] members;
    }

    mapping(uint256 => LotteryItem) lotteryItems;

    function addNewLottery(
        string memory item,
        uint32 minPeople,
        uint256 price,
        uint256 finishDate
    ) public onlyOwner returns (uint256) {
        bytes memory tempEmptyStringTest = bytes(item);
        require(tempEmptyStringTest.length > 0, "Item can't be empty");
        require(minPeople > 0, "Amount of people must be more than 0");
        require(price > 0, "Price must be more than 0");
        require(
            finishDate > block.timestamp,
            "FinishDate has to be in the future"
        );
        _lotteryIds.increment();
        uint256 id = _lotteryIds.current();
        LotteryItem memory newLotteryItem = LotteryItem(
            id,
            item,
            minPeople,
            price,
            finishDate,
            false,
            new address[](0)
        );
        lotteryItems[id] = newLotteryItem;

        lotteryIdsList.push(id);
        return id;
    }

    function getLoteryIds() public view returns (uint256[] memory) {
        return lotteryIdsList;
    }

    function getLotteryItem(
        uint256 lotteryId
    ) public view returns (LotteryItem memory) {
        LotteryItem storage item = lotteryItems[lotteryId];
        require(item.lotteryId != 0, "This item does not exist");
        return item;
    }

    function addLotteryMember(
        address userAddress,
        uint256 lotteryId
    ) public returns (LotteryItem memory) {
        LotteryItem storage item = lotteryItems[lotteryId];
        require(item.lotteryId != 0, "This item does not exist");
        item.members.push(userAddress);
        return item;
    }
}
