import { addLotteryMember, future, now } from "./fixtures";

import { Contract } from "ethers";
import { ethers } from "hardhat";
import { expect } from "chai";
import { lotteryItem } from "./fixtures";

describe("Lottery helper functions tests", function () {
  let contract: Contract;

  before(async function () {
    const Contract = await ethers.getContractFactory("LotteryFactory");
    contract = await Contract.deploy();
  });

  it("Test lotteryIdsList length after deployment", async function () {
    const lotteryIdsList = await contract.getLoteryIds();
    expect(lotteryIdsList.length).to.equal(0);
  });

  // TODO Refactor all Does Not exist
  it("Test getLotteryItem does not exist", async function () {
    await expect(contract.getLotteryItem(0)).to.be.revertedWith(
      "This item does not exist"
    );
  });

  it("Test getLotteryItem", async function () {
    await contract.addNewLottery(
      lotteryItem.item,
      lotteryItem.minPeople,
      lotteryItem.price,
      future
    );
    const lotteryIdsList = await contract.getLoteryIds();
    const getLotteryItem = await contract.getLotteryItem(lotteryIdsList[0]);
    expect(getLotteryItem.item).to.equal(lotteryItem.item);
    expect(getLotteryItem.minPeople).to.equal(lotteryItem.minPeople);
    expect(getLotteryItem.price).to.equal(lotteryItem.price);
    expect(getLotteryItem.finishDate).to.be.greaterThan(now);
    expect(getLotteryItem.status).to.equal(true);
  });

  it("Test showLotteryMembers does not exist", async function () {
    await expect(contract.showLotteryMembers(0)).to.be.revertedWith(
      "This item does not exist"
    );
  });

  it("Test showLotteryMembers", async function () {
    const [owner, otherAccount] = await ethers.getSigners();
    const lotteryItems = await contract.getLoteryIds();
    const item = lotteryItems[0];

    await addLotteryMember(contract, otherAccount, item, "comment");

    const getLotteryMembers = await contract.showLotteryMembers(item);
    expect(getLotteryMembers.length).to.equal(1);
  });
});
