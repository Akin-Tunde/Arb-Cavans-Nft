// src/main.tsx (Base Sepolia Version)
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { WagmiConfig, createConfig } from 'wagmi'
// 1. Import 'baseSepolia' instead of 'arbitrumSepolia'
import { baseSepolia } from 'wagmi/chains'
import { http } from 'viem'
import { injected } from 'wagmi/connectors'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

// 2. Update the config to use the new chain
const config = createConfig({
  chains: [baseSepolia], // Use baseSepolia here
  connectors: [injected()],
  transports: {
    [baseSepolia.id]: http(import.meta.env.VITE_ARBITRUM_RPC_URL), // Use baseSepolia here
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiConfig>
  </React.StrictMode>,
)