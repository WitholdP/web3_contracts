import { ethers } from "hardhat";
import { expect } from "chai";

describe("Signature Contract tests", function () {
  let contract: any;

  before(async function () {
    const Contract = await ethers.getContractFactory("LotteryFactory");
    contract = await Contract.deploy();
  });

  it("Check lotteryIdsList length after deployment", async function () {
    const lotteryIdsList = await contract.getLoteryIds();
    expect(lotteryIdsList.length).to.equal(0);
  });

  // it("Check addNewLottery", async function () {
  //   const lotteryIdsList = await contract.addNewLottery();
  //   expect(lotteryIdsList.length).to.equal(0);
  // });
});
