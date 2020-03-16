/* Script to create a MOAC ASM AppChain using three contracts in the input files.
 * Only works with solidity 0.4.24 and solidity 0.4.26.
 * 
 * Require:
 * 1. Valid account with enough moac to deploy the contracts;
 * 2. A running VNODE can connect and send Transaction to, need turn on personal in rpc api;
 --rpcapi "chain3,mc,net,vnode,personal,
 * 3. At least three SCSs, recommended 5;
 * 4. A VNODE used as proxy for the AppChain, with VNODE settings in the vnodeconfig.json;
 * 5. Three contract files:
 *    VnodeProtocolBase.sol
 *    SCSProtocolBase.sol
 *    ChainBaseASM.sol
 * 
 * Steps:
 * 1. Deploy the VNODE and SCS pool contracts, if using the existing pools, need to obtain
 *    existing pool's address;
 * 2. Deploy the AppChain contract using VNODE and SCS pool contract addresses;
 * 3. Register the VNODE, SCSs, then open AppChain to get all the SCSs registered.
 * 4. Closed the registration and started the AppChain.
 *  
 * Further Readings:
 * This script generates a AppChain with DAPPBase on it.
 * To deploy DAPP contracts on AppChain, check deployDappBase.js
 * To call the AppChain functions and Dapp functions, please check callDappExample.js.
 * 
 * For AppChain related info, please check online documents:
 * English:
 * https://moac-docs.readthedocs.io/en/latest
 * 中文：
 * https://moacdocs-chn.readthedocs.io/zh_CN/latest
 * 
*/


// only 0.4.24 or 0.4.26 version should be used, 
// To install a certain version of solc: npm install solc@0.4.24
const solc = require('solc');
const Chain3 = require('chain3');// 0.1.22 version only
const fs = require('fs');

//===============Setup the Parameters==========================================

// need to have a valid account to use for contracts deployment
var baseaddr = "";//keystore address
var basepsd = "";//keystore password

// The known SCS on MOAC network
var scs=["",
         "",
         "",
        ]


var VNODEVia="";// The VNODE benificial address, should be found in the vnodeconfig.json 
var vnodeConnectUrl="127.0.0.1:50062";//VNODE connection as parameter to use for VNODE pool protocol
var minScsRequired = 3; // Min number of SCSs in the AppChain, recommended 3 or more

//===============Check the Blockchain connection===============================
// 
// Using local node or remote VNODE server to send TX command
const vnodeUri = 'http://localhost:8545';

let chain3 = new Chain3();
chain3.setProvider(new chain3.providers.HttpProvider(vnodeUri));

if(!chain3.isConnected()){
    throw new Error('unable to connect to moac vnode at ' + vnodeUri);
}else{
    console.log('connected to moac vnode at ' + vnodeUri);
    let balance = chain3.mc.getBalance(baseaddr);
    console.log('Check src account balance:' + baseaddr + ' has ' + balance*1e-18 + " MC");
}

// For deploy the DappBase, this should be the SCS that will be included in the AppChain
chain3.setScsProvider(new chain3.providers.HttpProvider('http://localhost:8548'));

// check the connecting with SCS
if (!chain3.isScsConnected()){
    console.log("Chain3 RPC is not connected on SCS!");
    return;
}

// Min balance of the baseaddr needs to be larger than these numbers if all SCSs need to be funded
// For example, if use 5 SCSs and 1 VNODE, the minimum balance is:
// + SCS deposit (10 mc) * SCS number (=5)
// + VNODE deposit (1 mc) * VNODE number (=1)
// + AppChain deposit (10 mc)
// = 50 + 1+ 10 = 61
if (!checkBalance(baseaddr, 61) ){
  console.log("Need more balance in baseaddr")
  return;
}else{
  console.log("baseaddr has enough balance!")
}

// Unlock the baseaddr for contract deployment

if (chain3.personal.unlockAccount(baseaddr, basepsd, 0)) {
    console.log(`${baseaddr} is unlocked`);
}else{
    console.log(`unlock failed, ${baseaddr}`);
    throw new Error('unlock failed ' + baseaddr);
}

//===============Step 1. Deploy required Base Chain contracts=========================
// If you have all these contracts deployed earlier, you can skip this and go to Step 2.
// 
// vnode pool
// scs pool
// Deploy the VNODE pool contract to allow VNODE join as proxy to the microchain, 
var minVnodeDeposit = 1 ;// number of deposit required for the VNODE proxy to register, unit is mc

var basepath = '.';

var contractName = 'VNODEProtocolBase';
var solpath = basepath + '/' + contractName + '.sol';

console.log("Read path:", solpath)
contract = fs.readFileSync(solpath, 'utf8');

output = solc.compile(contract, 1);

abi = output.contracts[':' + contractName].interface;
bin = output.contracts[':' + contractName].bytecode;


var vnodepoolbaseContract = chain3.mc.contract(JSON.parse(abi));

var vnodepoolbase = vnodepoolbaseContract.new(
   minVnodeDeposit,
   {
     from: baseaddr, 
     data: '0x' + bin, 
     gas: '8000000'
   }
 );

console.log("VNODE protocol is being deployed at transaction HASH: " + vnodepoolbase.transactionHash);

// Deploy the AppChain protocol pool to allow SCS join the pool to form the AppChain 
var protocol = "POR";   //Name of the SCS pool, don't change
var minScsDeposit = 10 ;// SCS must pay more than this in the register function to get into the SCS pool
var _protocolType = 0 ; // type of the AppChain protocol, don't change


contractName = 'SCSProtocolBase';
solpath = basepath + '/' + contractName + '.sol';

console.log("Read path:", solpath)
contract = fs.readFileSync(solpath, 'utf8');

output = solc.compile(contract, 1);

abi = output.contracts[':' + contractName].interface;
bin = output.contracts[':' + contractName].bytecode;

var bmin = 3;

var scspoolContract = chain3.mc.contract(JSON.parse(abi));

var scspoolbase = scspoolContract.new(
   protocol,
   minScsDeposit,
   _protocolType,
   {
     from: baseaddr, 
     data: '0x' + bin, 
     gas: '8000000'
   }
 );

console.log("SCS protocol is being deployed at transaction HASH: " + scspoolbase.transactionHash);

// Check for the two POO contract deployments
var vnodePoolAddr = waitBlock(vnodepoolbase.transactionHash);
var scsPoolAddr = waitBlock(scspoolbase.transactionHash);

vnodePool = vnodepoolbaseContract.at(vnodePoolAddr);
scsPool = scspoolContract.at(scsPoolAddr);

console.log("VNODE pool contract address:", vnodePool.address);
console.log("SCS pool contract address:", scsPool.address);
console.log("Please use the mined contract addresses in deploying the AppChain contract!!!")


//===============Step 2. Use the deployed Contracts to start a AppChain======

// Deploy the AppChain contract to form a AppChain with Atomic Swap of Token (ASM) function
var min = 1 ;           //Min SCSs required in the AppChain, only 1,3,5,7 should be used`
var max = 11 ;          //Max SCSs needed in the AppChain, Only 11, 21, 31, 51, 99
var thousandth = 1000 ; //Fixed, do not need change
var flushRound = 60 ;   //Number of MotherChain rounds, must between 40 and 500

// these address should be pass from Step 1. If you use previously deployed contract, then input the address here.
// var scsPoolAddr = vnodePool.address;
// var vnodePoolAddr = scsPool.address;

var tokensupply = 996;// AppChain token amount, used to exchange for native token, should 
var exchangerate = 10;// the exchange rate bewteen moac and AppChain token.

var contractName = 'ChainBaseASM';

// Need to read both contract files to compile
var input = {
  '': fs.readFileSync(basepath + '/' +'ChainBaseASM.sol', 'utf8'),
  'SCSProtocolBase.sol': fs.readFileSync(basepath + '/' +'SCSProtocolBase.sol', 'utf8')
};

// For deploy the AppChain contract, need to optimize the output size of the contract
// need to set to 1
// Before you deploy your contract, activate the optimizer while compiling using 
// solc --optimize --bin sourceFile.sol. 
// By default, the optimizer will optimize the contract for 200 runs. 
// If you want to optimize for initial contract deployment and get the smallest output, 
// set it to --runs=1. 
var output = solc.compile({sources: input}, 1);

abi = output.contracts[':' + contractName].interface;
bin = output.contracts[':' + contractName].bytecode;


var appchainASMContract = chain3.mc.contract(JSON.parse(abi));

var appChain;

// Need to use callback function, otherwise this process may halt under Windows.

