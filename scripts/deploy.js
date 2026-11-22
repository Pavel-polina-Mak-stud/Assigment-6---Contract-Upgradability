import hre from "hardhat";
import { upgrades } from "@openzeppelin/hardhat-upgrades";

async function main() {
  const connection = await hre.network.create();
  const { ethers } = connection;
  const upgradesApi = await upgrades(hre, connection);
  const [deployer] = await ethers.getSigners();

  const TokenV1 = await ethers.getContractFactory("MyTokenV1");
  const Proxy = await ethers.getContractFactory("MyTokenProxy");
  const initialSupply = ethers.parseUnits("1000000", 18);

  const token = await upgradesApi.deployProxy(
    TokenV1,
    [deployer.address, initialSupply],
    {
      kind: "transparent",
      proxyFactory: Proxy,
      initialOwner: deployer.address,
    }
  );
  await token.waitForDeployment();

  const proxyAddress = await token.getAddress();

  console.log("Owner:", deployer.address);
  console.log("Proxy:", proxyAddress);
  console.log(
    "V1 implementation:",
    await upgradesApi.erc1967.getImplementationAddress(proxyAddress)
  );
  console.log(
    "ProxyAdmin:",
    await upgradesApi.erc1967.getAdminAddress(proxyAddress)
  );
  console.log(
    "Initial balance:",
    ethers.formatUnits(await token.balanceOf(deployer.address), 18)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});