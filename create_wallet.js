const axios = require('axios');

async function createTestnetWalletWithBlockcypher() {
  try {
    const response = await axios.post(
      'https://api.blockcypher.com/v1/btc/test3/addrs'
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating wallet:', error);
    return null;
  }
}

createTestnetWalletWithBlockcypher();
