import hre from "hardhat";
import { upgrades } from "@openzeppelin/hardhat-upgrades";

const proxyAddress = "0x4e9A05647B23d6804EdE46F449e20348820F3C18";
const recipient = "0x04594C3434c516EC095d577C24b0f54E51bB2345";

async function main() {
  const connection = await hre.network.create();
  const { ethers } = connection;
  const upgradesApi = await upgrades(hre, connection);
  const [owner] = await ethers.getSigners();

  const V1 = await ethers.getContractFactory("MyTokenV1");
  const before = V1.attach(proxyAddress);
  const ownerBefore = await before.balanceOf(owner.address);
  const recipientBefore = await before.balanceOf(recipient);
  const implementationBefore =
    await upgradesApi.erc1967.getImplementationAddress(proxyAddress);
  const blockBefore = await ethers.provider.getBlockNumber();

  const V2 = await ethers.getContractFactory("MyTokenV2");
  const after = await upgradesApi.upgradeProxy(proxyAddress, V2, {
    kind: "transparent",
  });

  const implementationAfter =
    await upgradesApi.erc1967.getImplementationAddress(proxyAddress);
  const ownerAfter = await after.balanceOf(owner.address);
  const recipientAfter = await after.balanceOf(recipient);

  if (ownerBefore !== ownerAfter || recipientBefore !== recipientAfter) {
    throw new Error("Token balances changed during the upgrade");
  }

  const logs = await ethers.provider.getLogs({
    address: proxyAddress,
    fromBlock: blockBefore + 1,
    toBlock: "latest",
    topics: [ethers.id("Upgraded(address)")],
  });

  console.log("Proxy:", proxyAddress);
  console.log("Implementation before:", implementationBefore);
  console.log("Implementation after:", implementationAfter);
  console.log("Upgrade transaction:", logs.at(-1)?.transactionHash ?? "check explorer");
  console.log("Owner balance:", ethers.formatUnits(ownerAfter, 18));
  console.log("Recipient balance:", ethers.formatUnits(recipientAfter, 18));
  console.log("Version:", await after.version());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});