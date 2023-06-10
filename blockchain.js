const Web3 = require('web3');
const MyNFT = require('./build/contracts/MyNFT.json');  //chemin vers le fichier json du contrat compilé

// Initialisation de web3
const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');

// Récupérer le contrat
const contract = new web3.eth.Contract(
  MyNFT.abi, // L'ABI de votre contrat
  '0xYourContractAddress' // L'adresse de votre contrat
);

// Appeler une fonction de lecture sur le contrat
contract.methods.name().call()
  .then(result => console.log(result))
  .catch(error => console.error(error));

// Appeler une fonction de modification sur le contrat
contract.methods.mint('0xYourAddress').send({from: '0xYourAddress'})
  .then(result => console.log(result))
  .catch(error => console.error(error));