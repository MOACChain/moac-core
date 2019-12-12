/* Script to create a MOAC ASM MicroChain using three contracts in the input files.
 * 
 * Require:
 * 1. Valid account with enough moac to deploy the contracts;
 * 2. A running VNODE can connect and send Transaction to, need turn on personal in rpc api;
 --rpcapi "chain3,mc,net,vnode,personal,
 * 3. At least three SCSs, recommended 5;
 * 4. A VNODE used as proxy for the MicroChain, with VNODE settings in the vnodeconfig.json;
 * 5. Three contract files:
 *    VnodeProtocolBase.sol
 *    SubChainProtocolBase.sol
 *    SubChainBase.sol
 * 
 * Steps:
 * 1. Deploy the VNODE and SCS pool contracts;
 * 2. Create the MicroChain contract using VNODE and SCS pools;
 * 3. Register the VNODE, SCSs, then open MicroChain to get all the SCSs registered.
 *  
 * Further Readings:
 * This script generates a MicroChain with no DAPP on it.
 * To deploy the Dappbase and additional DAPP contracts on MicroChain
 * Check deployDappBase.js
 * To call the MicroChain functions and Dapp functions, please check 
 * 
 * For MicroChain related info, please check online documents:
 * English:
 * https://moac-docs.readthedocs.io/en/latest/subchain
 * 中文：
 * https://moacdocs-chn.readthedocs.io/zh_CN/latest/subchain
 * 
*/

const Chain3 = require('chain3');
const fs = require('fs');
const solc = require('solc');//only 0.4.24 version should be used, npm install solc@0.4.24

//===============Setup the Parameters==========================================

// need to have a valid account to use for contracts deployment
baseaddr = "";//keystore address
basepsd = "";//keystore password

// The known SCS on MOAC network
var scs=["",
         "",
         "",
        ]

// The VNODE benificial address, should be found in the vnodeconfig.json 
vnodeVia="";
vnodeConnectUrl="127.0.0.1:50062";//VNODE connection as parameter to use for VNODE protocol
var minScsRequired = 3; // Min number of SCSs in the MicroChain, recommended 3 or more

//===============Check the Blockchain connection===============================
// 
// Using local node or remote to send TX command
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

// Min balance of the baseaddr needs to be larger than these numbers if all SCSs need to be funded
// For example, if use 5 SCSs and 1 VNODE, the minimum balance is:
// + SCS deposit (10 mc) * SCS number (=5)
// + VNODE deposit (1 mc) * VNODE number (=1)
// + MicroChain deposit (10 mc)
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

//===============Step 1. Deploy required Mother Chain contracts=========================
// If you have all these contracts deployed earlier, you can skip this and go to Step 2.
// 
// vnode pool
// scs pool
// Deploy the VNODE pool contract to allow VNODE join as proxy to the microchain, 
var minVnodeDeposit = 1 ;// number of deposit required for the VNODE proxy to register, unit is mc

var basepath = '.';

var contractName = 'VnodeProtocolBase';
var solpath = basepath + '/' + contractName + '.sol';

contract = fs.readFileSync(solpath, 'utf8');

output = solc.compile(contract, 1);

abi = output.contracts[':' + contractName].interface;
bin = output.contracts[':' + contractName].bytecode;


var vnodeprotocolbaseContract = chain3.mc.contract(JSON.parse(abi));

var vnodeprotocolbase = vnodeprotocolbaseContract.new(
   minVnodeDeposit,
   {
     from: baseaddr, 
     data: '0x' + bin, 
     gas: '8000000'
   }
 );

console.log("VNODE protocol is being deployed at transaction HASH: " + vnodeprotocolbase.transactionHash);

// Deploy the MicroChain protocol pool to allow SCS join the pool to form the MicroChain 
var protocol = "POR";   //Name of the SCS pool, don't change
var minScsDeposit = 10 ;// SCS must pay more than this in the register function to get into the SCS pool
var _protocolType = 0 ; // type of the MicroChain protocol, don't change


contractName = 'SubChainProtocolBase';
solpath = basepath + '/' + contractName + '.sol';

contract = fs.readFileSync(solpath, 'utf8');

output = solc.compile(contract, 1);

abi = output.contracts[':' + contractName].interface;
bin = output.contracts[':' + contractName].bytecode;

var protocol = "POR";
var bmin = 3;

var subchainprotocolbaseContract = chain3.mc.contract(JSON.parse(abi));

var subchainprotocolbase = subchainprotocolbaseContract.new(
   protocol,
   minScsDeposit,
   _protocolType,
   {
     from: baseaddr, 
     data: '0x' + bin, 
     gas: '8000000'
   }
 );

console.log("SCS protocol is being deployed at transaction HASH: " + subchainprotocolbase.transactionHash);

// Check for the two POO contract deployments
var vnodePoolAddr = waitBlock(vnodeprotocolbase.transactionHash);
var scsPoolAddr = waitBlock(subchainprotocolbase.transactionHash);

vnodePool = vnodeprotocolbaseContract.at(vnodePoolAddr);
scsPool = subchainprotocolbaseContract.at(scsPoolAddr);

console.log("vnodeprotocolbase contract address:", vnodePool.address);
console.log("subchainprotocolbase contract address:", scsPool.address);
console.log("Please use the mined contract addresses in deploying the MicroChain contract!!!")


//===============Step 2. Use the deployed Contracts to start a MicroChain======

