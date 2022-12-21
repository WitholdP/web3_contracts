import { addLotteryMember, future } from "./fixtures";

import { Contract } from "ethers";
import { ethers } from "hardhat";
import { expect } from "chai";
import { lotteryItem } from "./fixtures";

describe("Add Lottery Member tests", function () {
  let contract: Contract;
  let item: number;
  let buyIn = "";

  before(async function () {
    const Contract = await ethers.getContractFactory("LotteryFactory");
    contract = await Contract.deploy();
    await contract.addNewLottery(
      lotteryItem.item,
      lotteryItem.name,
      lotteryItem.minPeople,
      lotteryItem.price,
      future
    );
    const lotteryItems = await contract.getLoteryIds();
    item = lotteryItems[0];

    buyIn = await contract.getBuyIn(item);
  });

  it("Test addLotteryMember does not exist", async function () {
    const [owner, otherAccount] = await ethers.getSigners();
    await expect(
      addLotteryMember(contract, otherAccount, 0, "comment")
    ).to.be.revertedWith("This item does not exist");
  });

  it("Test addLotteryMember to small bid", async function () {
    const [owner, otherAccount] = await ethers.getSigners();

    await expect(
      addLotteryMember(
        contract,
        otherAccount,
        item,
        "",
        ethers.utils.parseEther("0.0003")
      )
    ).to.be.revertedWith(`You have to pay ${buyIn}`);
    const getLotteryItemAfter = await contract.showLotteryMembers(item);
    expect(getLotteryItemAfter.length).to.equal(0);
  });

  it("Test addLotteryMember empty comment", async function () {
    const [owner, otherAccount] = await ethers.getSigners();

    await expect(
      addLotteryMember(contract, otherAccount, item)
    ).to.be.revertedWith("Comment can't be empty");
    const getLotteryItemAfter = await contract.showLotteryMembers(item);
    expect(getLotteryItemAfter.length).to.equal(0);
  });

  it("Test addLotteryMember", async function () {
    const [owner, otherAccount] = await ethers.getSigners();

    const getLotteryMembers = await contract.showLotteryMembers(item);
    expect(getLotteryMembers.length).to.equal(0);

    await addLotteryMember(contract, otherAccount, item, "comment");
    const getLotteryMembersAfter = await contract.showLotteryMembers(item);
    expect(getLotteryMembersAfter.length).to.equal(1);
    expect(await contract.provider.getBalance(contract.address)).to.equal(
      buyIn
    );
  });
});
