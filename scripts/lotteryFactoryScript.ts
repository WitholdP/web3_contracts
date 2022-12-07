import { Contract } from "ethers";
import { ethers } from "hardhat";
import { lotteryItem } from "../test/LotteryTests/fixtures";

const main = async () => {
  const Contract = await ethers.getContractFactory("LotteryFactory");
  const contract = await Contract.deploy();

  await addNewLottery(contract);

  // Add new memnber to lettery
  await addNewLotteryMember(contract, 1);

  console.log(await contract.showLotteryMembers(1));
  // Show lottery details
  // console.log(await getLotteryDetails(contract, 1));
};

const addNewLotteryMember = async (contract: Contract, lotteryId: number) => {
  const [owner, otherAccount, otherAccount2] = await ethers.getSigners();
  await contract.connect(otherAccount).addLotteryMember(lotteryId, "asd", {
    value: ethers.utils.parseEther("0.1"),
  });

  await contract.connect(otherAccount2).addLotteryMember(lotteryId, "asd", {
    value: ethers.utils.parseEther("0.1"),
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
    lotteryItem.minPeople,
    lotteryItem.price,
    future
  );
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
