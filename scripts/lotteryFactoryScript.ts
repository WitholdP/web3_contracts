import { ethers } from "hardhat";

async function main() {
  const Contract = await ethers.getContractFactory("LotteryFactory");
  const contract = await Contract.deploy();
  const x = await contract.getLoteryIds();
  console.log(x);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
