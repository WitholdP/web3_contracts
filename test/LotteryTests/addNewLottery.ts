import { future, past } from "./fixtures";

import { Contract } from "ethers";
import { ethers } from "hardhat";
import { expect } from "chai";
import { lotteryItem } from "./fixtures";

describe("Add new Lottery tests", function () {
  let contract: Contract;

  before(async function () {
    const Contract = await ethers.getContractFactory("LotteryFactory");
    contract = await Contract.deploy();
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
    await contract.addNewLottery(
      lotteryItem.item,
      lotteryItem.minPeople,
      lotteryItem.price,
      future
    );
    const lotteryIdsList = await contract.getLoteryIds();
    expect(lotteryIdsList.length).to.equal(1);
  });
});
