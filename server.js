const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');
const app = express();
app.use(bodyParser.json());
app.use(cors());

const hre = require('hardhat');
const { ethers } = require('ethers');

const YOUR_PRIVATE_KEY = process.env.PRIVATE_KEY;
const contractAddress = process.env.CONTRACT_NFT_ADDRESS;
const contractABI = [
  {
    inputs: [
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'string', name: 'symbol', type: 'string' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      { internalType: 'address', name: 'sender', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'address', name: 'owner', type: 'address' },
    ],
    name: 'ERC721IncorrectOwner',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'address', name: 'operator', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'ERC721InsufficientApproval',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'approver', type: 'address' }],
    name: 'ERC721InvalidApprover',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'operator', type: 'address' }],
    name: 'ERC721InvalidOperator',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'ERC721InvalidOwner',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'receiver', type: 'address' }],
    name: 'ERC721InvalidReceiver',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'sender', type: 'address' }],
    name: 'ERC721InvalidSender',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'ERC721NonexistentToken',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'approved',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      { indexed: false, internalType: 'bool', name: 'approved', type: 'bool' },
    ],
    name: 'ApprovalForAll',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'operator', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'recipient', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'string', name: 'uri', type: 'string' },
    ],
    name: 'mintNFT',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'operator', type: 'address' },
      { internalType: 'bool', name: 'approved', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'string', name: 'baseURI_', type: 'string' }],
    name: 'setBaseURI',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
const RPC = process.env.RPC_URL;

const provider = new ethers.JsonRpcProvider(RPC);
const signer = new ethers.Wallet(YOUR_PRIVATE_KEY, provider);
const contract = new ethers.Contract(contractAddress, contractABI, signer);

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

app.post('/generateImage', async (req, res) => {
  const text = req.body && req.body.text;
  if (!text) {
    return res.status(400).json({ error: 'Text is required in request body' });
  }

  try {
    const image_url = await generateImage(text);
    res.json({ imageUrl: image_url });
  } catch (error) {
    console.error('Error generating image:', error.message);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

app.post('/uploadToPinata', async (req, res) => {
  const imageUrl = req.body.imageUrl;

  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const cid = await uploadToPinata(Buffer.from(response.data));
    res.json({ cid: cid });
  } catch (error) {
    console.error('Error uploading to Pinata:', error.message);
    res.status(500).json({ error: 'Failed to upload to Pinata' });
  }
});

async function generateImage(promptText) {
  const OPENAI_API_KEY = process.env.DALEE_API_KEY;
  const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const response = await openai.createImage({
    prompt: promptText,
    n: 1,
    size: '256x256',
  });

  return response.data.data[0].url;
}

async function uploadToPinata(fileBuffer) {
  const pinataEndpoint = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

  const headers = {
    pinata_api_key: PINATA_API_KEY,
    pinata_secret_api_key: PINATA_SECRET_KEY,
    'Content-Type': 'multipart/form-data',
  };

  const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
  const formData = new FormData();
  formData.append('file', blob, 'generated_image.jpg');

  const response = await axios.post(pinataEndpoint, formData, {
    headers: headers,
  });

  return response.data.IpfsHash;
}

async function mintNFT(imageCID, userAddress) {
  console.log('YOUR_RPC_URL', RPC);
  const provider = new ethers.JsonRpcProvider(RPC);
  console.log('provider', provider);
  const signer = new ethers.Wallet(YOUR_PRIVATE_KEY, provider);

  console.log('SIGNER', signer);

  // Create metadata JSON
  const metadata = {
    name: 'Generated NFT',
    description: 'Description of the NFT',
    image: `https://ipfs.io/ipfs/${imageCID}`,
  };

  // This function should handle the uploading process and return the CID of the uploaded JSON
  const metadataCID = await uploadMetadataToPinata(metadata);

  const tokenURI = 'ipfs://' + metadataCID;
  console.log('token uri', tokenURI);
  const contract = new hre.ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  const uniqueTokenId = Math.floor(Math.random() * 1000000); // This should be dynamically generated based on your NFT's requirements

  const tx = await contract.mintNFT(userAddress, uniqueTokenId, tokenURI);
  const receipt = await tx.wait();
  const receiptHash = receipt.hash;
  console.log('https://sepolia.etherscan.io/tx/' + receiptHash);
}

async function uploadMetadataToPinata(metadata) {
  // This function should handle the process of uploading the metadata JSON to Pinata and return the CID
  // You will use the Pinata SDK or API to achieve this.

  const pinataEndpoint = 'https://api.pinata.cloud/pinning/pinJSONToIPFS'; // This endpoint is for pinning JSON to IPFS via Pinata

  const headers = {
    pinata_api_key: PINATA_API_KEY,
    pinata_secret_api_key: PINATA_SECRET_KEY,
  };

  const response = await axios.post(pinataEndpoint, metadata, {
    headers: headers,
  });

  return response.data.IpfsHash; // Assuming the response from Pinata has the CID in `IpfsHash` field
}

async function getNFTsByAddress(address) {
  const provider = new ethers.JsonRpcProvider(RPC);
  const contract = new ethers.Contract(contractAddress, contractABI, provider);

  // Fetch the 'Transfer' events from the contract
  const transferEvents = await contract.queryFilter(
    contract.filters.Transfer(null, address)
  );

  // Extract tokenIds from the events
  const tokenIds = transferEvents.map((event) => event.args.tokenId.toString());

  // Fetch metadata for each tokenId
  const nfts = await Promise.all(
    tokenIds.map(async (tokenId) => {
      const tokenURI = await contract.tokenURI(tokenId);
      // Fetch metadata from tokenURI if necessary
      return { tokenId, tokenURI };
    })
  );

  return nfts;
}

app.post('/mintNFT', async (req, res) => {
  try {
    const { cid, userAddress } = req.body;
    if (!cid || !userAddress) {
      return res
        .status(400)
        .json({ error: 'CID and userAddress are required' });
    }

    await mintNFT(cid, userAddress); // Call the mintNFT function

    res.status(200).json({
      message: 'NFT minted successfully',
      metadata: {
        name: 'Generated NFT',
        description: 'Description of the NFT',
        image: `https://ipfs.io/ipfs/${cid}`,
      },
    });
  } catch (error) {
    console.error('Error minting NFT:', error);
    res.status(500).json({ error: 'Failed to mint NFT' });
  }
});

app.get('/getNFTs/:address', async (req, res) => {
  try {
    const address = req.params.address;
    console.log('nft address', address);
    const nfts = await getNFTsByAddress(address); // This function fetches NFTs from your smart contract
    res.status(200).json(nfts);
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    res.status(500).json({ error: 'Failed to fetch NFTs' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.use(express.json());
