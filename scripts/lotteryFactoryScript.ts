import { Contract } from "ethers";
import { ethers } from "hardhat";
import { lotteryItem } from "../test/LotteryTests/fixtures";

const main = async () => {
  const Contract = await ethers.getContractFactory("LotteryFactory");
  const contract = await Contract.deploy();
  await addNewLottery(contract);
  // await contract.addLotteryMember(
  //   "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
  //   0
  // );
  // console.log(await getLotteryDetails(contract, 0));
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
    "",
    lotteryItem.minPeople,
    lotteryItem.price,
    future
  );
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
