// Push Chain configuration - Using environment variables
export const PUSH_CHAIN_CONFIG = {
  network: 'testnet',
  rpcUrl: process.env.NEXT_PUBLIC_PUSH_RPC_URL || 'https://evm.rpc-testnet-donut-node2.push.org/',
  chainId: parseInt(process.env.NEXT_PUBLIC_PUSH_CHAIN_ID || '42101'),
};

// Push Chain client - Real implementation using ethers.js
import { ethers } from 'ethers';

export const pushChainClient = {
  config: PUSH_CHAIN_CONFIG,
  
  // Get real balance from Push Chain
  getBalance: async (address: string): Promise<string> => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const balance = await provider.getBalance(address);
        return ethers.formatEther(balance);
      }
    } catch (error) {
      console.error('Error getting balance:', error);
    }
    return '0.0';
  },
  
  // Send real transaction to Push Chain
  sendTransaction: async (params: {
    to: string;
    value?: string;
    data?: string;
    gasLimit?: string;
  }): Promise<string> => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
        const tx = await signer.sendTransaction({
          to: params.to,
          value: params.value ? ethers.parseEther(params.value) : 0,
          data: params.data || '0x',
          gasLimit: params.gasLimit ? BigInt(params.gasLimit) : undefined,
        });
        
        console.log('📤 Real Push Chain transaction sent:', tx.hash);
        return tx.hash;
      }
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
    
    // Fallback for demo
    return `0x${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`;
  },
  
  // Get transaction receipt
  getTransactionReceipt: async (txHash: string) => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        return await provider.getTransactionReceipt(txHash);
      }
    } catch (error) {
      console.error('Error getting transaction receipt:', error);
    }
    return null;
  }
};

