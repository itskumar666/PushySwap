// Push Chain configuration - Using environment variables
export const PUSH_CHAIN_CONFIG = {
  network: 'testnet',
  rpcUrl: process.env.NEXT_PUBLIC_PUSH_RPC_URL || 'https://evm.rpc-testnet-donut-node2.push.org/',
  chainId: parseInt(process.env.NEXT_PUBLIC_PUSH_CHAIN_ID || '42069'),
};

// Push Chain client - Mock implementation for demo
export const pushChainClient = {
  config: PUSH_CHAIN_CONFIG,
  // Mock client methods for demo purposes
  getBalance: async (address: string) => {
    console.log('Getting balance for:', address);
    return '0.0';
  },
  sendTransaction: async (params: unknown) => {
    console.log('Sending transaction:', params);
    return `0x${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`;
  }
};

// Supported tokens for the Universal Swap
export const SUPPORTED_TOKENS = {
  // Wrapped tokens on Push Chain
  pETH: {
    address: '0x...', // Push Chain wrapped ETH
    symbol: 'pETH',
    name: 'Push Ethereum',
    decimals: 18,
    originChain: 'ethereum',
  },
  pSOL: {
    address: '0x...', // Push Chain wrapped SOL
    symbol: 'pSOL',
    name: 'Push Solana',
    decimals: 9,
    originChain: 'solana',
  },
  pUSDC: {
    address: '0x...', // Push Chain wrapped USDC
    symbol: 'pUSDC',
    name: 'Push USDC',
    decimals: 6,
    originChain: 'ethereum',
  },
  pBNB: {
    address: '0x...', // Push Chain wrapped BNB
    symbol: 'pBNB',
    name: 'Push BNB',
    decimals: 18,
    originChain: 'bsc',
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
  {
    id: 'pETH-pUSDC',
    tokenA: 'pETH' as SupportedToken,
    tokenB: 'pUSDC' as SupportedToken,
    address: '0x...', // Pool contract address
    fee: 0.003, // 0.3% fee
  },
  {
    id: 'pSOL-pUSDC',
    tokenA: 'pSOL' as SupportedToken,
    tokenB: 'pUSDC' as SupportedToken,
    address: '0x...', // Pool contract address
    fee: 0.003, // 0.3% fee
  },
  {
    id: 'pBNB-pUSDC',
    tokenA: 'pBNB' as SupportedToken,
    tokenB: 'pUSDC' as SupportedToken,
    address: '0x...', // Pool contract address
    fee: 0.003, // 0.3% fee
  },
] as const;

export type LiquidityPool = typeof LIQUIDITY_POOLS[number];