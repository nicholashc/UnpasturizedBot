// @TODO:

// -change event logs to write to a jsonfile
// -parse events by function sigs and useful info
// -verifiy tx later
// -method to return current window
// -br opportunity
// -test garbage data send
// -test garbage data send on react
// -smart gas handling
// -smart nonce hangling

const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;
const { infuraKey, wsPort } = require('../config');
let tournAbi = require('.//ABIs/tournAbi.json');
let gateAbi = require('.//ABIs/gateAbi.json');
let guildAbi = require('./ABIs/guildAbi.json');

// const web3 = new Web3(new Web3.providers.WebsocketProvider(`wss://mainnet.infura.io/ws/v3/${infuraKey}`));
const web3 = new Web3(new Web3.providers.WebsocketProvider(`ws://localhost:${wsPort}`));

//////////////////////
// CONTRACT OBJECTS //
//////////////////////

const tournAddress = '0xDd903896AaCC543Abeef0dEeA9B2a27496f762aD';
const gateAddress = '0x673B537956a28e40aAA8D929Fd1B6688C1583dda';
const guildAddress = '0x35B7838dd7507aDA69610397A85310AE0abD5034';

const tournContract = new web3.eth.Contract(tournAbi, tournAddress);
const gateContract = new web3.eth.Contract(gateAbi, gateAddress);
const guildContract = new web3.eth.Contract(guildAbi, guildAddress);


//////////////////////
// WHITE/BLACKLISTS //
//////////////////////

let dapperBotAddresses = [
	'0xcD89c9607d40f815ea4046827EC4D82CD986e78b',
	'0xd963EdDB8B600094e8C738978f254Ba36ba14999',
	'0x896f68Cb15278Ab783765c12B27D5355704C764f',
	'0x81051eE0f1cafBCA5D6c167D710642619c05A3c1'
];

let whiteListAddresses = [];

let blackListAddresses = [];


/////////////////////
// GENERAL GETTERS //
/////////////////////

const getBlock = async () => {
	try {
		return await web3.eth.getBlockNumber();
	} catch (e) {
    return e;
  }
}

const getBalance = async (address) => {
	try {
		return await web3.eth.getBalance(address);
	} catch (e) {
    return e;
  }
}

const getTx = async (tx) => {
	try {
		return await web3.eth.getTransaction(tx);
	} catch (e) {
    return e;
  }
}

const getNonce = async (address) => {
	try {
		return await web3.eth.getTransactionCount(address);
	} catch (e) {
    return e;
  }
}


///////////////////
// TOURN GETTERS //
///////////////////

const getMoldParams = async () => {
	try {
		return await tournContract.methods.getBlueMoldParameters().call();
	} catch (e) {
    return e;
  }
}

const getTimeParameters = async () => {
	try {
		return await tournContract.methods.getTimeParameters().call();
	} catch (e) {
    return e;
  }
}

const isGameActive = async () => {
	try {
		return await tournContract.methods.isActive().call();
	} catch (e) {
    return e;
  }
}

const isGamePaused = async () => {
	try {
		return await tournContract.methods.isPaused().call();
	} catch (e) {
    return e;
  }
}

const getWizLeft = async () => {
	try {
		return await tournContract.methods.getRemainingWizards().call();
	} catch (e) {
    return e;
  }
}

const isWizReady = async (id) => {
	try {
		return await tournContract.methods.isReady(id).call();
	} catch (e) {
    return e;
  }
}

const getBattleWiz = async (id) => {
	try {
		return await tournContract.methods.getWizard(id).call();
	} catch (e) {
    return e;
  }
}


//////////////////
// GATE GETTERS //
//////////////////

const getWizCost = async () => {
	try {
		return await gateContract.methods.wizardCosts().call();
	} catch (e) {
    return e;
  }
}

///////////////////
// GUILD GETTERS //
///////////////////

const getOwnerOf = async (id) => {
	try {
		return await guildContract.methods.ownerOf(id).call();
	} catch (e) {
    return e;
  }
}

const getGuildWiz = async (id) => {
	try {
		return await guildContract.methods.getWizard(id).call();
	} catch (e) {
    return e;
  }
}

