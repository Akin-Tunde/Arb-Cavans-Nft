// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PixelNFT
 * @author Your Name
 * @notice This ERC-721 contract is the secure "Deed Office" for the Farcaster Canvas.
 * It manages the ownership and color of individual pixel NFTs.
 * @dev Its owner is the FarcasterCanvas contract, which has exclusive minting rights.
 * This separation of concerns is a key part of the security model.
 */
contract PixelNFT is ERC721, Ownable {
    uint256 public immutable canvasWidth;

    mapping(uint256 => uint8) public pixelColors;

    event ColorChanged(uint256 indexed tokenId, uint8 newColorIndex);

    constructor(uint256 _canvasWidth, address initialOwner) 
        ERC721("Farcaster Pixel", "PIXEL") 
        Ownable(initialOwner) 
    {
        canvasWidth = _canvasWidth;
    }

    /**
     * @notice Mints a new pixel NFT.
     * @dev This function is protected by `onlyOwner`. Only the FarcasterCanvas contract,
     * which is set as the owner during deployment, can ever call this function.
     * This prevents any unauthorized creation of pixel NFTs.
     * @param to The address to receive the new NFT.
     * @param tokenId The unique ID of the pixel to be minted.
     * @param colorIndex The initial color of the pixel.
     */
    function mint(address to, uint256 tokenId, uint8 colorIndex) public onlyOwner {
        _safeMint(to, tokenId);
        pixelColors[tokenId] = colorIndex;
    }

    /**
     * @notice Allows the owner of a pixel NFT to change its color.
     * @dev The check `ownerOf(tokenId) == msg.sender` is the modern, secure way to
     * ensure that only the rightful owner of the NFT can modify its state.
     * @param tokenId The ID of the pixel to change.
     * @param newColorIndex The new color index to set for the pixel.
     */
    function changeColor(uint256 tokenId, uint8 newColorIndex) public {
        // --- THIS IS THE CORRECTED LINE ---
        // It fetches the owner of the token and requires it to be the person calling the function.
        require(ownerOf(tokenId) == msg.sender, "PixelNFT: Caller is not the owner");
        
        pixelColors[tokenId] = newColorIndex;
        emit ColorChanged(tokenId, newColorIndex);
    }
}