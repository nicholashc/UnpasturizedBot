const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;
const fs = require('fs');
const result = require('dotenv').config({ path: '../.env' });

let tournAbi = require('./ABIs/tournAbi.json');
let gateAbi = require('./ABIs/gateAbi.json');
let guildAbi = require('./ABIs/guildAbi.json');

// const web3 = new Web3(new Web3.providers.WebsocketProvider(`wss://mainnet.infura.io/ws/v3/${process.env.INFURA_KEY}`));

const web3 = new Web3(new Web3.providers.WebsocketProvider(`ws://localhost:${process.env.WS_PORT}`));


//////////////////////
// CONTRACT OBJECTS //
//////////////////////

const tournAddress = '0xDd903896AaCC543Abeef0dEeA9B2a27496f762aD';
const gateAddress = '0x673B537956a28e40aAA8D929Fd1B6688C1583dda';
const guildAddress = '0x35B7838dd7507aDA69610397A85310AE0abD5034';
const dualResolver = '0x1856A84019d982880607266526f13df232C15CFc';

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

let unknownCullers = [
	'0x78535daf506ef3a11c27a426bc4d8a2443e0b09c',
]

let chzXpress = {
	SWISS_CHEEZE_BANK: '0xED7392aF2263D1404d631E0f920c67EBbC9Cc7Fc',
	POOL_TOKEN: '0x521871fE28Ab18D7564611e3021e139f37452A43',
	CLEAN_THREE_AFFINITY_DUEL_RESOLVER: '0xeFf719cf36947368C148Cf70f6F16AC53464C410',
	CLEAN_TOURNAMENT: '0xdbc7dd6dF6bE0A4DbDa8953a415d29BC299cF73C',
	DEPLOYER: '0x5428E9d58194443293705F7A7cB84065D642297B',
}

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