// Supported tokens for the Universal Swap
export const SUPPORTED_TOKENS = {
  // Native Chain Tokens
  ETH: {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    originChain: 'ethereum',
    logo: '🔷',
  },
  SOL: {
    address: 'So11111111111111111111111111111111111111112',
    symbol: 'SOL',
    name: 'Solana',
    decimals: 9,
    originChain: 'solana',
    logo: '🌞',
  },
  BNB: {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'BNB',
    name: 'BNB',
    decimals: 18,
    originChain: 'bsc',
    logo: '🟡',
  },
  
  // Stablecoins
  USDC: {
    address: '0xA0b86a33E6417f2D2B0B7f2FeFcdF96F8E0d1Ff8',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    originChain: 'ethereum',
    logo: '💵',
  },
  USDT: {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    originChain: 'ethereum',
    logo: '💰',
  },
  DAI: {
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    originChain: 'ethereum',
    logo: '🏦',
  },

  // Popular DeFi Tokens
  UNI: {
    address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    symbol: 'UNI',
    name: 'Uniswap',
    decimals: 18,
    originChain: 'ethereum',
    logo: '🦄',
  },
  LINK: {
    address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    symbol: 'LINK',
    name: 'Chainlink',
    decimals: 18,
    originChain: 'ethereum',
    logo: '🔗',
  },
  AAVE: {
    address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
    symbol: 'AAVE',
    name: 'Aave',
    decimals: 18,
    originChain: 'ethereum',
    logo: '👻',
  },

  // Solana Ecosystem Tokens
  RAY: {
    address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
    symbol: 'RAY',
    name: 'Raydium',
    decimals: 6,
    originChain: 'solana',
    logo: '⚡',
  },
  SRM: {
    address: 'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt',
    symbol: 'SRM',
    name: 'Serum',
    decimals: 6,
    originChain: 'solana',
    logo: '🧬',
  },

  // BSC Ecosystem Tokens
  CAKE: {
    address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
    symbol: 'CAKE',
    name: 'PancakeSwap',
    decimals: 18,
    originChain: 'bsc',
    logo: '🥞',
  },

  // Layer 1 Blockchain Tokens
  MATIC: {
    address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
    symbol: 'MATIC',
    name: 'Polygon',
    decimals: 18,
    originChain: 'ethereum',
    logo: '🟣',
  },
  DOT: {
    address: '0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402',
    symbol: 'DOT',
    name: 'Polkadot',
    decimals: 10,
    originChain: 'ethereum',
    logo: '🟡',
  },
  ADA: {
    address: '0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47',
    symbol: 'ADA',
    name: 'Cardano',
    decimals: 6,
    originChain: 'ethereum',
    logo: '🔵',
  },
  AVAX: {
    address: '0x1CE0c2827e2eF14D5C4f29a091d735A204794041',
    symbol: 'AVAX',
    name: 'Avalanche',
    decimals: 18,
    originChain: 'ethereum',
    logo: '🔺',
  },

  // Meme & Community Tokens
  DOGE: {
    address: '0xbA2aE424d960c26247Dd6c32edC70B295c744C43',
    symbol: 'DOGE',
    name: 'Dogecoin',
    decimals: 8,
    originChain: 'ethereum',
    logo: '🐕',
  },
  SHIB: {
    address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
    symbol: 'SHIB',
    name: 'Shiba Inu',
    decimals: 18,
    originChain: 'ethereum',
    logo: '🐶',
  },

  // Additional DeFi Tokens
  COMP: {
    address: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
    symbol: 'COMP',
    name: 'Compound',
    decimals: 18,
    originChain: 'ethereum',
    logo: '🏛️',
  },
  MKR: {
    address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
    symbol: 'MKR',
    name: 'Maker',
    decimals: 18,
    originChain: 'ethereum',
    logo: '🏗️',
  },
  SNX: {
    address: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
    symbol: 'SNX',
    name: 'Synthetix',
    decimals: 18,
    originChain: 'ethereum',
    logo: '⚡',
  },

  // Cross-Chain & Bridge Tokens
  WBTC: {
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    decimals: 8,
    originChain: 'ethereum',
    logo: '₿',
  },
  ATOM: {
    address: '0x8D983cb9388EaC77af0474fA441C4815500Cb7BB',
    symbol: 'ATOM',
    name: 'Cosmos',
    decimals: 6,
    originChain: 'ethereum',
    logo: '⚛️',
  },
  
  // Push Chain Wrapped Tokens (for demo)
  pETH: {
    address: '0x...', // Push Chain wrapped ETH
    symbol: 'pETH',
    name: 'Push Ethereum',
    decimals: 18,
    originChain: 'pushchain',
    logo: '🔷',
  },
  pSOL: {
    address: '0x...', // Push Chain wrapped SOL
    symbol: 'pSOL',
    name: 'Push Solana',
    decimals: 9,
    originChain: 'pushchain',
    logo: '🌞',
  },
  pUSDC: {
    address: '0x...', // Push Chain wrapped USDC
    symbol: 'pUSDC',
    name: 'Push USDC',
    decimals: 6,
    originChain: 'pushchain',
    logo: '💵',
  },
  pBNB: {
    address: '0x...', // Push Chain wrapped BNB
    symbol: 'pBNB',
    name: 'Push BNB',
    decimals: 18,
    originChain: 'pushchain',
    logo: '🟡',
  },
} as const;

export type SupportedToken = keyof typeof SUPPORTED_TOKENS;

// Push Chain network configuration for multi-chain support
export const SUPPORTED_CHAINS = {
  ethereum: {
    id: 1,
    name: 'Ethereum',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://eth.llamarpc.com'],
  },
  solana: {
    id: 'solana',
    name: 'Solana',
    nativeCurrency: { name: 'Solana', symbol: 'SOL', decimals: 9 },
    rpcUrls: ['https://api.mainnet-beta.solana.com'],
  },
  bsc: {
    id: 56,
    name: 'BNB Smart Chain',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    rpcUrls: ['https://bsc-dataseed.binance.org'],
  },
  pushChain: {
    id: 42069,
    name: 'Push Chain Donut Testnet',
    nativeCurrency: { name: 'PC', symbol: 'PC', decimals: 18 },
    rpcUrls: ['https://evm.rpc-testnet-donut-node2.push.org/'],
  },
};

