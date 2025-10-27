const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 === DEPLOYING UNIVERSAL SWAP TO PUSH CHAIN ===");
  console.log("");

  // Get the deployer account
  const signers = await ethers.getSigners();
  
  if (signers.length === 0) {
    console.log("❌ No signers available!");
    console.log("💡 Make sure PRIVATE_KEY is set in .env.local");
    return;
  }
  
  const deployer = signers[0];
  const deployerAddress = await deployer.getAddress();
  
  console.log("👤 Deploying with account:", deployerAddress);
  
  // Check balance
  const balance = await deployer.provider.getBalance(deployerAddress);
  console.log("💰 Account balance:", ethers.formatEther(balance), "PUSH");
  
  if (balance < ethers.parseEther("0.01")) {
    console.log("⚠️  Warning: Low balance for deployment!");
  }

  // Deploy the contract
  console.log("🏗️  Deploying UniversalSwap contract...");
  
  const UniversalSwap = await ethers.getContractFactory("UniversalSwap");
  const universalSwap = await UniversalSwap.deploy();
  
  console.log("⏳ Waiting for deployment confirmation...");
  await universalSwap.waitForDeployment();
  
  const contractAddress = await universalSwap.getAddress();
  
  console.log("🎉 UniversalSwap deployed successfully!");
  console.log("📍 Contract address:", contractAddress);
  console.log("🔍 Explorer:", `https://scan.push.org/address/${contractAddress}`);
  console.log("");
  
  // Verify deployment by calling a read function
  console.log("✅ Verifying deployment...");
  const supportedTokens = await universalSwap.getSupportedTokens();
  console.log("🪙 Supported tokens:", supportedTokens.length);
  console.log("📊 Token list:", supportedTokens.slice(0, 5).join(", "), "...");
  
  // Get contract stats
  const stats = await universalSwap.getStats();
  console.log("📈 Initial stats:");
  console.log("   • Total swaps:", stats[0].toString());
  console.log("   • Total volume:", ethers.formatEther(stats[1]), "ETH");
  console.log("   • Supported tokens:", stats[3].toString());
  
  console.log("");
  console.log("🏆 === DEPLOYMENT SUCCESS ===");
  console.log("✅ Real smart contract deployed on Push Chain!");
  console.log("✅ Ready for hackathon demonstration");
  console.log("✅ Judges can verify on-chain at:", contractAddress);
  console.log("");
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    deployer: deployerAddress,
    network: "Push Chain Donut Testnet",
    chainId: 42101,
    deploymentTime: new Date().toISOString(),
    explorer: `https://scan.push.org/address/${contractAddress}`
  };
  
  console.log("💾 Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });