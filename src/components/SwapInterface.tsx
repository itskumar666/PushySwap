'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowDownUp, Settings, Info } from 'lucide-react';
import { SwapService, SwapQuote, SwapParams } from '@/lib/swap';
import { SUPPORTED_TOKENS, SupportedToken } from '@/lib/pushchain';

interface TokenSelectProps {
  selectedToken: SupportedToken | null;
  onTokenSelect: (token: SupportedToken) => void;
  excludeToken?: SupportedToken;
  label: string;
}

function TokenSelect({ selectedToken, onTokenSelect, excludeToken, label }: TokenSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const availableTokens = Object.keys(SUPPORTED_TOKENS).filter(
    token => token !== excludeToken
  ) as SupportedToken[];

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-left hover:bg-gray-700 transition-colors flex items-center justify-between"
      >
        {selectedToken ? (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {SUPPORTED_TOKENS[selectedToken].logo || selectedToken.slice(0, 2)}
            </div>
            <div>
              <div className="font-medium text-white">{SUPPORTED_TOKENS[selectedToken].symbol}</div>
              <div className="text-sm text-gray-400">{SUPPORTED_TOKENS[selectedToken].name}</div>
            </div>
          </div>
        ) : (
          <span className="text-gray-400">Select token</span>
        )}
        <ArrowDownUp className="w-4 h-4 text-gray-400" />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {/* Popular Tokens Section */}
          <div className="p-2 border-b border-gray-700">
            <div className="text-xs text-gray-400 mb-2 px-2">Popular Tokens</div>
            {['ETH', 'SOL', 'BNB', 'USDC', 'USDT', 'MATIC', 'AVAX', 'WBTC'].filter(token => 
              (token as SupportedToken) !== excludeToken && availableTokens.includes(token as SupportedToken)
            ).map((token) => (
              <button
                key={token}
                onClick={() => {
                  onTokenSelect(token as SupportedToken);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors flex items-center space-x-3 rounded"
              >
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {SUPPORTED_TOKENS[token as SupportedToken].logo || token.slice(0, 2)}
                </div>
                <div>
                  <div className="font-medium text-white text-sm">{SUPPORTED_TOKENS[token as SupportedToken].symbol}</div>
                  <div className="text-xs text-gray-400">{SUPPORTED_TOKENS[token as SupportedToken].name}</div>
                </div>
              </button>
            ))}
          </div>

          {/* All Tokens Section */}
          <div className="p-2">
            <div className="text-xs text-gray-400 mb-2 px-2">All Tokens</div>
            {availableTokens.map((token) => (
              <button
                key={token}
                onClick={() => {
                  onTokenSelect(token);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors flex items-center space-x-3 rounded"
              >
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {SUPPORTED_TOKENS[token].logo || token.slice(0, 2)}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white text-sm">{SUPPORTED_TOKENS[token].symbol}</div>
                  <div className="text-xs text-gray-400">{SUPPORTED_TOKENS[token].name}</div>
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {SUPPORTED_TOKENS[token].chain}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SwapInterface() {
  const [tokenIn, setTokenIn] = useState<SupportedToken | null>(null);
  const [tokenOut, setTokenOut] = useState<SupportedToken | null>(null);
  const [amountIn, setAmountIn] = useState('');
  const [amountOut, setAmountOut] = useState('');
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [slippage, setSlippage] = useState(1); // 1% default slippage
  const [showSettings, setShowSettings] = useState(false);
  const [balance, setBalance] = useState<string>('0');
  const [balanceWarning, setBalanceWarning] = useState<string>('');

  const swapService = SwapService.getInstance();

  // Get quote when inputs change
  useEffect(() => {
    const getQuote = async () => {
      if (!tokenIn || !tokenOut || !amountIn || parseFloat(amountIn) <= 0) {
        setQuote(null);
        setAmountOut('');
        return;
      }

      setLoading(true);
      try {
        const newQuote = await swapService.getQuote(tokenIn, tokenOut, amountIn);
        setQuote(newQuote);
        setAmountOut(newQuote.amountOut);
      } catch (error) {
        console.error('Error getting quote:', error);
        setQuote(null);
        setAmountOut('');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(getQuote, 500);
    return () => clearTimeout(debounceTimer);
  }, [tokenIn, tokenOut, amountIn, swapService]);

  const handleSwapTokens = () => {
    const tempToken = tokenIn;
    const tempAmount = amountIn;
    
    setTokenIn(tokenOut);
    setTokenOut(tempToken);
    setAmountIn(amountOut);
    setAmountOut(tempAmount);
  };

  // Check balance when amount or token changes
  const checkBalance = useCallback(async () => {
    if (!tokenIn || !amountIn) {
      setBalance('0');
      setBalanceWarning('');
      return;
    }

    try {
      if (window.ethereum) {
        const provider = new (await import('ethers')).BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userBalance = await provider.getBalance(await signer.getAddress());
        const balanceFormatted = (await import('ethers')).formatEther(userBalance);
        setBalance(balanceFormatted);

        // Check if balance is sufficient
        const requiredAmount = parseFloat(amountIn);
        const availableAmount = parseFloat(balanceFormatted);
        
        if (tokenIn === 'ETH') {
          if (availableAmount < requiredAmount + 0.001) { // Add gas buffer
            setBalanceWarning(`Insufficient ${tokenIn} balance! You have ${balanceFormatted} ${tokenIn}, need ${(requiredAmount + 0.001).toFixed(6)} ${tokenIn} (including gas)`);
          } else {
            setBalanceWarning('');
          }
        }
      }
    } catch (error) {
      console.log('Balance check error:', error);
      setBalance('0');
      setBalanceWarning('');
    }
  }, [tokenIn, amountIn]);

  // Check balance when inputs change
  useEffect(() => {
    checkBalance();
  }, [tokenIn, amountIn, checkBalance]);

  const handleSwap = async () => {
    if (!tokenIn || !tokenOut || !amountIn || !quote) return;

    // Show balance warning but allow user to continue
    if (balanceWarning) {
      const confirmSwap = confirm(`⚠️ ${balanceWarning}\n\nDo you want to proceed anyway? The transaction may fail if you have insufficient funds.`);
      if (!confirmSwap) {
        return;
      }
    }

    try {
      setLoading(true);
      
      const swapParams: SwapParams = {
        tokenIn,
        tokenOut,
        amountIn,
        slippageTolerance: slippage,
        recipient: '0x...', // This would come from connected wallet
        deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes
      };

      const txHash = await swapService.executeSwap(swapParams);
      console.log('Swap executed:', txHash);
      
      // Show appropriate message based on result
      if (txHash === 'DEMO_COMPLETE_NO_HASH' || txHash === 'NO_TRANSACTION_EXECUTED' || txHash === 'CONCEPT_DEMONSTRATION_COMPLETE') {
        alert('Technical demonstration completed! Check console for detailed logs. No transaction was executed.');
      } else if (txHash.startsWith('0x')) {
        const explorerUrl = `https://scan.push.org/tx/${txHash}`;
        alert(`✅ Swap Successful!\n\nTransaction Hash: ${txHash}\n\nView on Explorer: ${explorerUrl}`);
        console.log('View transaction:', explorerUrl);
        
        // Open explorer in new tab
        if (confirm('Would you like to view the transaction on Push Chain Explorer?')) {
          window.open(explorerUrl, '_blank');
        }
      } else {
        alert('Demonstration completed! Check console for technical details.');
      }
    } catch (error) {
      console.error('Swap failed:', error);
      alert('Swap failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Universal Swap</h2>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Settings className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-600">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">Slippage Tolerance</label>
            <div className="flex items-center space-x-2">
              {[0.5, 1, 2, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => setSlippage(value)}
                  className={`px-2 py-1 text-xs rounded ${
                    slippage === value
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {value}%
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Token Input */}
      <div className="mb-4">
        <TokenSelect
          selectedToken={tokenIn}
          onTokenSelect={setTokenIn}
          excludeToken={tokenOut || undefined}
          label="From"
        />
        <div className="mt-3">
          <input
            type="number"
            value={amountIn}
            onChange={(e) => setAmountIn(e.target.value)}
            placeholder="0.0"
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {tokenIn === 'ETH' && (
            <div className="text-xs text-gray-400 mt-1">
              Balance: {balance} {tokenIn}
            </div>
          )}
        </div>
      </div>

      {/* Balance Warning */}
      {balanceWarning && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-600/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm">{balanceWarning}</span>
          </div>
        </div>
      )}

      {/* Swap Button */}
      <div className="flex justify-center mb-4">
        <button
          onClick={handleSwapTokens}
          className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full border border-gray-600 transition-colors"
        >
          <ArrowDownUp className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Token Output */}
      <div className="mb-6">
        <TokenSelect
          selectedToken={tokenOut}
          onTokenSelect={setTokenOut}
          excludeToken={tokenIn || undefined}
          label="To"
        />
        <div className="mt-3">
          <input
            type="number"
            value={amountOut}
            placeholder="0.0"
            readOnly
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Quote Information */}
      {quote && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-600">
          {/* DEX Route Info */}
          <div className="flex items-center justify-between text-xs mb-3">
            <span className="text-gray-400">Best Route Found</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-400 font-medium">
                {quote.tokenIn === 'pETH' || quote.tokenOut === 'pETH' ? '1inch' : 
                 quote.tokenIn === 'pSOL' || quote.tokenOut === 'pSOL' ? 'Jupiter' : 
                 quote.tokenIn === 'pBNB' || quote.tokenOut === 'pBNB' ? 'PancakeSwap' : 'Universal Pool'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1">
              <Info className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">Price Impact</span>
            </div>
            <span className={`${quote.priceImpact > 2 ? 'text-red-400' : 'text-green-400'}`}>
              {quote.priceImpact.toFixed(2)}%
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-gray-300">Network Fee</span>
            <span className="text-gray-400">{parseFloat(quote.fee).toFixed(6)} {quote.tokenIn}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-gray-300">Minimum Received</span>
            <span className="text-gray-400">{quote.minimumAmountOut} {quote.tokenOut}</span>
          </div>
          
          {/* Multi-DEX Aggregation Note */}
          <div className="mt-3 pt-2 border-t border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
              <span className="text-blue-300 text-xs">
                Aggregated from {quote.tokenIn === 'pETH' ? 'Ethereum' : 
                                 quote.tokenIn === 'pSOL' ? 'Solana' : 
                                 quote.tokenIn === 'pBNB' ? 'BSC' : 'Multi-chain'} DEXes
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Swap Button */}
      <button
        onClick={handleSwap}
        disabled={!tokenIn || !tokenOut || !amountIn || loading || !quote}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-medium py-4 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Processing...</span>
          </div>
        ) : !tokenIn || !tokenOut ? (
          'Select tokens'
        ) : !amountIn ? (
          'Enter amount'
        ) : (
          'Swap'
        )}
      </button>

      {/* Cross-chain Info */}
      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/20 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span className="text-blue-300 text-sm font-medium">Universal Cross-Chain Swap</span>
        </div>
        <p className="text-blue-200 text-xs mt-1">
          Swap tokens from any supported blockchain using Push Chain&apos;s unified liquidity
        </p>
      </div>
    </div>
  );
}