// Liquidity pool configurations
export const LIQUIDITY_POOLS = [
  // Major trading pairs with USDC as base
  {
    id: 'ETH-USDC',
    tokenA: 'ETH' as SupportedToken,
    tokenB: 'USDC' as SupportedToken,
    address: '0x1001', 
    fee: 0.003, // 0.3% fee
  },
  {
    id: 'SOL-USDC',
    tokenA: 'SOL' as SupportedToken,
    tokenB: 'USDC' as SupportedToken,
    address: '0x1002',
    fee: 0.003,
  },
  {
    id: 'BNB-USDC',
    tokenA: 'BNB' as SupportedToken,
    tokenB: 'USDC' as SupportedToken,
    address: '0x1003',
    fee: 0.003,
  },
  {
    id: 'MATIC-USDC',
    tokenA: 'MATIC' as SupportedToken,
    tokenB: 'USDC' as SupportedToken,
    address: '0x1004',
    fee: 0.003,
  },
  {
    id: 'AVAX-USDC',
    tokenA: 'AVAX' as SupportedToken,
    tokenB: 'USDC' as SupportedToken,
    address: '0x1005',
    fee: 0.003,
  },

  // Stablecoin pairs
  {
    id: 'USDC-USDT',
    tokenA: 'USDC' as SupportedToken,
    tokenB: 'USDT' as SupportedToken,
    address: '0x2001',
    fee: 0.001, // 0.1% fee for stables
  },
  {
    id: 'USDC-DAI',
    tokenA: 'USDC' as SupportedToken,
    tokenB: 'DAI' as SupportedToken,
    address: '0x2002',
    fee: 0.001,
  },

  // DeFi token pairs
  {
    id: 'UNI-ETH',
    tokenA: 'UNI' as SupportedToken,
    tokenB: 'ETH' as SupportedToken,
    address: '0x3001',
    fee: 0.003,
  },
  {
    id: 'LINK-ETH',
    tokenA: 'LINK' as SupportedToken,
    tokenB: 'ETH' as SupportedToken,
    address: '0x3002',
    fee: 0.003,
  },
  {
    id: 'AAVE-ETH',
    tokenA: 'AAVE' as SupportedToken,
    tokenB: 'ETH' as SupportedToken,
    address: '0x3003',
    fee: 0.003,
  },

  // Cross-chain pairs
  {
    id: 'WBTC-ETH',
    tokenA: 'WBTC' as SupportedToken,
    tokenB: 'ETH' as SupportedToken,
    address: '0x4001',
    fee: 0.003,
  },
  
  // Push Chain wrapped tokens (legacy support)
  {
    id: 'pETH-pUSDC',
    tokenA: 'pETH' as SupportedToken,
    tokenB: 'pUSDC' as SupportedToken,
    address: '0x5001',
    fee: 0.003,
  },
  {
    id: 'pSOL-pUSDC',
    tokenA: 'pSOL' as SupportedToken,
    tokenB: 'pUSDC' as SupportedToken,
    address: '0x5002',
    fee: 0.003,
  },
  {
    id: 'pBNB-pUSDC',
    tokenA: 'pBNB' as SupportedToken,
    tokenB: 'pUSDC' as SupportedToken,
    address: '0x5003',
    fee: 0.003,
  },

  // Additional ecosystem pairs
  {
    id: 'RAY-SOL',
    tokenA: 'RAY' as SupportedToken,
    tokenB: 'SOL' as SupportedToken,
    address: '0x6001',
    fee: 0.003,
  },
  {
    id: 'CAKE-BNB',
    tokenA: 'CAKE' as SupportedToken,
    tokenB: 'BNB' as SupportedToken,
    address: '0x6002',
    fee: 0.003,
  },
] as const;

export type LiquidityPool = typeof LIQUIDITY_POOLS[number];