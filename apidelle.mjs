async function generateImage(promptText) {
  // Make a request to your server to generate the image
  const response = await axios.post(
    'http://165.227.42.196:3000/generateImage',
    {
      text: promptText,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (response.data && response.data.imageUrl) {
    return response.data.imageUrl;
  } else {
    throw new Error('Failed to generate image from server.');
  }
}

async function handleImageGenerationAndUpload() {
  try {
    const promptText = document.getElementById('imagePrompt').value;
    const imageURL = await generateImage(promptText);

    // Display the generated image in the frontend
    document.getElementById('generatedImage').src = imageURL;
    document.getElementById('generatedImage').style.display = 'block';

    // Upload the image to Pinata and get the CID
    const pinataResponse = await axios.post(
      'http://165.227.42.196:3000/uploadToPinata',
      { imageUrl: imageURL }
    );
    const cid = pinataResponse.data.cid;

    // Display the CID on the frontend
    document.getElementById('nftCID').innerText = cid;

    // Activate the "Convert to NFT" button
    document.getElementById('convertToNFTButton').disabled = false;
  } catch (error) {
    console.error('Error generating and uploading image:', error);
  }
}

const prompts = [
  'serene lakeside village at dawn',
  'robot dancing in the rain',
  'ancient temple hidden in a jungle',
  'dragon soaring above misty mountains',
  'astronaut playing an alien instrument',
  'floating island with waterfalls',
  'enchanted forest lit by fireflies',
  'mermaid singing on a rock',
  'knight riding a mechanical horse',
  'city made entirely of crystals',
  'phoenix rising from a bed of flowers',
  'pirate ship sailing through space',
  'library where books come to life',
  'gnome village inside a mushroom forest',
  'lighthouse guiding spaceships',
  'desert oasis with a door to another dimension',
  'wizard brewing potions in a modern lab',
  'moonlit beach with glowing tides',
  'fairy playing a harp made of ice',
  'steampunk city powered by magic',
  'alien market selling rare stars',
  'castle floating on a cloud',
  'garden where statues tell stories',
  'cyborg meditating on a mountaintop',
  'train traveling through dreamscapes',
  'tree with golden leaves and silver fruit',
  ' underwater cavern filled with treasures',
  'post-apocalyptic world with nature reclaiming cities',
  'samurai facing off against a shadowy figure',
  'carnival where mythical creatures perform',
  'clock tower that manipulates time',
  'troll guarding a bridge to a utopia',
  'arctic village with igloos made of gemstones',
  'school for young wizards in a metropolitan setting',
  'volcano that erupts with colorful gems',
  'observatory that peers into different universes',
  'meadow where stars fall gently to the ground',
  'cave with paintings that predict the future',
  'deep-sea city with bioluminescent streets',
  'gladiator arena in a futuristic setting',
  'forest with trees that whisper secrets',
  'portal at the end of a rainbow',
  'dungeon where prisoners tell tales of distant worlds',
  'tranquil pond reflecting another realm',
  "giant's kitchen with unusual ingredients",
  'opera house where ghosts perform',
  'circus in the sky with flying performers',
  'vineyard where each grape tells a story',
  'snowy peak with footprints leading to the unknown',
  'cabin in the woods with magical creatures as neighbors',
];

// Generate combinations
function generateCombinations(prompts) {
  let combinations = new Set();

  for (let i = 0; i < prompts.length; i++) {
    for (let j = i + 1; j < prompts.length; j++) {
      combinations.add(prompts[i] + ' and ' + prompts[j]);
    }
  }

  return Array.from(combinations);
}

const allCombinations = generateCombinations(prompts);

// Fetch a random combination
function getRandomPrompt() {
  const randomIndex = Math.floor(Math.random() * allCombinations.length);
  const prompt = allCombinations[randomIndex];

  // Remove the used prompt so it won't be used again
  allCombinations.splice(randomIndex, 1);

  return prompt;
}

// Simulate user clicking "Surprise Me"
document
  .getElementById('surpriseMeButton')
  .addEventListener('click', function () {
    const surprisePrompt = getRandomPrompt();
    document.getElementById('imagePrompt').value = surprisePrompt;

    // You can now trigger the image generation function if you want
    // handleImageGenerationAndUpload();
  });

document
  .getElementById('generateImageButton')
  .addEventListener('click', handleImageGenerationAndUpload);

document
  .getElementById('convertToNFTButton')
  .addEventListener('click', async () => {
    try {
      let userAddress = null;
      if (
        typeof window.ethereum !== 'undefined' ||
        typeof window.web3 !== 'undefined'
      ) {
        userAddress = await getAccount();
        console.log(userAddress); // This will log the user's Ethereum address

        // Listening to account changes can be moved outside of the button click event
        // to avoid adding multiple listeners on multiple button clicks.
        window.ethereum.on('accountsChanged', function (accounts) {
          userAddress = accounts[0];
          console.log(userAddress);
        });
      }

      const cid = document.getElementById('nftCID').innerText;

      const response = await axios.post('http://165.227.42.196:3000/mintNFT', {
        cid: cid,
        userAddress: userAddress, // using the userAddress variable directly
      });

      if (response.data.success) {
        console.log(response.data.message);
        alert('NFT minted successfully!');
      } else {
        console.error(response.data.message);
        alert('NFT minted successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error minting NFT');
    }
  });

async function getAccount() {
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });
  return accounts[0]; // The current MetaMask account
}
