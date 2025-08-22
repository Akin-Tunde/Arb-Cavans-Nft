// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./PixelNFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract FarcasterCanvas is Ownable, Pausable, ReentrancyGuard {
    uint256 public immutable canvasWidth;
    uint256 public immutable canvasHeight;
    PixelNFT public immutable pixelNFT;
    mapping(uint256 => bool) public isMinted;
    uint256 public mintPrice;
    uint256 public constant PRICE_CHANGE_TIMELOCK = 1 days;
    uint256 public pendingMintPrice;
    uint256 public priceChangeAvailableTimestamp;

    event PixelMinted(uint256 indexed tokenId, address indexed owner, uint8 colorIndex);
    event PriceChangeProposed(uint256 newPrice, uint256 activationTimestamp);
    event PriceChangeActivated(uint256 newPrice);

    constructor(
        uint256 _width,
        uint256 _height,
        address initialOwner,
        uint256 _initialMintPrice,
        string memory _name,
        string memory _symbol
    ) Ownable(initialOwner) {
        canvasWidth = _width;
        canvasHeight = _height;
        mintPrice = _initialMintPrice;
        pixelNFT = new PixelNFT(_name, _symbol, _width, address(this));
    }

    function mintPixel(uint16 x, uint16 y, uint8 colorIndex) public payable whenNotPaused nonReentrant {
        require(msg.value >= mintPrice, "FarcasterCanvas: Insufficient funds");
        require(x < canvasWidth && y < canvasHeight, "FarcasterCanvas: Coords out of bounds");
        uint256 tokenId = (uint256(y) * canvasWidth) + x;
        require(!isMinted[tokenId], "FarcasterCanvas: Pixel already minted");

        isMinted[tokenId] = true;
        pixelNFT.mint(msg.sender, tokenId, colorIndex);
        emit PixelMinted(tokenId, msg.sender, colorIndex);

        (bool success, ) = owner().call{value: msg.value}("");
        require(success, "FarcasterCanvas: Failed to send funds to owner");
    }

    function proposeNewMintPrice(uint256 _newPrice) public onlyOwner {
        pendingMintPrice = _newPrice;
        priceChangeAvailableTimestamp = block.timestamp + PRICE_CHANGE_TIMELOCK;
        emit PriceChangeProposed(_newPrice, priceChangeAvailableTimestamp);
    }

    function activateNewMintPrice() public onlyOwner {
        require(block.timestamp >= priceChangeAvailableTimestamp, "FarcasterCanvas: Timelock has not expired");
        require(pendingMintPrice > 0, "FarcasterCanvas: No new price proposed");
        mintPrice = pendingMintPrice;
        pendingMintPrice = 0;
        emit PriceChangeActivated(mintPrice);
    }

    function pause() public onlyOwner { _pause(); }
    function unpause() public onlyOwner { _unpause(); }
}
