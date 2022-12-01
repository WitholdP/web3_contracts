import { Contract } from "ethers";
import { ethers } from "hardhat";
import { expect } from "chai";
import { lotteryItem } from "./fixtures";

describe("Signature Contract tests", function () {
  let contract: Contract;
  let now: number;
  let past: number;
  let future: number;

  before(async function () {
    const Contract = await ethers.getContractFactory("LotteryFactory");
    contract = await Contract.deploy();
    const date = new Date();
    now = Math.round(date.getTime() / 1000);
    past = now - 1000;
    future = now + 1000;
  });

  beforeEach(function () {});

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

  it("Test addNewLottery time before current date", async function () {
    await expect(
      contract.addNewLottery(
        lotteryItem.item,
        lotteryItem.minPeople,
        lotteryItem.price,
        past
      )
    ).to.be.revertedWith("finishDate has to be in the future");
    const lotteryIdsList = await contract.getLoteryIds();
    expect(lotteryIdsList.length).to.equal(0);
  });

  it("Test addNewLottery by owner", async function () {
    const newLottery = await contract.addNewLottery(
      lotteryItem.item,
      lotteryItem.minPeople,
      lotteryItem.price,
      future
    );
    const lotteryIdsList = await contract.getLoteryIds();
    expect(lotteryIdsList.length).to.equal(1);
  });

  it("Test getLotteryItem", async function () {
    const lotteryIdsList = await contract.getLoteryIds();
    const getLotteryItem = await contract.getLotteryItem(lotteryIdsList[0]);

    expect(getLotteryItem.item).to.equal(lotteryItem.item);
    expect(getLotteryItem.minPeople).to.equal(lotteryItem.minPeople);
    expect(getLotteryItem.price).to.equal(lotteryItem.price);
    expect(getLotteryItem.finishDate).to.be.greaterThan(now);
    expect(getLotteryItem.status).to.equal(false);
  });
});
