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
        uint256 height,
        string name,
        string symbol
    );

    function createCanvas(
        uint256 _width,
        uint256 _height,
        uint256 _initialMintPrice,
        uint256 _marketplaceFeeBps,
        string memory _name,
        string memory _symbol
    ) public {
        address creator = msg.sender;

        FarcasterCanvas newCanvas = new FarcasterCanvas(
            _width,
            _height,
            creator,
            _initialMintPrice,
            _name,
            _symbol
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
            _height,
            _name,
            _symbol
        );
    }
}
