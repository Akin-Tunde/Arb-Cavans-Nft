// contracts/CanvasFactory.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./FarcasterCanvas.sol";
import "./Marketplace.sol";

contract CanvasFactory {
    event CanvasCreated(
        address indexed creator,
        address canvasContract,
        address nftContract,
        address marketplaceContract,
        uint256 width,
        uint256 height
    );

    function createCanvas(
        uint256 _width,
        uint256 _height,
        uint256 _initialMintPrice,
        uint256 _marketplaceFeeBps
    ) public {
        address creator = msg.sender;

        FarcasterCanvas newCanvas = new FarcasterCanvas(
            _width,
            _height,
            creator,
            _initialMintPrice
        );

        PixelNFT newPixelNFT = newCanvas.pixelNFT();

        Marketplace newMarketplace = new Marketplace(
            address(newPixelNFT),
            creator,
            _marketplaceFeeBps
        );

        emit CanvasCreated(
            creator,
            address(newCanvas),
            address(newPixelNFT),
            address(newMarketplace),
            _width,
            _height
        );
    }
}