const getAscWizId = async () => {
	try  {
		return await tournContract.methods.getAscendingWizardId().call();
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

///////////////////
// FUNCTION SIGS //
///////////////////

const tournSigs = {
    "88975198": "setCeo(address)",
    "128183ba": "GATE_KEEPER()",
    "c9eb068b": "WIZARD_GUILD()",
    "9a963fcd": "acceptAscensionChallenge(bytes32)",
    "840a1ff4": "cancelCommitment(uint256)",
    "0a0f8168": "ceoAddress()",
    "0519ce79": "cfoAddress()",
    "fb3790c5": "challengeAscending(uint256,bytes32)",
    "cc4db960": "claimSharedWinnings(uint256,uint256[])",
    "da0cb2ae": "claimTheBigCheeze(uint256)",
    "aedb27fc": "completeAscension()",
    "b047fb50": "cooAddress()",
    "0af29b96": "cullMoldedWithMolded(uint256[])",
    "cbe6549e": "cullMoldedWithSurvivor(uint256[],uint256)",
    "43d9922f": "cullTiredWizards(uint256[])",
    "83197ef0": "destroy()",
    "c51b58aa": "doubleCommit(uint256,uint256,bytes32,bytes32,bytes,bytes)",
    "7aa66a7c": "doubleReveal(uint256,uint256,bytes32,bytes32,bytes32,bytes32,bytes32,bytes32)",
    "810306b9": "duelResolver()",
    "b9d95abb": "enterWizards(uint256[],uint88[])",
    "bfd31c19": "getAscendingWizardId()",
    "079cfa79": "getBlueMoldParameters()",
    "9ce0c954": "getRemainingWizards()",
    "92420c90": "getTimeParameters()",
    "fac8eafc": "getWizard(uint256)",
    "170f8cc8": "giftPower(uint256,uint256)",
    "22f3e2d4": "isActive()",
    "b187bd26": "isPaused()",
    "50df8f71": "isReady(uint256)",
    "01d1c810": "oneSidedCommit(uint256,uint256,bytes32)",
    "cef9b488": "oneSidedReveal(uint256,bytes32,bytes32,bytes32,uint256,bytes32)",
    "136439dd": "pause(uint256)",
    "ad81e4d6": "powerScale()",
    "35a966f1": "resolveOneSidedAscensionBattle(uint256)",
    "feb62755": "resolveTimedOutDuel(uint256,uint256)",
    "8baecc21": "revive(uint256)",
    "2d46ed56": "setCfo(address)",
    "9986a0c6": "setCoo(address)",
    "58042deb": "startAscension(uint256)",
    "01ffc9a7": "supportsInterface(bytes4)",
    "5a453d40": "updateAffinity(uint256)",
    "3f976ca9": "wizardFingerprint(uint256)"
}

const gateSigs = {
    "88975198": "setCeo(address)",
    "c9eb068b": "WIZARD_GUILD()",
    "52a71ac9": "WIZARD_PRESALE()",
    "f4038ec7": "absorbPresaleWizards(uint256[])",
    "0a0f8168": "ceoAddress()",
    "0519ce79": "cfoAddress()",
    "0cff2fd0": "conjureExclusiveMulti(uint256[],uint256[],uint8[],address)",
    "573f322f": "conjureWizard(uint8)",
    "ce6991fd": "conjureWizardMulti(uint8[])",
    "b047fb50": "cooAddress()",
    "e5a604bf": "costToPower(uint256)",
    "83197ef0": "destroy()",
    "b95dbeb6": "destroyTournament()",
    "a60a9159": "getTournamentPowerScale()",
    "2b81860b": "powerToCost(uint88)",
    "9934d7c3": "registerTournament(address)",
    "8baecc21": "revive(uint256)",
    "98d7a414": "setAffinity(uint256,uint8)",
    "2d46ed56": "setCfo(address)",
    "9986a0c6": "setCoo(address)",
    "1e0197e2": "tournament()",
    "3ccfd60b": "withdraw()",
    "b83a0c44": "wizardCosts()"
}

const guildSigs = {
    "88975198": "setCeo(address)",
    "095ea7b3": "approve(address,uint256)",
    "70a08231": "balanceOf(address)",
    "0a0f8168": "ceoAddress()",
    "0519ce79": "cfoAddress()",
    "4094099a": "closeSeries()",
    "b047fb50": "cooAddress()",
    "081812fc": "getApproved(uint256)",
    "c5ffd6e1": "getNextWizardIndex()",
    "fac8eafc": "getWizard(uint256)",
    "e985e9c5": "isApprovedForAll(address,address)",
    "430c2081": "isApprovedOrOwner(address,uint256)",
    "9d158023": "mintReservedWizards(uint256[],uint88[],uint8[],address)",
    "55fdbeec": "mintWizards(uint88[],uint8[],address)",
    "4616c514": "openSeries(address,uint256)",
    "6352211e": "ownerOf(uint256)",
    "42842e0e": "safeTransferFrom(address,address,uint256)",
    "b88d4fde": "safeTransferFrom(address,address,uint256,bytes)",
    "98d7a414": "setAffinity(uint256,uint8)",
    "a22cb465": "setApprovalForAll(address,bool)",
    "2d46ed56": "setCfo(address)",
    "9986a0c6": "setCoo(address)",
    "2738ec3c": "setMetadata(uint256[],bytes32[])",
    "01ffc9a7": "supportsInterface(bytes4)",
    "23b872dd": "transferFrom(address,address,uint256)",
    "2f81b15d": "verifySignature(uint256,bytes32,bytes)",
    "a096d9f0": "verifySignatures(uint256,uint256,bytes32,bytes32,bytes,bytes)",
    "5938d97a": "wizardsById(uint256)"
}

//////////////////////
// FUNCTION PARSING //
//////////////////////

const checkSig = async (txData, sigObj) => {
	if (txData != '0x') {
		let sig = txData.substring(2, 10);
		let keys = Object.keys(sigObj);
		if (keys.includes(sig)) {
			return sigObj[sig];
		} else {
			return `unknown function signature ${sigObj[sig]}`;
		}
	} else {
		return '0x';
	}
}

////////////////////
// GENERAL EVENTS //
////////////////////

let pendingPath = '../data/txDataPending.json';
let logPath = '../data/txDataLog.json';
let txDataPending = [];
let txDataLog = [];

const subscription = web3.eth.subscribe('pendingTransactions')
	.on("data", async (tx) => {
		try {
	    let res = await getTx(tx);
			if (res.to === tournAddress) {
				handleTournPending(res);
			}
			if (res.to === gateAddress) {
				handleGatePending(res);
			}
			if (res.to === guildAddress) {
				handleGuildPending(res);
			}
		} catch (e) {
	    return e;
	  }
});

const tournLog = web3.eth.subscribe('logs', { address: tournAddress })
	.on("data", async (tx) => {
		try {
			handleTournLog(tx);
		} catch (e) {
			return e;
		}
});

const gateLog = web3.eth.subscribe('logs', { address: gateAddress })
	.on("data", async (tx) => {
		try {
			handleGateLog(tx);
		} catch (e) {
			return e;
		}
});

const guildLog = web3.eth.subscribe('logs', { address: guildAddress })
	.on("data", async (tx) => {
		try {
			handleGuildLog(tx);
		} catch (e) {
			return e;
		}
});

const writeTxData = (path, data) => {
	fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

//////////////////
// TOURN EVENTS //
//////////////////

const handleTournPending = async (obj) => {
	txDataPending.push(obj);
	let sig = await checkSig(obj.input, tournSigs);
	writeTxData(pendingPath, txDataPending);
	console.log('...');
	console.log(
		`Pending Tournament tx ${obj.hash.substring(0,8)}... detected from ${obj.from} calling ${sig}.`
	);
	console.log('...');
}

const handleTournLog = (obj) => {
	txDataLog.push(obj);
	writeTxData(logPath, txDataLog);
	console.log('...');
	console.log(
		`Confirmed Tournament tx ${obj.transactionHash.substring(0,8)}... mined in block ${obj.blockNumber}.`
	);
	console.log('...');
}

/////////////////
// GATE EVENTS //
/////////////////

const handleGatePending = async (obj) => {
	txDataPending.push(obj);
	let sig = await checkSig(obj.input, gateSigs);
	writeTxData(pendingPath, txDataPending);
	console.log('...');
	console.log(
		`Pending Gatekeeper tx ${obj.hash.substring(0,8)}... detected from ${obj.from} calling ${sig}.`
	);
	console.log('...');
}

const handleGateLog = (obj) => {
	txDataLog.push(obj);
	writeTxData(logPath, txDataLog);
	console.log('...');
	console.log(
		`Confirmed Gatekeeper tx ${obj.transactionHash.substring(0,8)}... mined in block ${obj.blockNumber}.`
	);
	console.log('...');
}


//////////////////
// GUILD EVENTS //
//////////////////

const handleGuildPending = async (obj) => {
	txDataPending.push(obj);
	let sig = await checkSig(obj.input, guildSigs);
	writeTxData(pendingPath, txDataPending);
	console.log('...');
	console.log(
		`Pending Guild tx ${obj.hash.substring(0,8)}... detected from ${obj.from} calling ${sig}.`
	);
	console.log('...');
}

const handleGuildLog = (obj) => {
	txDataLog.push(obj);
	writeTxData(logPath, txDataLog);
	console.log('...');
	console.log(
		`Confirmed Guild tx ${obj.transactionHash.substring(0,8)}... mined in block ${obj.blockNumber}.`
	);
	console.log('...');
}

/////////////////
// SEND RAW TX //
/////////////////

let privKey_01 = process.env.PRIV_KEY_01;
let privKey_02 = process.env.PRIV_KEY_01;
let from_01 = process.env.ADDRESS_FROM_01;
let from_02 = process.env.ADDRESS_FROM_02;
let defNonce = 0x0;
let defGasLimit = web3.utils.toHex(200000); //200k
let defGasPrice = web3.utils.toHex(1100000000); //1.1 gwei
let defVal = 0x0;

const formatTx = async (txCount, gasL, gasP, addFrom, addTo, val, data, key) => {
  let txData = {
    nonce: txCount,
    gasLimit: gasL,
    gasPrice: gasP,
		from: addFrom,
    to: addTo,
		value: val,
		data: data,
  }
	return sendSigned(key, txData)
}

const sendSigned = async (key, txData) => {
	let privKey = new Buffer.from(key, 'hex');
	let tx = new Tx(txData);
	tx.sign(privKey);
	let txFormated = '0x' + tx.serialize().toString('hex');
	try {
		console.log('Sending...', JSON.stringify(txData, null, 2));
  	return await web3.eth.sendSignedTransaction(txFormated);
	} catch(e) {
		return e;
	}
}


//formatTx('0x1', defGasLimit, defGasPrice, from_01, tournAddress, defVal, '0x22f3e2d4', privKey_01).then(console.log);


////////////////
// TIME LOGIC //
////////////////

const newBlocks = web3.eth.subscribe('newBlockHeaders')
	.on("data", async (block) => {
		try {
				calcCurrentWindow().then(console.log);
		} catch (e) {
	    return e;
	  }
	});

const calcCurrentWindow = async () => {
	let paused = await isGamePaused();
	let time = await getTimeParameters();
	let block = await getBlock();
	let mold = await calcCurrentMold(block);
	let ascention = await getAscensionInfo();

	let ascStart = Number(time[5]);
	let ascDur = Number(time[6]);
	let fightDur = Number(time[8]);
	let resDur = Number(time[10]);
	let cullDur = Number(time[12]);

	let sessionDur = ascDur + fightDur + resDur + cullDur;
	let running = block - ascStart;
	let sessionPassed = running % sessionDur;
	let windowLeft = 0;
	let currentWindow = "";

	if (sessionPassed <= ascDur) {
		windowLeft = ascDur - sessionPassed;
		currentWindow = "Ascention";
	}
	else if (sessionPassed <= ascDur + fightDur) {
		windowLeft = (ascDur + fightDur) - sessionPassed;
		currentWindow = "Fight";
	}
	else if (
		sessionPassed <= ascDur + fightDur + resDur
	) {
		windowLeft = (ascDur + fightDur + resDur) - sessionPassed;
		currentWindow = "Resolution";
	}
	else if (
		sessionPassed <= sessionDur
	) {
		windowLeft = sessionDur - sessionPassed;
		currentWindow = "Culling";
	}
	return logData(paused, block, time[0], currentWindow, windowLeft, mold.moldPwr, ascention);
}

/////////////
// LOGGING //
/////////////

const logData = (paused, block, pauseTime, currentWindow, windowLeft, mold, ascention) => {
	if (paused) {
		return `Block ${block}. Paused until block ${pauseTime}. Mold at ${mold} pwr. ${ascention}`;
	}
	else {
		return `Block ${block}. In ${currentWindow} for ${windowLeft} more blocks. Mold at ${mold} pwr. ${ascention}`;
	}
}

////////////////
// MOLD LOGIC //
////////////////

const calcCurrentMold = async (block) => {
	let mold = await getMoldParams();

	let moldBlocks = block - mold[0];
	let moldDoubles = Math.floor(moldBlocks / mold[2]);
	let moldLvl = {
		moldWei: mold[3] * 2**moldDoubles,
		moldPwr: 2**moldDoubles,
	}

	return (moldLvl);
}

/////////////////////
// ASCENTION LOGIC //
/////////////////////

const getAscensionInfo = async () => {
	let ascWiz = await getAscWizId();
	if (ascWiz != 0) {
		let challenger = await getBattleWiz(ascWiz);
		if (challenger.ascensionOpponent != 0) {
			return `Wizard ${ascWiz} is trying to ascend and challenged by Wizard ${challenger.ascensionOpponent}.`
		} else {
			return `Wizard ${ascWiz} is trying to ascend without a challenger.`
		}
	} else {
		return 'No wizards ascending.'
	}
}

const getAscensionDetails = async () => {
	let ascWiz = await getAscWizId();
	if (ascWiz != 0) {
		let battleWiz = await getBattleWiz(ascWiz);
		let guildWiz = await getGuildWiz(ascWiz);
		let chamberInfo = {
			wizId: ascWiz,
			power: battleWiz.power,
			affinity: battleWiz.affinity,
			owner: guildWiz.owner,
			opponent: battleWiz.opponent != undefined ? true : false,
		}
		return chamberInfo;
	}
}

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
