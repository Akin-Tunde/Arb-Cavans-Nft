// contracts/CanvasFactory.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./FarcasterCanvas.sol";
import "./Marketplace.sol";

contract CanvasFactory {
    
    // Using a struct is essential to solve the stack depth issue.
    struct CanvasParams {
        uint256 width;
        uint256 height;
        uint256 initialMintPrice;
        uint256 marketplaceFeeBps;
        string name;
        string symbol;
        string description;
    }

    event CanvasCreated(
        address indexed creator,
        address canvasContract,
        address nftContract,
        address marketplaceContract,
        uint256 width,
        uint256 height,
        string name,
        string symbol,
        string description
    );

    // This function is simplified to reduce local variables.
    function createCanvas(CanvasParams calldata params) public {
        address creator = msg.sender;

        FarcasterCanvas newCanvas = new FarcasterCanvas(
            params.width,
            params.height,
            creator,
            params.initialMintPrice,
            params.name,
            params.symbol
        );

        // We get the PixelNFT address directly from the newCanvas object.
        address pixelNFTAddress = address(newCanvas.pixelNFT());

        Marketplace newMarketplace = new Marketplace(
            pixelNFTAddress,
            creator,
            params.marketplaceFeeBps
        );

        emit CanvasCreated(
            creator,
            address(newCanvas),
            pixelNFTAddress,
            address(newMarketplace),
            params.width,
            params.height,
            params.name,
            params.symbol,
            params.description
        );
    }
}