deploy_chainbase().then((data) => {
	var appChainAddr = data
	appChain = appchainASMContract.at(appChainAddr);
	console.log(" **********  appChain Contract Address: " + appChainAddr );
	
	
	//===============Step 3. Use the deployed Contracts to start a AppChain======

	// The deposit is required for each SCS to join the AppChain
	var appChainDeposit = 10;

	if (checkBalance(appChainAddr, appChainDeposit) ){
	   console.log("continue...")
	}else{
	   // Add balance to appChainAddr for AppChain running
	   console.log("Add funding to AppChain!");
	   addMicroChainFund(appChainAddr, appChainDeposit)
	   waitBalance(appChain.address, appChainDeposit);
	}

	if (checkBalance(VNODEVia, minVnodeDeposit)) {
	  console.log("VNODE has enough balance continue...")
		// sendtx(baseaddr,vnodecontractaddr,num,data)
	}else{
	  // Add balance
	  console.log("Add funding to VNODE!");
	  sendtx(baseaddr,VNODEVia,minVnodeDeposit);
	  waitBalance(VNODEVia, minVnodeDeposit);
	}


	// Check to make sure all SCSs have enough balance than the min deposit required by 
	// SCS pool
	for (var i = 0; i < scs.length; i++) {
	  if (checkBalance(scs[i], minScsDeposit)) {
		console.log("SCS has enough balance, continue...")
	  }else{
		// Add balance
		console.log("Add funding to SCS!");
		sendtx(baseaddr,scs[i],minScsDeposit);
		waitBalance(scs[i], minScsDeposit);
	  }
	}

	vnoderegister(vnodePool, minVnodeDeposit, VNODEVia, vnodeConnectUrl)

	console.log("Registering SCS to the pool", scsPool.address);
	registerScsToPool(scsPool.address,minScsDeposit);

	// Check if the SCS pool have enough nodes registered
	while (true) {
		let count = scsPool.scsCount();
		if (count >= minScsRequired) {
		  console.log("registertopool has enough SCS " + count);
		  break;
		}
		console.log("Waiting registertopool, current SCS count=" + count);
		sleep(5000);
	}

	// Check the blocks
	let startnum = chain3.mc.blockNumber;
	while (true) {
		let number = chain3.mc.blockNumber;
		if (number > startnum + 5) {
		  console.log("reached target block number " + number);
		  break;
		}
		console.log("Waiting block number, current block number=" + number);
		sleep(8000);
	}


	// Open the register for the SCSs to join the AppChain
	registerOpen(appChain.address);
	while (true) {
		let count = appChain.nodeCount();
		if (count >= minScsRequired) {
		  console.log("registered SCS pool has enough SCS " + count);
		  break;
		}
		console.log("Waiting more SCSs to register to the pool, current SCS count=" + count);
		sleep(5000);
	}

	registerClose(appChain.address);
	sleep(5000);

	console.log("all Done!!!");

	
    
}, (error) => {  console.log("deploy ChainBaseASM error:" + error);});


//===============Utils Functions===============================================
// utils for the program
// Check if the input address has enough balance for the mc amount
function checkBalance(inaddr, inMcAmt) {
  if ( chain3.mc.getBalance(inaddr)/1e18 >= inMcAmt ){
    return true;
  }else{
    return false;
  }
}

function sendtx(src, tgtaddr, amount, strData) {

  chain3.mc.sendTransaction(
    {
      from: src,
      value:chain3.toSha(amount,'mc'),
      to: tgtaddr,
      gas: "2000000",
      gasPrice: chain3.mc.gasPrice,
      data: strData
    });
    
  console.log('sending from:' +   src + ' to:' + tgtaddr  + ' amount:' + amount + ' with data:' + strData);
}

// wait certain blocks on the BaseChain for the contract to be mined
function waitForBlocks(innum) {
  let startBlk = chain3.mc.blockNumber;
  let preBlk = startBlk;
  console.log("Waiting for blocks to confirm the contract... currently in block " + startBlk);
  while (true) {
    let curblk = chain3.mc.blockNumber;
    if (curblk > startBlk + innum) {
      console.log("Waited for " + innum + " blocks!");
      break;
    }
    if ( curblk > preBlk){
      console.log("Waiting for blocks to confirm the contract... currently in block " + curblk);
      preBlk = curblk;
    }else{
        console.log("...");
    }
    
    sleep(2000000);
  }
}

// wait one block on the BaseChain for the hash and return the receipt
function waitBlock(transactionHash) {
  console.log("Waiting a mined block to include your contract...");
  
  while (true) {
    let receipt = chain3.mc.getTransactionReceipt(transactionHash);
    if (receipt && receipt.contractAddress) {
      console.log("contract has been deployed at " + receipt.contractAddress);
      break;
    }
    console.log("block " + chain3.mc.blockNumber + "...");
    sleep(50000);
  }
  return chain3.mc.getTransactionReceipt(transactionHash).contractAddress;
}

