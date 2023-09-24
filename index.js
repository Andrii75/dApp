class Wallet {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.userAddress = null;
    this.isAlreadyConnected =
      typeof window !== 'undefined' ? this.checkInitialConnection() : false;
  }

  checkInitialConnection() {
    return (
      window && window.ethereum && window.ethereum.selectedAddress !== null
    );
  }

  // ... rest of the class

  async getSigner() {
    return this.provider.getSigner();
  }
  async getBalance(address) {
    const balance = await this.provider.getBalance(address);
    return ethers.utils.formatUnits(balance, 18);
  }

  async connect() {
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    await this.provider.send('eth_requestAccounts', []);
    this.signer = await this.getSigner();
    this.userAddress = await this.signer.getAddress();

    console.log('Connected');
    console.log(this.userAddress);
    return this.userAddress;
  }

  isConnected() {
    return this.userAddress !== null;
  }
  disconnect() {
    this.connectionState = null;
  }
}

class UIController {
  constructor() {
    this.ethBalance = document.getElementById('ethBalance');
    this.ethAccount = document.getElementById('ethAccount');
    this.ethSendButton = document.getElementById('ethSendButton');
    this.ethSendToAddress = document.getElementById('ethSendTo');
    this.ethSendAmount = document.getElementById('ethSendAmount');
    this.currency = document.getElementById('currency').textContent;
    this.connectButton = document.getElementById('connectButton');
    this.ethWrapper = document.getElementById('ethWrapper');
    this.linkContainer = document.getElementById('transactionLinkContainer');
    this.loader = document.getElementById('loader');
    this.ETHSwitcher = document.getElementById('ETHSwitcher');
    this.ERC20Switcher = document.getElementById('ERC20Switcher');
    this.BTCSwitcher = document.getElementById('BTCSwitcher');
    this.ERC20Wrapper = document.getElementById('ERC20Wrapper');
    this.ethWrapper = document.getElementById('ethWrapper');
    this.ERC20Balance = document.getElementById('ERC20Balance');
    this.ERC20Symbol = document.getElementById('ERC20Symbol');
    this.ERC20Account = document.getElementById('ERC20Account');
    this.ERC20sendTo = document.getElementById('ERC20sendTo');
    this.ERC20loader = document.getElementById('ERC20loader');
    this.ERC20transactionLinkContainer = document.getElementById(
      'ERC20transactionLinkContainer'
    );
    this.ConnectBTCButton = document.getElementById('ConnectBTCButton');
    this.btcBalance = document.getElementById('btcBalance');
    this.btcAccount = document.getElementById('btcAccount');
    this.btcSendButton = document.getElementById('btcSendButton');
    this.btcSendAmount = document.getElementById('btcSendAmount');
    this.btcSendTo = document.getElementById('btcSendTo');
    this.btcSendFee = document.getElementById('btcSendFee');
    this.btcLoader = document.getElementById('btcLoader'); // this was missing; ensure you add it to HTML if you want a loader
    this.btcTransactionLinkContainer = document.getElementById(
      'btcTransactionLinkContainer'
    ); // this was missing; ensure you add it to HTML if you want a link container
    this.btcWrapper = document.getElementById('btcWrapper');
    this.btcAuthWrapper = document.getElementById('btcAuthWrapper');
    this.nftSwitcher = document.getElementById('NFTSwitcher');
    this.nftWrapper = document.getElementById('nftWrapper');
    this.nftBalance = document.getElementById('nftBalance');
    this.nftAccount = document.getElementById('nftAccount');
  }
  showLoader() {
    this.loader.style.display = 'block';
  }
  hideConnectMetaMaskButton() {
    this.connectButton.style.display = 'none';
  }

  hideConnectBTCButton() {
    this.ConnectBTCButton.style.display = 'none';
  }

  hideLoader() {
    this.loader.style.display = 'none';
  }

  updateBalance(balance) {
    this.ethBalance.textContent = Number(balance).toFixed(5);
  }

