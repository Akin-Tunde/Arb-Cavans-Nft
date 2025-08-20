

# Farcaster Canvas: The On-Chain Collaborative Artboard

Farcaster Canvas is a fully on-chain, collaborative art project and a dynamic economic game embedded directly within the Farcaster social feed. It transforms a simple pixel grid into a world of tradable digital real estate, where every pixel is an NFT owned and controlled by a user.

This project is not just a single application but a **decentralized platform**. Any user can deploy their own unique canvas with custom rules and economic parameters directly from the Mini-App, creating a multiverse of independent, community-owned artboards.

**Live Demo:** `[Link to your deployed Mini-App on Vercel/Netlify]`  
**Factory Contract on Arbiscan:** `[Link to your deployed CanvasFactory contract on Arbiscan]`

 
<!-- It's highly recommended to replace this with a real screenshot of your app -->

## Core Features

### For Players & Traders
*   **Visual Marketplace:** The canvas is the interface. Browse, mint, and trade pixels directly on the grid.
*   **True Ownership:** Each pixel is an ERC-721 NFT. If you own it, you have exclusive control to change its color.
*   **Primary Sales (Minting):** Be the first to claim an unowned pixel by paying the creator's set mint price.
*   **Secondary Sales (P2P Trading):** Buy and sell pixels from other users in a trustless, peer-to-peer marketplace.
*   **Real-time & On-Chain:** Every action is a transaction on the Arbitrum network, and the canvas updates for all users in near real-time.

### For Canvas Creators
*   **Permissionless Creation:** Any user can launch their own canvas world without asking for permission.
*   **Custom Configuration:** Creators define the rules for their world:
    *   **Dimensions:** Set any `width` and `height`.
    *   **Economy:** Set the initial `mintPrice` and a permanent `marketplaceFee` on all secondary sales.
*   **Direct Revenue:** All minting fees and marketplace fees are sent directly to the creator's wallet.
*   **Administrative Controls:** Creators can manage their canvas with features like dynamic pricing (with a timelock) and an emergency pause button.

## Smart Contract Architecture

The entire system is powered by a suite of four smart contracts designed for security and separation of concerns.

1.  **`CanvasFactory.sol` (The Vending Machine):** The single, public-facing contract that allows any user to deploy their own complete canvas ecosystem with one transaction.
2.  **`FarcasterCanvas.sol` (The Storefront):** Manages the primary sale (minting) of pixels for a *specific* canvas. It is the owner of the `PixelNFT` contract.
3.  **`PixelNFT.sol` (The Deed Office):** A standard ERC-721 contract that manages the ownership and color data for a *specific* canvas's pixels.
4.  **`Marketplace.sol` (The Real Estate Agency):** Manages the secondary, peer-to-peer sales for a *specific* canvas.

This factory-based architecture ensures the platform can scale infinitely without any central point of failure.

## Getting Started: Running the Frontend Locally

This project uses **Vite** for the frontend build tool and **Vue.js** with TypeScript.

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18.x or higher)
*   [pnpm](https://pnpm.io/) (or npm/yarn)
*   A browser with a web3 wallet installed (e.g., [MetaMask](https://metamask.io/))

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/farcaster-canvas-app.git
    cd farcaster-canvas-app
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Configure environment variables:**
    Create a new file named `.env` in the root of the project by copying the example file:
    ```bash
    cp .env.example .env
    ```
    Now, open the `.env` file and fill in the required values:
    *   `VITE_FACTORY_CONTRACT_ADDRESS`: The address of the deployed `CanvasFactory.sol` contract on the Arbitrum network.
    *   `VITE_ARBITRUM_RPC_URL`: An RPC URL from a provider like [Alchemy](https://www.alchemy.com/) or [Infura](https://www.infura.io/).

4.  **Run the development server:**
    ```bash
    pnpm run dev
    ```

5.  **Open the app:**
    Navigate to `http://localhost:5173` (or the URL provided) in your browser.

## Tech Stack

### Smart Contracts (Backend)
*   **Solidity:** Language for smart contracts.
*   **Remix IDE / Hardhat:** Development environment for compiling, testing, and deploying.
*   **OpenZeppelin Contracts:** For secure, standard implementations (ERC-721, Ownable, etc.).
*   **Arbitrum:** The Layer 2 network for fast, low-cost transactions.

### Mini-App (Frontend)
*   **Vite:** High-performance build tool and development server.
*   **Vue.js 3:** The core JavaScript framework (using Composition API).
*   **TypeScript:** For robust type safety.
*   **Pinia:** For centralized state management.
*   **Ethers.js:** For interacting with the Ethereum blockchain.

## License


This project is licensed under the MIT License. See the `LICENSE` file for details.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