const getUserWizBalance = async (address) => {
	try {
		return await guildContract.methods.balanceOf(address).call();
	} catch (e) {
    return e;
  }
}


////////////////////
// GENERAL EVENTS //
////////////////////

const subscription = web3.eth.subscribe('pendingTransactions')
	.on("data", async (tx) => {
		try {
	    let res = await getTx(tx);
			// console.log(res.to)
			if (res.to != null && res.to != undefined) {
				if (res.to === tournAddress) {
					handleTournEvent(res);
				}
				if (res.to === gateAddress) {
					handleGateEvent(res);
				}
				if (res.to === guildAddress) {
					handleGuildEvent(res);
				}
			}
		} catch (e) {
	    return e;
	  }
});


//////////////////
// TOURN EVENTS //
//////////////////

const handleTournEvent = (obj) => {
		console.log('tournment event found', obj);
}

/////////////////
// GATE EVENTS //
/////////////////

const handleGateEvent = (obj) => {
		console.log('gatekeeper event found', obj);
}

//////////////////
// GUILD EVENTS //
//////////////////

const handleGuildEvent = (obj) => {
		console.log('guild event found', obj);
}


/////////////////
// SEND RAW TX //
/////////////////

let defNonce = 0x0;
let defGasLimit = web3.utils.toHex(200000); //200k
let defGasPrice = web3.utils.toHex(10000000000); //10 gwei

const formTx = async (txCount, gasL, gasP, addTo, val, data) => {
	  let txData = {
	    nonce: txCount,
	    gasLimit: gasL,
	    gasPrice: gasP,
	    to: addTo,
			value: val,
			data: data,
	  }
		return txData;
}

const sendSigned = async (key, txData) => {
	let privKey = new Buffer.from(key, 'hex');
	let tx = new Tx(txData);
	tx.sign(privKey);
	let txFormated = '0x' + tx.serialize().toString('hex');
	try {
		console.log('Sending...', JSON.stringify(txData, null, 2));
  	const res = await web3.eth.sendSignedTransaction(txFormated);
		console.log(res);
	} catch(e) {
		return e;
	}
}


////////////////
// CORE LOGIC //
////////////////

// @todo



///////////
// TESTS //
///////////

// uncomment to verify functions are returning data in the correct format

// getBlock()
// 	.then(console.log.bind(
// 		console, 'getBlock test, expected res is a number:')
// 	);
//
// getBalance('0x5C035Bb4Cb7dacbfeE076A5e61AA39a10da2E956')
// 	.then(console.log.bind(
// 		console, 'getBalance test, expected res is a string in wei:')
// 	);
//
// getMoldParams()
// 	.then(console.log.bind(
// 		console, 'getMoldParams test, expected res is an object:')
// 	);
//
// getTimeParameters()
// 	.then(console.log.bind(
// 		console, 'getTimeParameters test, expected res is an object:')
// 	);
//
// isGameActive()
// 	.then(console.log.bind(
// 		console, 'isGameActive test, expected res is a bool:')
// 	);
//
// isGamePaused()
// 	.then(console.log.bind(
// 		console, 'isGamePaused test, expected res is a bool:')
// 	);
//
// getWizLeft()
// 	.then(console.log.bind(
// 		console, 'getWizLeft test, expected res is a number as string:')
// 	);
//
// isWizReady(1350)
// 	.then(console.log.bind(
// 		console, 'isWizReady test, expected res is a bool:')
// 	);
//
// getBattleWiz(1350)
// 	.then(console.log.bind(
// 		console, 'getBattleWiz test, expected res is an object:')
// 	);
//
// getWizCost()
// 	.then(console.log.bind(
// 		console, 'getWizCost test, expected res is an object:')
// 	);
//
// getOwnerOf(1350)
// 	.then(console.log.bind(
// 		console, 'getOwnerOf test, expected res is a string address:')
// 	);
//
// getGuildWiz(1350)
// 	.then(console.log.bind(
// 		console, 'getGuildWiz test, expected res is an object:')
// 	);
//
// getUserWizBalance('0x5C035Bb4Cb7dacbfeE076A5e61AA39a10da2E956')
// 	.then(console.log.bind(
// 		console, 'getUserWizBalance test, expected res is a number as string:')
// 	);