  updateAccount(account) {
    this.ethAccount.textContent = account;
  }

  updateTransactionLink(link) {
    const linkElement = document.createElement('a');
    linkElement.href = link;
    linkElement.textContent = 'View transaction on Etherscan';
    linkElement.target = '_blank';

    this.linkContainer.appendChild(linkElement);
    this.linkContainer.classList.add('active');
  }
  updateERC20TransactionLink(link) {
    const linkElement = document.createElement('a');
    linkElement.href = link;
    linkElement.textContent = 'View ERC20 transaction on Etherscan';
    linkElement.target = '_blank';

    this.ERC20transactionLinkContainer.appendChild(linkElement);
    this.ERC20transactionLinkContainer.classList.add('active');
  }

  resetInputFields() {
    this.ethSendToAddress.value = '';
    this.ethSendAmount.value = '';
  }

  hideConnectButton() {
    this.connectButton.parentElement.classList.remove('active');
    this.ethWrapper.classList.add('active');
  }

  updateERC20Balance(balance) {
    this.ERC20Balance.textContent = Number(balance).toFixed(5);
  }

  updateERC20Symbol(symbol) {
    this.ERC20Symbol.textContent = symbol;
  }

  updateERC20Account(account) {
    this.ERC20Account.textContent = account;
  }

  clearTransactionLinks() {
    while (this.linkContainer.firstChild) {
      this.linkContainer.removeChild(this.linkContainer.firstChild);
    }

    while (this.ERC20transactionLinkContainer.firstChild) {
      this.ERC20transactionLinkContainer.removeChild(
        this.ERC20transactionLinkContainer.firstChild
      );
    }
  }
  showERC20Loader() {
    this.ERC20loader.style.display = 'block';
  }

  hideERC20Loader() {
    this.ERC20loader.style.display = 'none';
  }

  activateETH() {
    console.log('Activating ETH wrapper...');
    this.ethWrapper.classList.add('active');
    this.ERC20Wrapper.classList.remove('active');
    this.btcAuthWrapper.classList.remove('active');
    this.nftWrapper.classList.remove('active');
    this.btcWrapper.classList.remove('active');
  }
  activateNFT() {
    console.log('Activating ERC20 wrapper...');
    this.ethWrapper.classList.remove('active');
    this.ERC20Wrapper.classList.remove('active');
    this.btcAuthWrapper.classList.remove('active');
    this.nftWrapper.classList.add('active');
    this.btcWrapper.classList.remove('active');
  }
  activateERC20() {
    console.log('Activating ERC20 wrapper...');
    this.ethWrapper.classList.remove('active');
    this.ERC20Wrapper.classList.add('active');
    this.btcAuthWrapper.classList.remove('active');
    this.nftWrapper.classList.remove('active');
    this.btcWrapper.classList.remove('active');
  }

  activateBTC() {
    console.log('Activating BTC wrapper...');
    this.btcAuthWrapper.classList.add('active');
    this.ethWrapper.classList.remove('active');
    this.ERC20Wrapper.classList.remove('active');
    this.nftWrapper.classList.remove('active');
    this.connectButton.style.display = 'none';
    this.ConnectBTCButton.style.display = 'none';
  }
  activateBTCWallet() {
    console.log('Switching to BTC wallet view...');
    this.btcAuthWrapper.classList.remove('active');
    this.btcWrapper.classList.add('active');
    this.ethWrapper.classList.remove('active');
    this.ERC20Wrapper.classList.remove('active');
    this.nftWrapper.classList.remove('active');
  }

  showBTCLoader() {
    this.btcLoader.style.display = 'block';
  }

  hideBTCLoader() {
    this.btcLoader.style.display = 'none';
  }

  updateBTCBalance(balance) {
    const btcBalance = balance / 100000000;
    this.btcBalance.textContent = `${btcBalance} BTC`;
  }

  updateBTCAccount(account) {
    this.btcAccount.textContent = account;
  }