// Deploy the MicroChain contract to form a MicroChain with Atomic Swap of Token (ASM) function
var min = 1 ;           //Min SCSs required in the MicroChain, only 1,3,5,7 should be used`
var max = 11 ;          //Max SCSs needed in the MicroChain, Only 11, 21, 31, 51, 99
var thousandth = 1000 ; //Fixed, do not need change
var flushRound = 60 ;   //Number of MotherChain rounds, must between 40 and 500

// these address should be pass from Step 1. If you use previously deployed contract, then input the address here.
// var scsPoolAddr = vnodePool.address;
// var vnodePoolAddr = scsPool.address;

var tokensupply = 1000;// MicroChain token amount, used to exchange for native token, should 
var exchangerate = 100;// the exchange rate bewteen moac and MicroChain token.


var contractName = 'SubChainBase';

// Need to read both contract files to compile
var input = {
  '': fs.readFileSync(basepath + '/' +'ChainBaseASM.sol', 'utf8'),
  'SubChainProtocolBase.sol': fs.readFileSync(basepath + '/' +'SubChainProtocolBase.sol', 'utf8')
};

var output = solc.compile({sources: input}, 1);

abi = output.contracts[':' + contractName].interface;
bin = output.contracts[':' + contractName].bytecode;


var subchainbaseContract = chain3.mc.contract(JSON.parse(abi));

var microChain

// Need to use callback function, otherwise this process may halt under Windows.

deploy_subchainbase().then((data) => {
	var microChainAddr = data
	microChain = subchainbaseContract.at(microChainAddr);
	console.log(" **********  microChain Contract Address: " + microChainAddr );
	
	
	//===============Step 3. Use the deployed Contracts to start a MicroChain======

	// The deposit is required for each SCS to join the MicroChain
	var microChainDeposit = 10;

	if (checkBalance(microChainAddr, microChainDeposit) ){
	   console.log("continue...")
	}else{
	   // Add balance to microChainAddr for MicroChain running
	   console.log("Add funding to microChain!");
	   addMicroChainFund(microChainAddr, microChainDeposit)
	   waitBalance(microChain.address, microChainDeposit);
	}

	if (checkBalance(vnodeVia, minVnodeDeposit)) {
	  console.log("VNODE has enough balance continue...")
		// sendtx(baseaddr,vnodecontractaddr,num,data)
	}else{
	  // Add balance
	  console.log("Add funding to VNODE!");
	  sendtx(baseaddr,vnodeVia,minVnodeDeposit);
	  waitBalance(vnodeVia, minVnodeDeposit);
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

	vnoderegister(vnodePool, minVnodeDeposit, vnodeVia, vnodeConnectUrl)

	console.log("Registering SCS to the pool", scsPool.address);
	registerScsToPool(scsPool.address,minScsDeposit);

	// Check if the SCS pool have enough nodes registered
	while (true) {
		let count = scsPool.scsCount();
		if (count >= minScsRequired) {
		  console.log("registertopool has enough scs " + count);
		  break;
		}
		console.log("Waiting registertopool, current scs count=" + count);
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


	// Open the register for the SCSs to join the MicroChain
	registerOpen(microChain.address);
	while (true) {
		let count = microChain.nodeCount();
		if (count >= minScsRequired) {
		  console.log("registertopool has enough scs " + count);
		  break;
		}
		console.log("Waiting registertopool, current scs count=" + count);
		sleep(5000);
	}

	registerClose(microChain.address);
	sleep(5000);

	console.log("all Done!!!");

	
    
}, (error) => {  console.log("deploy chainbase error:" + error);});


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

// wait certain blocks for the contract to be mined
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

//Open the MicroChain register process
function registerOpen(subchainaddr)
{
  sendtx(baseaddr, subchainaddr, '0','0x5defc56c' );
}

//Close the MicroChain register process
function registerClose(subchainaddr)
{
  sendtx(baseaddr, subchainaddr, '0','0x69f3576f' );
}

// must do before flush
function addMicroChainFund(inaddr, num){
  sendtx(baseaddr, inaddr, num,'0xa2f09dfa')
}

// vnoderegister(viaAddress, 1, "127.0.0.1:50062")
// vnodeprotocolbase.vnodeCount()
// vnode - vnode contract object with register function, and address
// num - deposit for VNODE to join the VNODE pool
// data - VNODE register FUNCTION
function vnoderegister(vnode,num,via,ip){
  var data=vnode.register.getData(via.toLowerCase(),ip)
  sendtx(baseaddr,vnode.address,num,data)
}

function deploy_subchainbase() {
	return new Promise((resolve, reject) => {
		
		console.log("Start to deploy the chainbase");
		
		//console.log(' scsPoolAddr: ', scsPoolAddr, ' vnodePoolAddr: ', vnodePoolAddr, ' min: ', min, ' max: ', max, ' thousandth: ', thousandth, ' flushRound: ', flushRound, ' tokensupply: ', tokensupply, ' exchangerate: ', exchangerate, ' baseaddr: ', baseaddr); 
		
		var subchainbase = subchainbaseContract.new(
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
			   if (e!=null){console.log(' chainbase deploy error : ', e); reject(e); return}
			   console.log(' chainbase Contract address: ', contract.address, ' transactionHash: ', contract.transactionHash); 
			   if (typeof(contract.address)!='undefined'){ resolve(contract.address);}		   
		   }
		 );	
		
	})
}


