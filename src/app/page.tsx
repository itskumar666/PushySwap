import SwapInterface from '@/components/SwapInterface';
import WalletConnection from '@/components/WalletConnection';
import { Github, ExternalLink } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PS</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">PushySwap</h1>
                <p className="text-xs text-gray-400">Universal DEX on Push Chain</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <a
                href="https://push.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Swap Across All Chains
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Trade tokens from Ethereum, Solana, BSC, and more - all in one place. 
            No bridges, no multiple wallets, just seamless cross-chain swapping.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Wallet Connection */}
          <div>
            <WalletConnection />
          </div>

          {/* Swap Interface */}
          <div>
            <SwapInterface />
          </div>
        </div>

        {/* DEX Integration Showcase */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-white text-center mb-4">
            Powered by Leading DEX Aggregators
          </h3>
          <p className="text-gray-300 text-center mb-8 max-w-2xl mx-auto">
            PushySwap integrates with the best DEXes across all chains to find you the optimal rates
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xs">1INCH</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Ethereum DEXes</h4>
              <p className="text-gray-400 text-sm">
                Access Uniswap, SushiSwap, and 100+ Ethereum DEXes through 1inch aggregation
              </p>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xs">JUP</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Solana DEXes</h4>
              <p className="text-gray-400 text-sm">
                Tap into Raydium, Orca, and Solana&apos;s entire DeFi ecosystem via Jupiter
              </p>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xs">CAKE</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">BSC DEXes</h4>
              <p className="text-gray-400 text-sm">
                Connect to PancakeSwap, BiSwap, and all major BSC liquidity sources
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            Why PushySwap?
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">⚡</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Best Rates</h4>
              <p className="text-gray-400 text-sm">
                Automatically finds the best rates across all major DEXes and chains
              </p>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">∞</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Universal Access</h4>
              <p className="text-gray-400 text-sm">
                One interface to access liquidity from Ethereum, Solana, BSC, and more
              </p>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">🔒</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Push Chain Powered</h4>
              <p className="text-gray-400 text-sm">
                Built on Push Chain&apos;s universal infrastructure for seamless cross-chain operations
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-700 bg-gray-900/50 backdrop-blur-sm mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Built for Project G.U.D Hackathon • Powered by Push Chain Donut Testnet
            </p>
            <div className="flex items-center justify-center space-x-6 mt-4">
              <a
                href="https://faucet.push.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Get Testnet Tokens
              </a>
              <a
                href="https://donut.push.network/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Block Explorer
              </a>
              <a
                href="https://pushchain.github.io/push-chain-website/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Documentation
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