  updateBTCTransactionLink(link) {
    const linkElement = document.getElementById('BTCtransactionLinkContainer');
    linkElement.href = link;
    linkElement.textContent = 'View BTC transaction'; // Update this as per the block explorer you're using
    linkElement.target = '_blank';

    this.btcTransactionLinkContainer.appendChild(linkElement);
    this.btcTransactionLinkContainer.classList.add('active');
  }
}

class EthTransaction {
  constructor(wallet, uiController) {
    this.wallet = wallet;
    this.uiController = uiController;

    if (this.wallet.isAlreadyConnected) {
      this.uiController.hideConnectButton();
    } else {
      this.uiController.connectButton.addEventListener(
        'click',
        this.onConnect.bind(this)
      );
    }
    this.uiController.ethSendButton.addEventListener(
      'click',
      this.onSendEth.bind(this)
    );
    this.uiController.connectButton.addEventListener(
      'click',
      this.onConnect.bind(this)
    );
  }
  async onConnect() {
    await this.wallet.connect();
    this.uiController.hideConnectMetaMaskButton();
    this.uiController.hideConnectBTCButton();
    await this.updateUI();
  }

  isConnected() {
    return this.wallet.isConnected();
  }

  async updateUI() {
    const userAddress = this.wallet.userAddress;
    this.uiController.updateAccount(userAddress);
    const balance = await this.wallet.getBalance(userAddress);
    this.uiController.updateBalance(balance);
  }

  async onSendEth() {
    this.uiController.showLoader();
    this.uiController.clearTransactionLinks();
    const sendToValue = this.uiController.ethSendToAddress.value;
    const sendAmountValue = ethers.utils.parseUnits(
      this.uiController.ethSendAmount.value,
      18
    );
    const tx = await this.wallet.signer.sendTransaction({
      // use signer from wallet
      to: sendToValue,
      value: sendAmountValue,
    });

    const receipt = tx.hash;
    const etherscanLink = 'https://sepolia.etherscan.io/tx/' + receipt;
    alert('Transaction Hash:' + ' ' + receipt);

    this.uiController.updateTransactionLink(etherscanLink);
    await tx.wait();
    this.uiController.hideLoader();
    await this.updateUI();

    this.uiController.resetInputFields();

    alert(
      'Sending' +
        ' ' +
        sendAmountValue +
        ' ' +
        this.uiController.currency +
        ' ' +
        'to' +
        ' ' +
        sendToValue.toString()
    );
  }
}

class SwitcherController {
  constructor(
    wallet,
    uiController,
    ethTransaction,
    erc20Transaction,
    btcTransaction
  ) {
    this.wallet = wallet;
    this.uiController = uiController;
    this.ethTransaction = ethTransaction;
    this.erc20Transaction = erc20Transaction;
    this.btcTransaction = btcTransaction;
    this.connectionState = null;

    this.uiController.ConnectBTCButton.addEventListener('click', () => {
      console.log('Connecting to BTC...');
      this.btcTransaction.onConnect().then(() => {
        this.connectionState = 'BTC';
        this.uiController.activateBTC();
        console.log('Connected to BTC');
      });
    });

    this.uiController.BTCSwitcher.addEventListener('click', () => {
      console.log('Switching to BTC...');
      this.changeToBTC();
    });

    this.uiController.ERC20Switcher.addEventListener('click', () => {
      console.log('Switching to ERC20...');
      this.changeToErc20();
    });

    this.uiController.ETHSwitcher.addEventListener('click', () => {
      console.log('Switching to ETH...');
      this.changeToEth();
    });
    this.uiController.nftSwitcher.addEventListener('click', () => {
      console.log('Switching to NFT...');
      this.changeToNFT();
    });
  }
  disconnectBTC() {
    // Implement logic to disconnect from BTC
    this.wallet.disconnect(); // You might need to implement this method
    this.connectionState = null;
  }

