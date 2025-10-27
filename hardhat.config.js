require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: '.env.local' });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    pushchain: {
      url: "https://evm.rpc-testnet-donut-node2.push.org/",
      chainId: 42101,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 20000000000, // 20 gwei
      gas: 6000000
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  },
  etherscan: {
    apiKey: {
      pushchain: "abc" // Push Chain explorer (if available)
    },
    customChains: [
      {
        network: "pushchain",
        chainId: 42101,
        urls: {
          apiURL: "https://scan.push.org/api",
          browserURL: "https://scan.push.org"
        }
      }
    ]
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};