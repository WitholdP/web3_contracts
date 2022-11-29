import { ethers } from "hardhat";

async function main() {
  const contractNames = ["LotteryFactory"];

  for (const contractName of contractNames) {
    // We get the contract to deploy
    const Contract = await ethers.getContractFactory(contractName);
    const contract = await Contract.deploy();

    await contract.deployed();

    console.log(`Contract ${contractName} deployed to:`, contract.address);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