  disconnectETHAndERC20() {
    // Implement logic to disconnect from ETH and ERC20
    this.wallet.disconnect(); // You might need to implement this method
    this.connectionState = null;
  }
  changeToBTC() {
    this.uiController.activateBTC();
    this.uiController.ethWrapper.classList.remove('active');
    this.uiController.ERC20Wrapper.classList.remove('active');
    this.uiController.nftWrapper.classList.remove('active');
  }

  changeToEth() {
    this.connectionState = 'ETH'; // Ensure this is being set correctly
    this.uiController.activateETH();
    this.uiController.btcWrapper.classList.remove('active');
    this.uiController.ERC20Wrapper.classList.remove('active');
    this.uiController.nftWrapper.classList.remove('active');
  }
  changeToErc20() {
    console.log('Attempting to change to ERC20'); // Debugging line

    // if (this.connectionState === 'ERC20') {
    //   console.log('Already on ERC20. Returning.'); // Debugging line
    //   return;
    // }

    if (this.wallet.isConnected()) {
      this.erc20Transaction.onConnect().then(() => {
        this.connectionState = 'ERC20';
        this.uiController.activateERC20();
        this.erc20Transaction.updateUI();
      });
    }
  }

  changeToNFT() {
    this.uiController.activateNFT();
    this.uiController.ethWrapper.classList.remove('active');
    this.uiController.btcWrapper.classList.remove('active');
    this.uiController.ERC20Wrapper.classList.remove('active');

    // If wallet is connected, display the NFTs
    if (this.wallet.isConnected()) {
      const nftTransaction = new NFTTransaction(this.wallet, this.uiController);
      nftTransaction.displayNFTs(this.wallet.userAddress);
    }
  }
}

const wallet = new Wallet();

class ERC20Transaction {
  constructor(wallet, uiController, ERC20_Address, ERC20_ABI) {
    this.wallet = wallet;
    this.uiController = uiController;
    this.contractAddress = ERC20_Address;
    this.contractABI = ERC20_ABI;
    this.userAddress = this.wallet.userAddress;
    this.sendToInput = document.getElementById('ERC20SendTo');
    this.sendAmountInput = document.getElementById('ERC20SendAmount');
    this.sendButton = document.getElementById('ERC20SendButton');

    this.sendButton.addEventListener('click', this.onSendToken.bind(this));
  }

  async onConnect() {
    this.userAddress = this.wallet.userAddress;
    this.uiController.hideConnectButton();
    await this.updateUI();
  }

  isConnected() {
    return this.userAddress !== null;
  }

  async updateUI() {
    this.uiController.updateERC20Account(this.userAddress);

    if (
      !ethers.utils.isAddress(this.contractAddress) ||
      !ethers.utils.isAddress(this.userAddress)
    ) {
      console.error('Contract address or user address is invalid');
      return;
    }

    const contract = new ethers.Contract(
      this.contractAddress,
      this.contractABI,
      this.wallet.provider
    );

    try {
      const balance = await contract.balanceOf(this.userAddress);
      const decimals = await contract.decimals();

      const balanceForUi = ethers.utils.formatUnits(balance, decimals);
      this.uiController.updateERC20Balance(balanceForUi);

      const symbol = await contract.symbol();
      this.uiController.updateERC20Symbol(symbol);
    } catch (error) {
      console.error('Error interacting with contract: ', error);
    }
  }

  async onSendToken() {
    this.uiController.showERC20Loader();
    this.uiController.clearTransactionLinks();
    if (!this.wallet.isConnected()) {
      return;
    }

    const sendToValue = this.sendToInput.value;
    const sendAmountValue = ethers.utils.parseUnits(
      this.sendAmountInput.value,
      8
    );
    const contract = new ethers.Contract(
      this.contractAddress,
      this.contractABI,
      await this.wallet.getSigner()
    );

    try {
      const tx = await contract.transfer(sendToValue, sendAmountValue);
      const receipt = tx.hash;
      const etherscanLink = 'https://sepolia.etherscan.io/tx/' + receipt;
      alert('Transaction Hash:' + ' ' + receipt);

      this.uiController.updateERC20TransactionLink(etherscanLink); // This is the correct call
      await tx.wait();
      this.uiController.hideLoader();
      await this.updateUI();
      this.uiController.resetInputFields();

      alert(
        'Sending' +
          ' ' +
          sendAmountValue +
          ' ' +
          this.uiController.ERC20Symbol.toString() +
          ' ' +
          'to' +
          ' ' +
          sendToValue.toString()
      );
    } catch (err) {
      console.error('Failed to send transaction: ', err);
    }
    this.uiController.hideERC20Loader();
  }
}

