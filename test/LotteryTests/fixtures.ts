import { BigNumber } from "ethers";
import { ethers } from "hardhat";

interface LotteryItem {
  item: string;
  minPeople: number;
  price: BigNumber;
}

export const lotteryItem: LotteryItem = {
  item: "https://sample.item.pl",
  minPeople: 100,
  price: ethers.utils.parseEther("1"),
};
