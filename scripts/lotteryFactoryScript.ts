import { ethers } from "hardhat";
import { lotteryItem } from "../test/fixtures";

async function main() {
  const Contract = await ethers.getContractFactory("LotteryFactory");
  const contract = await Contract.deploy();
  // const postLottery = await contract.addNewLottery(
  //   lotteryItem.item,
  //   lotteryItem.minPeople,
  //   lotteryItem.price,
  //   lotteryItem.finishDate
  // );
  const ids = await contract.getLoteryIds();
  console.log(ids);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