// Wait until the account has enough balance
function waitBalance(addr, target) {
    while (true) {
        let balance = chain3.mc.getBalance(addr)/1000000000000000000;
        if (balance >= target) {
          console.log("account has enough balance " + balance);
          break;
        }
        console.log("Waiting the account has enough balance " + balance);
        sleep(5000);
    }
  }

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
}


//===============Utils TX to MicroChains=======================================

function registerScsToPool(proto, num){
  if ( num >= minScsDeposit){
    for( var i = 0;i<scs.length;i++){
      sendtx(baseaddr, proto, num,'0x4420e486000000000000000000000000' + scs[i].substr(2, 100));
    }
  }else{
    console.log("Cannot register SCSs with not enough deposit!", num);
  }

}

//Open the AppChain register process
function registerOpen(subchainaddr)
{
  sendtx(baseaddr, subchainaddr, '0','0x5defc56c' );
}

//Close the AppChain register process
function registerClose(subchainaddr)
{
  sendtx(baseaddr, subchainaddr, '0','0x69f3576f' );
}

// must do before flush
function addMicroChainFund(inaddr, num){
  sendtx(baseaddr, inaddr, num,'0xa2f09dfa')
}

// vnoderegister(viaAddress, 1, "127.0.0.1:50062")
// vnodepoolbase.vnodeCount()
// vnode - vnode contract object with register function, and address
// num - deposit for VNODE to join the VNODE pool
// data - VNODE register FUNCTION
function vnoderegister(vnode,num,via,ip){
  // call the register method in VNODEProtocolBasel.sol
  var data=vnode.register.getData(via.toLowerCase(),ip,'')
  sendtx(baseaddr,vnode.address,num,data)
}

//
function deploy_chainbase() {
	return new Promise((resolve, reject) => {
		
		console.log("Start to deploy the ProcWind AppChain contract");
		
		//console.log(' scsPoolAddr: ', scsPoolAddr, ' vnodePoolAddr: ', vnodePoolAddr, ' min: ', min, ' max: ', max, ' thousandth: ', thousandth, ' flushRound: ', flushRound, ' tokensupply: ', tokensupply, ' exchangerate: ', exchangerate, ' baseaddr: ', baseaddr); 
		
		var subchainbase = appchainASMContract.new(
		   scsPoolAddr,
		   vnodePoolAddr,
		   min,
		   max,
		   thousandth,
		   flushRound,
		   tokensupply,
		   exchangerate,
		   {
			 from: baseaddr, 
			 data: '0x' + bin,
			 gas: '9000000'
		   }, 
		   function (e, contract){
			   if (e!=null){console.log(' AppChain contract deploy error : ', e); reject(e); return}
			   console.log(' chainbase Contract transactionHash: ', contract.transactionHash); 
			   if (typeof(contract.address)!='undefined'){ resolve(contract.address);}		   
		   }
		 );	
		
	})
}

// Functions to use in the process
// Send TX with unlock account and Sharding Flag set
function sendshardingflagtx(baseaddr,basepsd, subchainaddr, via, amount,code,n,sf)
{
    chain3.personal.unlockAccount(baseaddr,basepsd);
    txhash = chain3.mc.sendTransaction(
        {
            from: baseaddr,
            value:chain3.toSha(amount,'mc'),
            to: subchainaddr,
            gas: "0",
            gasPrice: chain3.mc.gasPrice,
            shardingFlag: sf,
            data: code,
            nonce: n,
            via: via,
        });
    return txhash;
}

// Wait for results to come
function waitForAppChainBlocks(inMcAddr, innum) {
  let startBlk = chain3.scs.getBlockNumber(inMcAddr);
  let preBlk = 0;
  // Incase the return is not valid, use 0 instead of NAN
  if ( startBlk > 0 ){
    preBlk = startBlk;
  }else{
        startBlk = 0;
  }

  console.log("Waiting for blocks to confirm the TX... currently at block " + startBlk);
  while (true) {
    let curblk = chain3.scs.getBlockNumber(inMcAddr);
    if (curblk > startBlk + innum) {
      console.log("Waited for " + innum + " blocks!");
      break;
    }
    if ( curblk > preBlk){
      console.log("Waiting for blocks to confirm the TX... currently at block " + curblk);
      preBlk = curblk;
    }else{
        console.log("...");
    }
    
    sleep(3000000);
  }
}


