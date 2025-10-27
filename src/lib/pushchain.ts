// Push Chain configuration - Using environment variables
export const PUSH_CHAIN_CONFIG = {
  network: 'testnet',
  rpcUrl: process.env.NEXT_PUBLIC_PUSH_RPC_URL || 'https://evm.rpc-testnet-donut-node2.push.org/',
  chainId: parseInt(process.env.NEXT_PUBLIC_PUSH_CHAIN_ID || '42101'),
};

// Push Chain client - Real implementation using ethers.js
import { ethers } from 'ethers';

// Token configuration types
export interface TokenInfo {
  symbol: string;
  name: string;
  logo: string;
  chain: string;
  category: 'popular' | 'testnet' | 'defi' | 'meme';
  contractAddress?: string; // For testnet tokens
  decimals?: number; // Token decimals
}

// Define supported token keys first to avoid circular reference
export type SupportedToken = 
  | 'PUSH' | 'ETH' | 'SOL' | 'BNB' | 'USDC' | 'USDT' | 'DAI' | 'UNI' | 'LINK' | 'AAVE' | 'RAY' | 'CAKE'
  | 'DOT' | 'ADA' | 'AVAX' | 'DOGE' | 'SHIB' | 'COMP' | 'MKR' | 'SNX' | 'WBTC'
  | 'pETH' | 'pSOL' | 'pUSDC' | 'pBNB';

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

// Supported tokens with their configurations
export const SUPPORTED_TOKENS: Record<SupportedToken, TokenInfo> = {
  SOL: {
    contractAddress: 'So11111111111111111111111111111111111111112',
    symbol: 'SOL',
    name: 'Solana',
    decimals: 9,
    chain: 'Solana',
    category: 'popular',
    logo: '🌞',
  },
  BNB: {
    contractAddress: '0x0000000000000000000000000000000000000000',
    symbol: 'BNB',
    name: 'BNB',
    decimals: 18,
    chain: 'BSC',
    category: 'popular',
    logo: '🟡',
  },
  
  // Push Chain Native
  PUSH: {
    symbol: 'PUSH',
    name: 'Push Chain',
    logo: '💎',
    chain: 'Push Chain',
    category: 'popular',
    decimals: 18,
  },
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    logo: '🟢',
    contractAddress: '0x0000000000000000000000000000000000000000',
    chain: 'Ethereum',
    category: 'popular',
    decimals: 18,
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    logo: '💙',
    contractAddress: '0xA0b86a33E6417f2D2B0B7f2FeFcdF96F8E0d1Ff8',
    chain: 'Ethereum',
    category: 'popular',
    decimals: 6,
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether USD',
    logo: '�',
    contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    chain: 'Ethereum',
    category: 'popular',
    decimals: 6,
  },
  DAI: {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    logo: '�',
    contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    chain: 'Ethereum',
    category: 'defi',
    decimals: 18,
  },

  // Popular DeFi Tokens
  UNI: {
    symbol: 'UNI',
    name: 'Uniswap',
    logo: '🦄',
    contractAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    chain: 'Ethereum',
    category: 'defi',
    decimals: 18,
  },
  LINK: {
    symbol: 'LINK',
    name: 'Chainlink',
    logo: '🔗',
    contractAddress: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    chain: 'Ethereum',
    category: 'defi',
    decimals: 18,
  },
  AAVE: {
    symbol: 'AAVE',
    name: 'Aave',
    logo: '🟣',
    contractAddress: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
    chain: 'Ethereum',
    category: 'defi',
    decimals: 18,
  },

  // DeFi tokens - Solana
  RAY: {
    symbol: 'RAY',
    name: 'Raydium',
    logo: '⚡',
    contractAddress: 'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt',
    chain: 'Solana',
    category: 'defi',
    decimals: 6,
  },

  // BSC tokens - DeFi
  CAKE: {
    symbol: 'CAKE',
    name: 'PancakeSwap',
    logo: '🥞',
    contractAddress: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
    chain: 'BSC',
    category: 'defi',
    decimals: 18,
  },
  DOT: {
    symbol: 'DOT',
    name: 'Polkadot',
    logo: '⚫',
    contractAddress: '0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402',
    chain: 'BSC',
    category: 'popular',
    decimals: 10,
  },
  ADA: {
    symbol: 'ADA',
    name: 'Cardano',
    logo: '🔵',
    contractAddress: '0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47',
    chain: 'BSC',
    category: 'popular',
    decimals: 6,
  },
  AVAX: {
    symbol: 'AVAX',
    name: 'Avalanche',
    logo: '🔺',
    contractAddress: '0x1CE0c2827e2eF14D5C4f29a091d735A204794041',
    chain: 'Avalanche',
    category: 'popular',
    decimals: 18,
  },

  // Meme tokens
  DOGE: {
    symbol: 'DOGE',
    name: 'Dogecoin',
    logo: '🐕',
    contractAddress: '0xbA2aE424d960c26247Dd6c32edC70B295c744C43',
    chain: 'BSC',
    category: 'meme',
    decimals: 8,
  },
  SHIB: {
    symbol: 'SHIB',
    name: 'Shiba Inu',
    logo: '🦮',
    contractAddress: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
    chain: 'Ethereum',
    category: 'meme',
    decimals: 18,
  },

  // DeFi blue chips
  COMP: {
    symbol: 'COMP',
    name: 'Compound',
    logo: '🏛️',
    contractAddress: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
    chain: 'Ethereum',
    category: 'defi',
    decimals: 18,
  },
  MKR: {
    symbol: 'MKR',
    name: 'Maker',
    logo: '🟢',
    contractAddress: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
    chain: 'Ethereum',
    category: 'defi',
    decimals: 18,
  },
  SNX: {
    symbol: 'SNX',
    name: 'Synthetix',
    logo: '⚪',
    contractAddress: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
    chain: 'Ethereum',
    category: 'defi',
    decimals: 18,
  },

  // Bitcoin variants
  WBTC: {
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    logo: '🟠',
    contractAddress: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    chain: 'Ethereum',
    category: 'popular',
    decimals: 8,
  },

  // Push Chain Wrapped Tokens
  pETH: {
    symbol: 'pETH',
    name: 'Push Ethereum',
    logo: '🔷',
    chain: 'Push Chain',
    category: 'popular',
    decimals: 18,
  },
  pSOL: {
    symbol: 'pSOL',
    name: 'Push Solana',
    logo: '🌞',
    chain: 'Push Chain',
    category: 'popular',
    decimals: 9,
  },
  pUSDC: {
    symbol: 'pUSDC',
    name: 'Push USDC',
    logo: '💵',
    chain: 'Push Chain',
    category: 'popular',
    decimals: 6,
  },
  pBNB: {
    symbol: 'pBNB',
    name: 'Push BNB',
    logo: '🟡',
    chain: 'Push Chain',
    category: 'popular',
    decimals: 18,
  },

  
} as const;

// SupportedToken type is already defined above

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