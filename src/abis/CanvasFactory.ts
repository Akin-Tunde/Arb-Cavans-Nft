export const canvasFactoryAbi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "canvasContract",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "nftContract",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "marketplaceContract",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "width",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "height",
				"type": "uint256"
			}
		],
		"name": "CanvasCreated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_width",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_height",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_initialMintPrice",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_marketplaceFeeBps",
				"type": "uint256"
			}
		],
		"name": "createCanvas",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
] as const;