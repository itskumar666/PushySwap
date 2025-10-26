'use client';

import { useState, useEffect } from 'react';
import { Wallet, ExternalLink, Copy, Check } from 'lucide-react';

interface WalletInfo {
  address: string;
  balance: string;
  chainId: number;
  chainName: string;
}

export default function WalletConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Check if wallet is already connected on mount
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        await connectWallet();
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      alert('Please install MetaMask or another Web3 wallet');
      return;
    }

    setIsConnecting(true);
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        // Get chain ID
        const chainId = await window.ethereum.request({
          method: 'eth_chainId',
        });

        // Get balance
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest'],
        });

        // Convert balance from wei to ETH
        const balanceInETH = parseInt(balance, 16) / Math.pow(10, 18);

        // Get chain name
        const chainName = getChainName(parseInt(chainId, 16));

        setWalletInfo({
          address: accounts[0],
          balance: balanceInETH.toFixed(4),
          chainId: parseInt(chainId, 16),
          chainName,
        });

        setIsConnected(true);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const switchToPushChain = async () => {
    if (!window.ethereum) return;

    try {
      // Switch to Push Chain testnet (network already added)
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xa455' }], // 42069 in hex
      });
    } catch (switchError) {
      console.error('Failed to switch to Push Chain network:', switchError);
    }
  };

  const getChainName = (chainId: number): string => {
    const chainNames: { [key: number]: string } = {
      1: 'Ethereum Mainnet',
      5: 'Goerli Testnet',
      56: 'BNB Smart Chain',
      137: 'Polygon',
      42069: 'Push Chain Donut',
    };
    return chainNames[chainId] || `Chain ${chainId}`;
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletInfo(null);
  };

  const copyAddress = async () => {
    if (walletInfo?.address) {
      await navigator.clipboard.writeText(walletInfo.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected && walletInfo) {
    return (
      <div className="bg-gray-800 border border-gray-600 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-medium text-white">Wallet Connected</div>
              <div className="text-sm text-gray-400">{walletInfo.chainName}</div>
            </div>
          </div>
          <button
            onClick={disconnectWallet}
            className="text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            Disconnect
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Address:</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-white">
                {formatAddress(walletInfo.address)}
              </span>
              <button
                onClick={copyAddress}
                className="p-1 hover:bg-gray-700 rounded transition-colors"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-green-400" />
                ) : (
                  <Copy className="w-3 h-3 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Balance:</span>
            <span className="text-sm font-medium text-white">
              {walletInfo.balance} {walletInfo.chainId === 42069 ? 'PC' : 'ETH'}
            </span>
          </div>
        </div>

        {walletInfo.chainId !== 42069 && (
          <div className="mt-3 p-2 bg-yellow-900/20 border border-yellow-500/20 rounded">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-yellow-300 text-xs">
                  Switch to Push Chain Donut for optimal experience
                </span>
              </div>
              <button
                onClick={switchToPushChain}
                className="text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded transition-colors"
              >
                Switch
              </button>
            </div>
          </div>
        )}

        <a
          href={`https://donut.push.network/address/${walletInfo.address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center space-x-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          <span>View on Explorer</span>
        </a>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-xl p-6 text-center">
      <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
        <Wallet className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-white mb-2">Connect Your Wallet</h3>
      <p className="text-sm text-gray-400 mb-6">
        Connect your wallet to start swapping tokens across chains
      </p>
      <button
        onClick={connectWallet}
        disabled={isConnecting}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-all duration-200"
      >
        {isConnecting ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Connecting...</span>
          </div>
        ) : (
          'Connect Wallet'
        )}
      </button>
    </div>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}