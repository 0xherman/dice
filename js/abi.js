const contractAddress = "0x7149Feb937b73F50F53BA2B6Dd9381eCb604A10a";

const contractABI = [
  {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "bytes32",
        "name": "requestId",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "result",
        "type": "uint256"
      }
    ],
    "name": "DiceLanded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "bytes32",
        "name": "requestId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "bid",
        "type": "uint256"
      }
    ],
    "name": "DiceRolled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "requestId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "WinnerPaid",
    "type": "event"
  },
  {
    "inputs": [{
      "internalType": "bytes32",
      "name": "requestId",
      "type": "bytes32"
    }],
    "name": "claim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{
      "internalType": "bytes32",
      "name": "",
      "type": "bytes32"
    }],
    "name": "games",
    "outputs": [{
        "internalType": "bytes32",
        "name": "id",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "seed",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "guess",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "result",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "bid",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "multiplier",
        "type": "uint256"
      },
      {
        "internalType": "address payable",
        "name": "player",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "paid",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "gamesByAddress",
    "outputs": [{
      "internalType": "bytes32",
      "name": "",
      "type": "bytes32"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "maxBid",
    "outputs": [{
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "minBid",
    "outputs": [{
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "multiplier",
    "outputs": [{
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paused",
    "outputs": [{
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{
        "internalType": "uint256",
        "name": "guess",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "seed",
        "type": "uint256"
      }
    ],
    "name": "rollDice",
    "outputs": [{
      "internalType": "bytes32",
      "name": "requestId",
      "type": "bytes32"
    }],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{
      "internalType": "bytes32",
      "name": "requestId",
      "type": "bytes32"
    }],
    "name": "withdrawClaim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];