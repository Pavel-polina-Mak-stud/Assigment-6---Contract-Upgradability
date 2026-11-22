import hre from "hardhat";
import { upgrades } from "@openzeppelin/hardhat-upgrades";

async function main() {
  const connection = await hre.network.create();
  const { ethers } = connection;
  const upgradesApi = await upgrades(hre, connection);
  const [owner, recipient] = await ethers.getSigners();

  const V1 = await ethers.getContractFactory("MyTokenV1");
  const V2 = await ethers.getContractFactory("MyTokenV2");
  const Proxy = await ethers.getContractFactory("MyTokenProxy");

  const token = await upgradesApi.deployProxy(
    V1,
    [owner.address, ethers.parseUnits("100", 18)],
    {
      kind: "transparent",
      proxyFactory: Proxy,
      initialOwner: owner.address,
    }
  );
  await token.waitForDeployment();

  const proxyAddress = await token.getAddress();
  console.log("Proxy:", proxyAddress);

  await (await token.mint(owner.address, ethers.parseUnits("10", 18))).wait();
  await (await token.transfer(recipient.address, ethers.parseUnits("25", 18))).wait();

  const ownerBefore = await token.balanceOf(owner.address);
  const recipientBefore = await token.balanceOf(recipient.address);
  console.log("Before upgrade:", ethers.formatUnits(ownerBefore, 18),
    ethers.formatUnits(recipientBefore, 18));

  const upgraded = await upgradesApi.upgradeProxy(proxyAddress, V2);

  const ownerAfter = await upgraded.balanceOf(owner.address);
  const recipientAfter = await upgraded.balanceOf(recipient.address);
  const version = await upgraded.version();

  if (ownerAfter !== ownerBefore || recipientAfter !== recipientBefore) {
    throw new Error("Balances changed after upgrade");
  }
  if (version !== "V2") {
    throw new Error("Wrong version");
  }

  console.log("After upgrade:", ethers.formatUnits(ownerAfter, 18),
    ethers.formatUnits(recipientAfter, 18));
  console.log("Version:", version);
  console.log("Upgrade check passed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});