// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title UniversalSwap
 * @dev Demonstrates Push Chain's Universal State capabilities for cross-chain DeFi
 * @notice This contract showcases how Push Chain enables true cross-chain swaps
 */
contract UniversalSwap {
    // Events
    event UniversalSwapExecuted(
        address indexed user,
        string tokenIn,
        string tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        uint256 timestamp
    );
    
    event LiquidityUpdated(
        string indexed token,
        uint256 newLiquidity,
        uint256 timestamp
    );

    // State variables
    mapping(string => uint256) public tokenLiquidity;
    mapping(address => mapping(string => uint256)) public userBalances;
    mapping(string => uint256) public tokenPrices; // Price in wei (1 ETH = 1e18)
    
    uint256 public totalSwaps;
    uint256 public totalVolume;
    
    // Supported tokens
    string[] public supportedTokens;
    mapping(string => bool) public isTokenSupported;
    
    // Fees
    uint256 public constant FEE_BASIS_POINTS = 30; // 0.3%
    uint256 public constant BASIS_POINTS_DIVISOR = 10000;
    
    modifier validToken(string memory token) {
        require(isTokenSupported[token], "Token not supported");
        _;
    }

    constructor() {
        // Initialize supported tokens with liquidity
        _initializeTokens();
    }
    
    function _initializeTokens() private {
        // Popular tokens with initial liquidity
        string[10] memory tokens = [
            "PUSH", "ETH", "USDC", "USDT", "BTC",
            "SOL", "BNB", "MATIC", "AVAX", "LINK"
        ];
        
        // Initial liquidity (for demonstration)
        uint256[10] memory liquidity;
        liquidity[0] = 1000000 ether;  // PUSH
        liquidity[1] = 500 ether;      // ETH
        liquidity[2] = 2000000 ether;  // USDC
        liquidity[3] = 2000000 ether;  // USDT
        liquidity[4] = 25 ether;       // BTC
        liquidity[5] = 10000 ether;    // SOL
        liquidity[6] = 1000 ether;     // BNB
        liquidity[7] = 500000 ether;   // MATIC
        liquidity[8] = 5000 ether;     // AVAX
        liquidity[9] = 50000 ether;    // LINK
        
        // Initial prices (in wei, relative to ETH)
        uint256[10] memory prices;
        prices[0] = 0.1 ether;      // PUSH = 0.1 ETH
        prices[1] = 1 ether;        // ETH = 1 ETH
        prices[2] = 0.0003 ether;   // USDC = $1 (assuming ETH = $3333)
        prices[3] = 0.0003 ether;   // USDT = $1
        prices[4] = 20 ether;       // BTC = 20 ETH
        prices[5] = 0.05 ether;     // SOL = 0.05 ETH
        prices[6] = 0.18 ether;     // BNB = 0.18 ETH
        prices[7] = 0.0003 ether;   // MATIC = $1
        prices[8] = 0.01 ether;     // AVAX = 0.01 ETH
        prices[9] = 0.004 ether;    // LINK = 0.004 ETH
        
        for (uint i = 0; i < tokens.length; i++) {
            supportedTokens.push(tokens[i]);
            isTokenSupported[tokens[i]] = true;
            tokenLiquidity[tokens[i]] = liquidity[i];
            tokenPrices[tokens[i]] = prices[i];
        }
    }
    
    /**
     * @dev Execute a universal swap demonstrating Push Chain's cross-chain capabilities
     * @param tokenIn Token to swap from
     * @param tokenOut Token to swap to
     * @param amountIn Amount of input tokens
     * @param minAmountOut Minimum acceptable output amount
     */
    function executeUniversalSwap(
        string memory tokenIn,
        string memory tokenOut,
        uint256 amountIn,
        uint256 minAmountOut
    ) external payable validToken(tokenIn) validToken(tokenOut) returns (uint256 amountOut) {
        require(amountIn > 0, "Amount must be greater than 0");
        require(keccak256(bytes(tokenIn)) != keccak256(bytes(tokenOut)), "Cannot swap same token");
        
        // Calculate output amount using constant product formula (simplified)
        amountOut = calculateSwapOutput(tokenIn, tokenOut, amountIn);
        require(amountOut >= minAmountOut, "Insufficient output amount");
        require(amountOut <= tokenLiquidity[tokenOut], "Insufficient liquidity");
        
        // Handle payment
        if (keccak256(bytes(tokenIn)) == keccak256(bytes("PUSH")) || 
            keccak256(bytes(tokenIn)) == keccak256(bytes("ETH"))) {
            require(msg.value >= amountIn, "Insufficient ETH/PUSH sent");
            
            // Refund excess
            if (msg.value > amountIn) {
                payable(msg.sender).transfer(msg.value - amountIn);
            }
        }
        
        // Update liquidity pools
        tokenLiquidity[tokenIn] += amountIn;
        tokenLiquidity[tokenOut] -= amountOut;
        
        // Update user balances
        userBalances[msg.sender][tokenOut] += amountOut;
        
        // Update statistics
        totalSwaps++;
        totalVolume += amountIn;
        
        // Emit event
        emit UniversalSwapExecuted(
            msg.sender,
            tokenIn,
            tokenOut,
            amountIn,
            amountOut,
            block.timestamp
        );
        
        return amountOut;
    }
    
    /**
     * @dev Calculate swap output using simplified AMM formula
     */
    function calculateSwapOutput(
        string memory tokenIn,
        string memory tokenOut,
        uint256 amountIn
    ) public view returns (uint256) {
        uint256 priceIn = tokenPrices[tokenIn];
        uint256 priceOut = tokenPrices[tokenOut];
        
        // Convert input amount to base currency (ETH equivalent)
        uint256 valueIn = (amountIn * priceIn) / 1 ether;
        
        // Apply 0.3% fee
        uint256 valueAfterFee = valueIn - (valueIn * FEE_BASIS_POINTS / BASIS_POINTS_DIVISOR);
        
        // Convert to output token
        uint256 amountOut = (valueAfterFee * 1 ether) / priceOut;
        
        return amountOut;
    }
    
    /**
     * @dev Get quote for a potential swap
     */
    function getQuote(
        string memory tokenIn,
        string memory tokenOut,
        uint256 amountIn
    ) external view validToken(tokenIn) validToken(tokenOut) returns (uint256 amountOut, uint256 priceImpact) {
        amountOut = calculateSwapOutput(tokenIn, tokenOut, amountIn);
        
        // Calculate price impact (simplified)
        uint256 liquidityImpact = (amountIn * 10000) / tokenLiquidity[tokenIn];
        priceImpact = liquidityImpact > 100 ? liquidityImpact : 0;
        
        return (amountOut, priceImpact);
    }
    
    /**
     * @dev Withdraw tokens (for testnet demonstration)
     */
    function withdrawToken(string memory token, uint256 amount) external {
        require(userBalances[msg.sender][token] >= amount, "Insufficient balance");
        
        userBalances[msg.sender][token] -= amount;
        
        // For testnet demo, we'll just emit an event
        // In production, this would transfer actual tokens
        emit LiquidityUpdated(token, tokenLiquidity[token], block.timestamp);
    }
    
    /**
     * @dev Get supported tokens
     */
    function getSupportedTokens() external view returns (string[] memory) {
        return supportedTokens;
    }
    
    /**
     * @dev Get token info
     */
    function getTokenInfo(string memory token) external view returns (
        uint256 liquidity,
        uint256 price,
        bool supported
    ) {
        return (
            tokenLiquidity[token],
            tokenPrices[token],
            isTokenSupported[token]
        );
    }
    
    /**
     * @dev Update token price (public function for decentralized price updates)
     */
    function updateTokenPrice(string memory token, uint256 newPrice) external validToken(token) {
        require(newPrice > 0, "Price must be greater than 0");
        tokenPrices[token] = newPrice;
    }
    
    /**
     * @dev Add liquidity (public function - anyone can add liquidity)
     */
    function addLiquidity(string memory token) external payable validToken(token) {
        require(msg.value > 0, "Must send ETH/PUSH to add liquidity");
        tokenLiquidity[token] += msg.value;
        emit LiquidityUpdated(token, tokenLiquidity[token], block.timestamp);
    }
    
    /**
     * @dev Get contract stats
     */
    function getStats() external view returns (
        uint256 _totalSwaps,
        uint256 _totalVolume,
        uint256 _contractBalance,
        uint256 _supportedTokenCount
    ) {
        return (
            totalSwaps,
            totalVolume,
            address(this).balance,
            supportedTokens.length
        );
    }
    
    // Fallback function to receive ETH
    receive() external payable {}
    fallback() external payable {}
}