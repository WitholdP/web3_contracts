import { assert, expect } from "chai";

import { Contract } from "ethers";
import { addLotteryMember } from "./fixtures";
import { ethers } from "hardhat";
import { future } from "./fixtures";
import { lotteryItem } from "./fixtures";

describe("Lottery resolve tests", function () {
  let contract: Contract;
  let itemWinner: number;
  let itemReturn: number;

  before(async function () {
    const Contract = await ethers.getContractFactory("LotteryFactory");
    contract = await Contract.deploy();
    await contract.addNewLottery(
      lotteryItem.item + "winner",
      lotteryItem.name,
      lotteryItem.minPeople,
      lotteryItem.price,
      future
    );
    await contract.addNewLottery(
      lotteryItem.item + "return",
      lotteryItem.name,
      lotteryItem.minPeople,
      lotteryItem.price,
      future
    );
    const lotteryIds = await contract.getLoteryIds();
    // Used for all the cases and positive resolve
    itemWinner = lotteryIds[0];
    // Used for negative resolve and return of the funds
    itemReturn = lotteryIds[1];
  });

  it("Test resolveLottery does not exist", async function () {
    await expect(contract.resolveLottery(0, 0)).to.be.revertedWith(
      "This item does not exist"
    );
  });

  it("Test resolveLottery by other account", async function () {
    const [owner, otherAccount] = await ethers.getSigners();
    await expect(
      contract.connect(otherAccount).resolveLottery(itemWinner, 0)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Test resolveLottery winner", async function () {
    const [owner, otherAccount, otherAccount2, otherAccount3] =
      await ethers.getSigners();

    await addLotteryMember(contract, otherAccount, itemWinner, "comment");
    await addLotteryMember(contract, otherAccount2, itemWinner, "comment");
    await addLotteryMember(contract, otherAccount3, itemWinner, "comment");

    const ownerBalanceAfterMembers = await contract.provider.getBalance(
      owner.address
    );

    await contract.resolveLottery(itemWinner, 0);

    const getLotteryMembers = await contract.showLotteryMembers(itemWinner);
    expect(getLotteryMembers[0].hasWon).to.equal(true);

    const lottery = await contract.getLotteryItem(itemWinner);
    expect(lottery.status).to.equal(false);

    expect(await contract.provider.getBalance(owner.address)).to.greaterThan(
      ownerBalanceAfterMembers
    );
    expect(await contract.provider.getBalance(contract.address)).to.equal(0);
  });

  it("Test resolveLottery return money", async function () {
    const [owner, otherAccount, otherAccount2] = await ethers.getSigners();

    const ownerBalanceBeforeMembers = await contract.provider.getBalance(
      owner.address
    );
    const otherAccountBalanceBeforeMembers = await contract.provider.getBalance(
      otherAccount.address
    );
    const otherAccount2BalanceBeforeMembers =
      await contract.provider.getBalance(otherAccount2.address);

    await addLotteryMember(contract, otherAccount, itemReturn, "comment");
    await addLotteryMember(contract, otherAccount2, itemReturn, "comment");

    await contract.resolveLottery(itemReturn, 0);

    const lottery = await contract.getLotteryItem(itemReturn);
    expect(lottery.status).to.equal(false);

    expect(await contract.provider.getBalance(contract.address)).to.equal(0);

    // Below tests take into consideration gas fee thus small differences in balance are acceptable
    const currentOwnerBalance = await contract.provider.getBalance(
      owner.address
    );
    assert.closeTo(
      Number(currentOwnerBalance),
      Number(ownerBalanceBeforeMembers),
      200000000000000
    );

    const currentOtherAccountBalance = await contract.provider.getBalance(
      otherAccount.address
    );
    assert.closeTo(
      Number(otherAccountBalanceBeforeMembers),
      Number(currentOtherAccountBalance),
      200000000000000
    );

    const currentOtherAccount2Balance = await contract.provider.getBalance(
      otherAccount2.address
    );
    assert.closeTo(
      Number(otherAccount2BalanceBeforeMembers),
      Number(currentOtherAccount2Balance),
      200000000000000
    );
  });
});
