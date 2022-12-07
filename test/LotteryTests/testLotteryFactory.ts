import { Contract } from "ethers";
import { ethers } from "hardhat";
import { expect } from "chai";
import { lotteryItem } from "./fixtures";

describe("Signature Contract tests", function () {
  let contract: Contract;
  const date = new Date();
  const now = Math.round(date.getTime() / 1000);
  const past = now - 1000;
  const future = now + 1000;

  before(async function () {
    const Contract = await ethers.getContractFactory("LotteryFactory");
    contract = await Contract.deploy();
  });

  it("Test lotteryIdsList length after deployment", async function () {
    const lotteryIdsList = await contract.getLoteryIds();
    expect(lotteryIdsList.length).to.equal(0);
  });

  it("Test addNewLottery by NOT owner", async function () {
    const [owner, otherAccount] = await ethers.getSigners();
    await expect(
      contract
        .connect(otherAccount)
        .addNewLottery(
          lotteryItem.item,
          lotteryItem.minPeople,
          lotteryItem.price,
          future
        )
    ).to.be.revertedWith("Ownable: caller is not the owner");
    const lotteryIdsList = await contract.getLoteryIds();
    expect(lotteryIdsList.length).to.equal(0);
  });

  [
    {
      item: "",
      minPeople: lotteryItem.minPeople,
      price: lotteryItem.price,
      finishDate: future,
      revert: "Item can't be empty",
    },
    {
      item: lotteryItem.item,
      minPeople: 0,
      price: lotteryItem.price,
      finishDate: future,
      revert: "Amount of people must be more than 0",
    },
    {
      item: lotteryItem.item,
      minPeople: lotteryItem.minPeople,
      price: 0,
      finishDate: future,
      revert: "Price must be more than 0",
    },
    {
      item: lotteryItem.item,
      minPeople: lotteryItem.minPeople,
      price: lotteryItem.price,
      finishDate: past,
      revert: "FinishDate has to be in the future",
    },
  ].forEach((testCase) => {
    it(`Test validation addNewLottery: ${testCase.revert}`, async function () {
      await expect(
        contract.addNewLottery(
          testCase.item,
          testCase.minPeople,
          testCase.price,
          testCase.finishDate
        )
      ).to.be.revertedWith(testCase.revert);
      const lotteryIdsList = await contract.getLoteryIds();
      expect(lotteryIdsList.length).to.equal(0);
    });
  });

  it("Test addNewLottery", async function () {
    const newLottery = await contract.addNewLottery(
      lotteryItem.item,
      lotteryItem.minPeople,
      lotteryItem.price,
      future
    );
    const lotteryIdsList = await contract.getLoteryIds();
    expect(lotteryIdsList.length).to.equal(1);
  });

  // TODO Refactor all Does Not exist
  it("Test getLotteryItem does not exist", async function () {
    await expect(contract.getLotteryItem(0)).to.be.revertedWith(
      "This item does not exist"
    );
  });

  it("Test getLotteryItem", async function () {
    const lotteryIdsList = await contract.getLoteryIds();
    const getLotteryItem = await contract.getLotteryItem(lotteryIdsList[0]);
    expect(getLotteryItem.item).to.equal(lotteryItem.item);
    expect(getLotteryItem.minPeople).to.equal(lotteryItem.minPeople);
    expect(getLotteryItem.price).to.equal(lotteryItem.price);
    expect(getLotteryItem.finishDate).to.be.greaterThan(now);
    expect(getLotteryItem.status).to.equal(true);
  });

  it("Test addLotteryMember does not exist", async function () {
    const [owner, otherAccount] = await ethers.getSigners();
    await expect(
      contract.connect(otherAccount).addLotteryMember(0, "comment")
    ).to.be.revertedWith("This item does not exist");
  });

  [
    {
      bid: "0.01",
      comment: "comment",
      revert: "You have paid to little for the bid",
    },
    {
      bid: "0.1",
      comment: "",
      revert: "Comment can't be empty",
    },
  ].forEach((testCase) => {
    it(`Test addLotteryMember validation ${testCase.revert}`, async function () {
      const lotterItemId = 1;
      const [owner, otherAccount] = await ethers.getSigners();

      await expect(
        contract
          .connect(otherAccount)
          .addLotteryMember(lotterItemId, testCase.comment, {
            value: ethers.utils.parseEther(testCase.bid),
          })
      ).to.be.revertedWith(testCase.revert);
      const getLotteryItemAfter = await contract.showLotteryMembers(
        lotterItemId
      );
      expect(getLotteryItemAfter.length).to.equal(0);
    });
  });

  it("Test addLotteryMember", async function () {
    const lotterItemId = 1;
    const [owner, otherAccount] = await ethers.getSigners();
    const getLotteryMembers = await contract.showLotteryMembers(lotterItemId);
    expect(getLotteryMembers.length).to.equal(0);

    await contract
      .connect(otherAccount)
      .addLotteryMember(lotterItemId, "Comment", {
        value: lotteryItem.price,
      });
    const getLotteryMembersAfter = await contract.showLotteryMembers(
      lotterItemId
    );
    expect(getLotteryMembersAfter.length).to.equal(1);
  });

  it("Test showLotteryMembers does not exist", async function () {
    await expect(contract.showLotteryMembers(0)).to.be.revertedWith(
      "This item does not exist"
    );
  });

  it("Test showLotteryMembers", async function () {
    const lotterItemId = 1;
    const getLotteryMembers = await contract.showLotteryMembers(lotterItemId);
    expect(getLotteryMembers.length).to.equal(1);
  });

  //
});