class BTCTransaction {
  constructor(wallet, uiController, btcPrivateKey) {
    this.wallet = wallet;
    this.uiController = uiController;
    this.privateKey = btcPrivateKey;
    this.isConnectedToBTC = false;
    this.uiController.btcSendButton.addEventListener(
      'click',
      this.onSendBTC.bind(this)
    );

    this.network = bitcoinjs.networks.testnet;
    this.keyPair = bitcoinjs.ECPair.fromPrivateKey(
      bitcoinjs.Buffer.from(this.privateKey, 'hex'),
      { network: this.network }
    );
    console.log('network', this.network);
  }

  async onConnect() {
    // The code for the onConnect method
    this.isConnectedToBTC = true;
    const address = await this.generateAddress();
    this.uiController.updateBTCAccount(address);

    const balance = await this.getBalance(address);
    this.uiController.updateBTCBalance(balance);
  }

  async generateAddress() {
    if (!this.isConnectedToBTC) {
      console.error('Not connected to BTC');
      return;
    }

    const { address } = bitcoinjs.payments.p2pkh({
      pubkey: this.keyPair.publicKey,
      network: bitcoinjs.networks.testnet,
    });

    return address;
  }

  async getBalance(address) {
    if (!this.isConnectedToBTC) {
      console.error('Not connected to BTC');
      return;
    }

    const url = `https://api.blockcypher.com/v1/btc/test3/addrs/${address}/balance`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      // Balance in satoshis
      return data.balance;
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  }

  async broadcastTransaction(txHex) {
    try {
      const url = 'https://api.blockcypher.com/v1/btc/test3/txs/push';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tx: txHex }),
      });
      console.log('response', response);

      const broadcastResponse = await response.json();
      console.log('Broadcast response:', broadcastResponse); // Log here

      if (response.ok) {
        console.log('Transaction broadcasted successfully:', broadcastResponse);
        return broadcastResponse;
      } else {
        console.error(
          'Failed to broadcast transaction:',
          broadcastResponse.error
        );
        throw new Error(broadcastResponse.error);
      }
    } catch (error) {
      console.error(
        'An error occurred while broadcasting the transaction:',
        error
      );
      throw error;
    }
  }

  async onSendBTC() {
    const recipientAddress = this.uiController.btcSendTo.value;
    const sendAmountValue = ethers.utils
      .parseUnits(this.uiController.btcSendAmount.value, 8)
      .toNumber();
    const feeAmountValue = ethers.utils
      .parseUnits(this.uiController.btcSendFee.value, 8)
      .toNumber();

    const address = await this.generateAddress();

    const accountDataResponse = await fetch(
      `https://api.blockcypher.com/v1/btc/test3/addrs/${address}`
    );
    const accountData = await accountDataResponse.json();
    console.log('accountDataResponse', accountDataResponse);
    const txb = new bitcoinjs.TransactionBuilder(this.network);
    let totalInputValue = 0;
    let inputIndex = 0; // Keep track of the input index

    // Iterate through all available UTXOs and add them as inputs
    for (const utxo of accountData.txrefs) {
      if (utxo.tx_output_n !== -1) {
        txb.addInput(utxo.tx_hash, utxo.tx_output_n);
        totalInputValue += utxo.value;
        inputIndex++;
        if (totalInputValue >= sendAmountValue + feeAmountValue) break; // Stop when we have enough input
      }
    }

    // Check if the total input value is sufficient
    if (totalInputValue < sendAmountValue + feeAmountValue) {
      throw new Error('Insufficient funds to send transaction.');
    }

    // Calculate the change amount
    const changeAmount = totalInputValue - sendAmountValue - feeAmountValue;

    // Add the outputs
    txb.addOutput(recipientAddress, sendAmountValue); // Output to the recipient
    txb.addOutput(address, changeAmount); // Change output to your own address

    // Sign each input
    for (let i = 0; i < inputIndex; i++) {
      txb.sign(i, this.keyPair);
    }

    const txHex = txb.build().toHex();
    console.log('txHex', txHex);
    const broadcastResponse = await this.broadcastTransaction(txHex);
    console.log('broadcastResponse', broadcastResponse);
    const txHash = broadcastResponse.tx.hash; // Access the hash from the response object
    console.log('txHash', txHash);
    // Create a link element
    const blockchainLink =
      'https://live.blockcypher.com/btc-testnet/tx/' + txHash;
    alert('Transaction Hash:' + ' ' + txHash);

    this.uiController.updateBTCTransactionLink(blockchainLink);
    this.uiController.hideLoader();
    await this.updateUI();
  }
}

