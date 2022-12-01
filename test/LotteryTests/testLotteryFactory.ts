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
    expect(getLotteryItem.status).to.equal(false);
    expect(getLotteryItem.members.length).to.equal(0);
  });
});
