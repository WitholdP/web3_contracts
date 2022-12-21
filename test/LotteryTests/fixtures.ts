import { BigNumber } from "ethers";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";

const date = new Date();
export const now = Math.round(date.getTime() / 1000);
export const past = now - 1000;
export const future = now + 1000;

interface LotteryItem {
  item: string;
  name: string;
  minPeople: number;
  price: BigNumber;
}

export const lotteryItem: LotteryItem = {
  item: "https://sample.item.pl",
  name: "sample name",
  minPeople: 3,
  price: ethers.utils.parseEther("1"),
};

export const addLotteryMember = async (
  contract: Contract,
  account: SignerWithAddress,
  item: number,
  comment = "",
  buyIn: BigNumber | null = null
) => {
  if (!buyIn) {
    buyIn = await contract.getBuyIn(item);
  }
  return await contract.connect(account).addLotteryMember(item, comment, {
    value: buyIn,
  });
};