class BTCAuth {
  constructor(uiController) {
    this.uiController = uiController;
    this.btcMnemonicField = document.getElementById('btcMnemonicField');
    this.btcPrivateKeyField = document.getElementById('btcPrivateKeyField');
    this.network = bitcoinjs.networks.testnet;
    this.path = "m/49'/1'/0'/0/0";

    // Setting up the event listeners inside the constructor
    document.getElementById('btcAuthButton').addEventListener('click', () => {
      this.loginWithPrivateKey();
    });

    document
      .getElementById('btcGenerateMnemonicButton')
      .addEventListener('click', () => {
        this.generateWallet();
      });
  }

  generateWallet() {
    // Generate a random 16-byte seed
    const seed = ethers.utils.randomBytes(16);
    console.log('seed', seed);
    // Convert this seed into a mnemonic
    const mnemonic = ethers.utils.entropyToMnemonic(seed);
    console.log('mnemonic', mnemonic);
    // Derive a Bitcoin root and child address using the seed
    const root = bitcoinjs.bip32.fromSeed(
      bitcoinjs.Buffer.from(seed.buffer),
      this.network
    );

    console.log('root', root);
    const child = root.derivePath(this.path);
    console.log('child', child);

    // Populate the mnemonic and private key fields
    this.btcMnemonicField.value = mnemonic;
    this.btcPrivateKeyField.value = child.privateKey.toString('hex');
    console.log('privatekey', this.btcPrivateKeyField.value);
  }

  async loginWithPrivateKey() {
    // Ensure a private key exists
    if (!this.btcPrivateKeyField.value) {
      alert('Please enter a private key.');
      return;
    }

    // Derive the Bitcoin address from the private key
    const keyPair = bitcoinjs.ECPair.fromPrivateKey(
      bitcoinjs.Buffer.from(this.btcPrivateKeyField.value, 'hex'),
      { network: this.network }
    );

    // Derive the P2PKH address (instead of P2WPKH)
    const { address } = bitcoinjs.payments.p2pkh({
      pubkey: keyPair.publicKey,
      network: this.network,
    });

    console.log('Derived Address:', address); // Log the derived address for debugging

    // Fetch the balance for the derived address using BlockCypher's testnet3
    const balanceBTC = await this.fetchBalance(address);

    // Update the UI
    this.uiController.updateBTCAccount(address);
    this.uiController.updateBTCBalance(balanceBTC * 100000000); // Convert BTC to satoshis for the UI method
    this.uiController.activateBTCWallet();
  }

  async fetchBalance(address) {
    try {
      // Fetch the balance using BlockCypher's testnet3 API
      const response = await fetch(
        `https://api.blockcypher.com/v1/btc/test3/addrs/${address}/balance`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch balance from BlockCypher');
      }
      const data = await response.json();
      return data.final_balance / 100000000; // Convert satoshis to BTC
    } catch (error) {
      console.error('Error fetching balance:', error);
      return 0; // Return 0 as balance if there's an error
    }
  }
}
const uiController = new UIController();
const btcAuth = new BTCAuth(uiController);

