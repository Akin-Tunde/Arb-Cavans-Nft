// src/main.tsx (Final Corrected Version)
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// 1. Import Wagmi and Viem as before
import { WagmiConfig, createConfig } from 'wagmi'
import { arbitrumSepolia } from 'wagmi/chains'
import { http } from 'viem'
import { injected } from 'wagmi/connectors'

// 2. Import the necessary parts from TanStack Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// 3. Create a new QueryClient instance
const queryClient = new QueryClient()

// 4. Configure the Wagmi client as before
const config = createConfig({
  chains: [arbitrumSepolia],
  connectors: [injected()],
  transports: {
    [arbitrumSepolia.id]: http(),
  },
})

// 5. Render the app, now with BOTH providers
// The QueryClientProvider must be OUTSIDE the WagmiConfig
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiConfig>
  </React.StrictMode>,
)