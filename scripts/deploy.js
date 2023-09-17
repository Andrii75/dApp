const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);

  // If your contract requires constructor parameters, add them in the 'args' array
  const ContractFactory = await hre.ethers.getContractFactory('NFTContract');
  const contract = await ContractFactory.deploy('Avatars', 'NFTA');

  console.log('Contract deployed to address:', contract.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