class NFTTransaction {
  constructor(wallet, uiController) {
    this.wallet = wallet;
    this.uiController = uiController;
    this.userAddress = this.wallet.userAddress;

    // If wallet is already connected, fetch and display the NFTs
    if (this.wallet.isAlreadyConnected) {
      this.displayNFTs(this.userAddress);
    }
  }
  async displayNFTs(address) {
    try {
      const response = await axios.get(
        `https://theservers.ca/getNFTs/${address}`
      );
      const nfts = response.data;

      const nftContainer = document.getElementById('nftsContainer');
      nftContainer.innerHTML = ''; // Clear the container

      for (const nft of nfts) {
        const tokenURI = nft.tokenURI;
        const metadata = await this.fetchMetadata(tokenURI);

        // ...

        const img = document.createElement('img');
        img.src = metadata.image; // Use the image URL directly from the metadata

        console.log('Fetched Metadata:', metadata);

        const { name, description, image } = metadata;

        const nftDiv = document.createElement('div');
        img.className = 'nftImage';
        nftDiv.className = 'nftItem';

        const title = document.createElement('h3');
        title.textContent = name || 'Unknown Name'; // Handle missing properties
        nftDiv.appendChild(title);

        const desc = document.createElement('p');
        desc.textContent = description || 'No Description';
        nftDiv.appendChild(desc);
        nftDiv.appendChild(img);

        nftContainer.appendChild(nftDiv);
      }
    } catch (error) {
      console.error('Error fetching and displaying NFTs:', error);
    }
  }
  async fetchMetadata(tokenURI) {
    try {
      // Convert ipfs:// URI to a public IPFS gateway URL
      const ipfsGatewayUrl = tokenURI.replace(
        'ipfs://',
        'https://ipfs.io/ipfs/'
      );

      const response = await axios.get(ipfsGatewayUrl, {
        responseType: 'arraybuffer',
      }); // Fetch as arraybuffer to handle both binary and text

      if (response.status !== 200) {
        throw new Error(
          `Failed to fetch metadata with status: ${response.status}`
        );
      }

      const contentType = response.headers['content-type'];

      if (contentType.startsWith('image/')) {
        // If it's an image, return the image URL directly
        return { image: ipfsGatewayUrl };
      } else if (contentType === 'application/json') {
        // Use TextDecoder to decode the ArrayBuffer to string
        const decoder = new TextDecoder('utf-8');
        const metadataStr = decoder.decode(response.data);
        const metadata = JSON.parse(metadataStr);
        return metadata;
      } else {
        throw new Error(`Unsupported content type: ${contentType}`);
      }
    } catch (error) {
      console.error('Error fetching metadata for tokenURI:', tokenURI, error);
      return null;
    }
  }
}

const ERC20_ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
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
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
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
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'burnFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'cap',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'mint',
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
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
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
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
const ERC20_Address = '0x7B0F1f20Fc6f2E67984b397e06538fC1E6FbEaeb';
const btcPrivateKey =
  '62652301c2caa7ae0b6c07ce8a8fa1ad0797f1d187fcf29f584eb9f68a1fd30d';
const ethTransaction = new EthTransaction(wallet, uiController);
const erc20Transaction = new ERC20Transaction(
  wallet,
  uiController,
  ERC20_Address,
  ERC20_ABI
);
const btcTransaction = new BTCTransaction(wallet, uiController, btcPrivateKey);
const switcherController = new SwitcherController(
  wallet,
  uiController,
  ethTransaction,
  erc20Transaction,
  btcTransaction
);

function generateImageFromText() {
  const text = document.getElementById('imageText').value;

  fetch('https://theservers.ca/generateImage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: text }),
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById('generatedImage').src = data.imageUrl;
    })
    .catch((error) => {
      console.error('Error generating image:', error);
    });
}
