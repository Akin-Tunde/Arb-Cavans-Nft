// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract PixelNFT is ERC721, Ownable {
    uint256 public immutable canvasWidth;
    mapping(uint256 => uint8) public pixelColors;

    event ColorChanged(uint256 indexed tokenId, uint8 newColorIndex);

    constructor(string memory _name, string memory _symbol, uint256 _canvasWidth, address initialOwner) 
        ERC721(_name, _symbol) 
        Ownable(initialOwner) 
    {
        canvasWidth = _canvasWidth;
    }

    function mint(address to, uint256 tokenId, uint8 colorIndex) public onlyOwner {
        _safeMint(to, tokenId);
        pixelColors[tokenId] = colorIndex;
    }

    function changeColor(uint256 tokenId, uint8 newColorIndex) public {
        require(ownerOf(tokenId) == msg.sender, "PixelNFT: Caller is not the owner");
        pixelColors[tokenId] = newColorIndex;
        emit ColorChanged(tokenId, newColorIndex);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        uint8 colorIndex = pixelColors[tokenId];
        string memory colorHex = _getHexColor(colorIndex);

        string memory svgImage = string(abi.encodePacked(
            '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">',
            '<rect width="100%" height="100%" fill="#', colorHex, '" />',
            '</svg>'
        ));

        string memory json = string(abi.encodePacked(
            '{',
                '"name": "', name(), ' #', Strings.toString(tokenId), '",',
                '"description": "A single pixel on a collaborative, on-chain canvas.",',
                '"image": "data:image/svg+xml;base64,', Base64.encode(bytes(svgImage)), '",',
                '"attributes": [',
                    '{',
                        '"trait_type": "Color Index",',
                        '"value": ', Strings.toString(colorIndex),
                    '}',
                ']',
            '}'
        ));
        
        return string(abi.encodePacked(
            "data:application/json;base64,",
            Base64.encode(bytes(json))
        ));
    }

    function _getHexColor(uint8 colorIndex) internal pure returns (string memory) {
        if (colorIndex == 1) return "FF0000"; if (colorIndex == 2) return "FFFF00"; if (colorIndex == 3) return "0000FF";
        if (colorIndex == 4) return "FFA500"; if (colorIndex == 5) return "008000"; if (colorIndex == 6) return "8A2BE2";
        if (colorIndex == 7) return "FFC0CB"; if (colorIndex == 8) return "A52A2A"; if (colorIndex == 9) return "FFD700";
        if (colorIndex == 10) return "800080"; if (colorIndex == 11) return "00FFFF"; if (colorIndex == 12) return "FF00FF";
        if (colorIndex == 13) return "FFFFFF"; if (colorIndex == 14) return "D3D3D3"; if (colorIndex == 15) return "808080";
        if (colorIndex == 16) return "363636"; if (colorIndex == 17) return "C0C0C0"; if (colorIndex == 18) return "000000";
        return "CCCCCC";
    }
}
