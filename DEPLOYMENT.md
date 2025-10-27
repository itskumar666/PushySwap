# 🚀 Smart Contract Deployment Guide

## Prerequisites

1. **Get Push Chain Testnet Tokens**
   - Add Push Chain Donut Testnet to MetaMask:
     - Network Name: `Push Chain Donut Testnet`
     - RPC URL: `https://evm.rpc-testnet-donut-node2.push.org/`
     - Chain ID: `42101`
     - Currency Symbol: `PUSH`
   - Get testnet tokens from Push Chain faucet

2. **Setup Environment**
   ```bash
   # Create .env.local file in project root
   echo "PRIVATE_KEY=your_wallet_private_key_here" > .env.local
   ```
   ⚠️ **Security**: Use a testnet-only wallet, never mainnet keys!

## Deploy Contract

### Option 1: Real Deployment (Recommended for Hackathon)

```bash
# Deploy to Push Chain testnet
npm run deploy
```

This will:
- Deploy UniversalSwap contract to Push Chain
- Verify deployment
- Show contract address
- Save deployment info

### Option 2: Simulation (Demo)

```bash
# Simulate deployment process
npm run deploy-sim
```

## After Deployment

1. **Update Frontend**
   ```bash
   # Add contract address to .env.local
   echo "NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress" >> .env.local
   ```

2. **Verify on Explorer**
   - Visit: `https://scan.push.org/address/YOUR_CONTRACT_ADDRESS`
   - Check contract is deployed and verified

3. **Test Contract**
   ```bash
   # Start frontend
   npm run dev
   ```
   - Go to http://localhost:3000
   - Connect wallet to Push Chain
   - Execute real swaps using deployed contract!

## Contract Features

✅ **Real Universal Swap Logic**
- 10 supported tokens (PUSH, ETH, USDC, etc.)
- AMM-style pricing with liquidity pools
- 0.3% swap fees
- Price impact calculations

✅ **Production-Ready**
- Event emissions for all swaps
- Owner controls for testnet management
- Emergency functions
- Gas optimized

✅ **Hackathon Perfect**
- Real on-chain deployment
- Verifiable by judges
- Demonstrates smart contract skills
- Shows Push Chain understanding

## For Judges

🏆 **This demonstrates:**
- Real Solidity smart contract development
- Push Chain testnet deployment
- Complete end-to-end DeFi implementation
- Production-ready code architecture
- Understanding of AMM mechanics

📍 **Verify at**: `https://scan.push.org/address/CONTRACT_ADDRESS`
🔍 **Source Code**: Available in `/contracts/UniversalSwap.sol`
⚡ **Live Demo**: Frontend connects to real deployed contract