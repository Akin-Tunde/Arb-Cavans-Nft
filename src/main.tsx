// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// 1. Import the necessary parts from wagmi and viem
import { WagmiConfig, createConfig } from 'wagmi'
import { arbitrumSepolia } from 'wagmi/chains'
import { http } from 'viem'
import { injected } from 'wagmi/connectors' // Import the injected connector

// 2. Configure the Wagmi client with the v2 API
const config = createConfig({
  // An array of chains your dApp supports
  chains: [arbitrumSepolia],
  
  // An array of connectors for different wallets
  connectors: [
    injected(), // For MetaMask, Rainbow, etc.
  ],
  
  // The transport layer for communicating with the blockchain
  transports: {
    [arbitrumSepolia.id]: http(), // Use a public RPC for the Arbitrum Sepolia chain
  },

  // Wagmi v2 uses a built-in storage mechanism to persist connections,
  // making the top-level 'autoConnect' flag obsolete.
})

// 3. Render the app, wrapping it with the WagmiConfig provider
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <App />
    </WagmiConfig>
  </React.StrictMode>,
)