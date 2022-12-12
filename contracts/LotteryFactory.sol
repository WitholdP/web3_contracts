//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";

contract LotteryFactory is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _lotteryIds;
    uint256[] private lotteryIdsList;

    constructor() {}

    /**
     * @dev Throws if lottery does not exist.
     */
    modifier lotteryExists(uint256 lotteryId) {
        LotteryItem memory item = lotteryItems[lotteryId];
        require(item.lotteryId > 0, "This item does not exist");
        _;
    }

    struct Member {
        address adress;
        bool hasWon;
        string comment;
    }

    struct LotteryItem {
        uint256 lotteryId;
        string item;
        uint256 minPeople;
        uint256 price;
        uint256 finishDate;
        bool status;
    }

    event Winner(Member winner, uint256 lotteryId);

    mapping(uint256 => LotteryItem) private lotteryItems;
    mapping(uint256 => Member[]) private lotteryMembers;

    function addNewLottery(
        string memory item,
        uint256 minPeople,
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
            true
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
    ) public view lotteryExists(lotteryId) returns (LotteryItem memory) {
        LotteryItem storage item = lotteryItems[lotteryId];
        return item;
    }

    function addLotteryMember(
        uint256 lotteryId,
        string memory comment
    ) public payable lotteryExists(lotteryId) returns (Member[] memory) {
        LotteryItem storage item = lotteryItems[lotteryId];
        require(msg.value >= item.price, "You have paid to little for the bid");
        bytes memory tempEmptyStringTest = bytes(comment);
        require(tempEmptyStringTest.length > 0, "Comment can't be empty");
        Member memory member = Member(msg.sender, false, comment);
        lotteryMembers[lotteryId].push(member);
        return lotteryMembers[lotteryId];
    }

    function showLotteryMembers(
        uint256 lotteryId
    ) public view lotteryExists(lotteryId) returns (Member[] memory) {
        return lotteryMembers[lotteryId];
    }

    function resolveLottery(
        uint256 lotteryId,
        uint256 winner
    ) public onlyOwner lotteryExists(lotteryId) {
        Member[] storage members = lotteryMembers[lotteryId];
        require(
            winner < members.length,
            "Winner must be be in range from 0 to length of lottery members"
        );
        members[winner].hasWon = true;
        lotteryItems[lotteryId].status = false;
        emit Winner(members[winner], lotteryId);
    }
}
