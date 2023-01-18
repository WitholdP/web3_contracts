import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { lotteryItem } from "../test/LotteryTests/fixtures";

const main = async () => {
  const Contract = await ethers.getContractFactory("LotteryFactory");
  const contract = await Contract.deploy();
  const [owner, otherAccount, otherAccount2] = await ethers.getSigners();

  await addNewLottery(contract);

  console.log(await contract.getBuyIn(1));

  // Add new member to lottery
  await addNewLotteryMember(contract, 1, otherAccount, otherAccount2);

  // console.log("Before resolve");
  // await checkBalances(contract, owner, otherAccount, otherAccount2);

  // Resolve lottery
  // await contract.resolveLottery(1, 0);

  // console.log("after resolve");
  // await checkBalances(contract, owner, otherAccount, otherAccount2);

  // Show lottery details
  // console.log(await getLotteryDetails(contract, 1));

  // Show lottery members
  // console.log(await contract.showLotteryMembers(1));

  // Show buyin
  // console.log(await contract.getBuyIn(1));
};

const addNewLotteryMember = async (
  contract: Contract,
  lotteryId: number,
  otherAccount: SignerWithAddress,
  otherAccount2: SignerWithAddress
) => {
  await contract
    .connect(otherAccount)
    .addLotteryMember(lotteryId, "otherAccount comment", {
      value: ethers.utils.parseEther("0.333333333333333333"),
    });

  await contract
    .connect(otherAccount)
    .addLotteryMember(lotteryId, "otherAccount comment", {
      value: ethers.utils.parseEther("0.333333333333333333"),
    });

  await contract
    .connect(otherAccount2)
    .addLotteryMember(lotteryId, "otherAccount2 comment", {
      value: ethers.utils.parseEther("0.333333333333333333"),
    });
};

const getLotteryIds = async (contract: Contract) => {
  const ids = await contract.getLoteryIds();
  return ids;
};

const getLotteryDetails = async (contract: Contract, lotteryId: number) => {
  const details = await contract.getLotteryItem(lotteryId);
  return details;
};

const addNewLottery = async (contract: Contract) => {
  const date = new Date();
  const future = Math.round(date.getTime() / 1000) + 1000;
  await contract.addNewLottery(
    lotteryItem.item,
    lotteryItem.name,
    3,
    lotteryItem.price,
    future
  );
};

const checkBalances = async (
  contract: Contract,
  owner: SignerWithAddress,
  otherAccount: SignerWithAddress,
  otherAccount2: SignerWithAddress
) => {
  console.log(
    `Contract: ${await contract.provider.getBalance(contract.address)}`
  );
  console.log(
    `Other1: ${await contract.provider.getBalance(otherAccount.address)}`
  );
  console.log(
    `Other2: ${await contract.provider.getBalance(otherAccount2.address)}`
  );
  console.log(`Owner: ${await contract.provider.getBalance(owner.address)}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
