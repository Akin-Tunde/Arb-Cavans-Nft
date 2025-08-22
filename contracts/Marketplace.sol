// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./PixelNFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract Marketplace is Ownable, ReentrancyGuard, Pausable {
    PixelNFT public immutable pixelNFT;
    uint256 public immutable feeBps;

    struct Listing {
        address seller;
        uint256 price;
    }
    mapping(uint256 => Listing) public listings;

    event PixelListed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event PixelSold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price);
    event ListingCancelled(uint256 indexed tokenId, address indexed seller);

    constructor(address _pixelNFTAddress, address initialOwner, uint256 _feeBps) Ownable(initialOwner) {
        require(_feeBps <= 1000, "Marketplace: Fee cannot exceed 10%");
        pixelNFT = PixelNFT(_pixelNFTAddress);
        feeBps = _feeBps;
    }

    function listPixel(uint256 tokenId, uint256 price) public whenNotPaused {
        require(price > 0, "Marketplace: Price must be > 0");
        address owner = pixelNFT.ownerOf(tokenId);
        require(owner == msg.sender, "Marketplace: Not the owner");
        
        // This logic correctly handles both single-token approvals and setApprovalForAll
        require(
            pixelNFT.getApproved(tokenId) == address(this) || 
            pixelNFT.isApprovedForAll(owner, address(this)),
            "Marketplace: Contract not approved"
        );

        listings[tokenId] = Listing(msg.sender, price);
        emit PixelListed(tokenId, msg.sender, price);
    }

    function buyPixel(uint256 tokenId) public payable nonReentrant whenNotPaused {
        Listing memory listing = listings[tokenId];
        address seller = listing.seller;
        require(listing.price > 0, "Marketplace: Not listed");
        require(msg.value >= listing.price, "Marketplace: Insufficient funds");
        
        delete listings[tokenId];
        
        uint256 fee = (listing.price * feeBps) / 10000;
        uint256 sellerProceeds = listing.price - fee;

        pixelNFT.transferFrom(seller, msg.sender, tokenId);

        (bool success1, ) = seller.call{value: sellerProceeds}("");
        require(success1, "Marketplace: Seller transfer failed");
        (bool success2, ) = owner().call{value: fee}("");
        require(success2, "Marketplace: Fee transfer failed");
        
        emit PixelSold(tokenId, seller, msg.sender, listing.price);
    }
    
    function cancelListing(uint256 tokenId) public whenNotPaused {
        require(listings[tokenId].seller == msg.sender, "Marketplace: Not your listing");
        delete listings[tokenId];
        emit ListingCancelled(tokenId, msg.sender);
    }

    /**
     * @notice Pauses all marketplace activity (listing, buying, canceling).
     * @dev Can only be called by the contract owner.
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @notice Resumes marketplace activity.
     * @dev Can only be called by the contract owner.
     */
    function unpause() public onlyOwner {
        _unpause();
    }
}
