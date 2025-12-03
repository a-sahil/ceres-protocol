import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';
import { http } from 'wagmi';

// Define the Hedera Testnet chain configuration for Viem/Wagmi
// CRITICAL: Hedera uses 18 decimals for HBAR (not 8!)
export const hederaTestnet = defineChain({
  id: 296,
  name: 'Hedera Testnet',
  nativeCurrency: {
    name: 'HBAR',
    symbol: 'ℏ', // or use 'HBAR'
    decimals: 18, // ← IMPORTANT: Hedera uses 18 decimals!
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.hashio.io/api'],
    },
  },
  blockExplorers: {
    default: { 
      name: 'HashScan', 
      url: 'https://hashscan.io/testnet' 
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 1,
    },
  },
  testnet: true,
});

// Configure RainbowKit and Wagmi
export const config = getDefaultConfig({
  appName: 'Ceres Protocol',
  projectId: '51739b9dafb35a0539a875882cafc1bf',
  chains: [hederaTestnet],
  transports: {
    [hederaTestnet.id]: http('https://testnet.hashio.io/api', {
      timeout: 15_000,
      retryCount: 3,
      retryDelay: 200,
    }),
  },
  ssr: false,
});

export default config;