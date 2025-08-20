// src/components/ConnectButton.tsx (Corrected Version)
import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function ConnectButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect() // The useConnect hook gives us the available connectors
  const { disconnect } = useDisconnect()

  // The first connector in our array is the injected (MetaMask) one
  const injectedConnector = connectors[0]

  if (isConnected) {
    return (
      <div className="flex items-center gap-4">
        <div className="px-4 py-2 bg-gray-200 rounded-lg font-mono text-sm">
          {`${address?.substring(0, 6)}...${address?.substring(address.length - 4)}`}
        </div>
        <button 
          onClick={() => disconnect()} 
          className="px-4 py-2 font-semibold text-white bg-red-500 rounded-lg transition-colors hover:bg-red-600"
        >
          Disconnect
        </button>
      </div>
    )
  }
  return (
    <button 
      onClick={() => connect({ connector: injectedConnector })} 
      className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg transition-colors hover:bg-blue-600"
    >
      Connect Wallet
    </button>
  )
}