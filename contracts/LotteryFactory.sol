//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

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
        uint32 finishDate;
        bool status;
    }

    mapping(uint256 => LotteryItem) lotteryItems;

    function addNewLottery(
        string memory item,
        uint32 minPeople,
        uint256 price,
        uint32 finishDate
    ) public onlyOwner returns (uint256) {
        uint256 id = _lotteryIds.current();
        LotteryItem memory newLotteryItem = LotteryItem(
            id,
            item,
            minPeople,
            price,
            finishDate,
            false
        );
        lotteryItems[id] = newLotteryItem;

        lotteryIdsList.push(id);
        _lotteryIds.increment();
        return id;
    }

    function getLoteryIds() public view returns (uint256[] memory) {
        return lotteryIdsList;
    }

    function getLotteryItem(
        uint256 lotteryId
    ) public view returns (LotteryItem memory) {
        return lotteryItems[lotteryId];
    }
}
