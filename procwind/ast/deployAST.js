/* Script to create a MOAC AST AppChain using three contracts in the input files.
 * 
 * Require:
 * 1. Valid account with enough moac to deploy the contracts;
 * 2. A running VNODE can connect and send Transaction to, need turn on personal in rpc api;
 --rpcapi "chain3,mc,net,vnode,personal,
 * 3. At least three SCSs, recommended 5;
 * 4. A VNODE used as proxy for the AppChain, with VNODE settings in the vnodeconfig.json;
 * 5. The contract files:
 *    erc20.sol
 *    VnodeProtocolBase.sol
 *    SubChainProtocolBase.sol
 *    ChainBaseAST.sol
 *
 * Steps:
 * 1. Deploy the ERC20 token, VNODE pool and SCS pool contracts, if user already ;
 * 2. Create the AppChain contract using erc20, VNODE and SCS pools;
 * 3. Register the VNODE, SCSs, then open AppChain to get all the SCSs registered.
 *  
 * This script generates a AppChain with no DAPP deployed.
 * To deploy the Dappbase and additional DAPP contracts on AppChain
 * please check online documents:
 * 
 * https://moacdocs-chn.readthedocs.io/zh_CN/latest/subchain/%E5%AD%90%E9%93%BE%E4%B8%9A%E5%8A%A1%E9%80%BB%E8%BE%91%E7%9A%84%E9%83%A8%E7%BD%B2.html
 * 
 * 
*/

const Chain3 = require('chain3');
const fs = require('fs');
const solc = require('solc');//only 0.4.24 or 0.4.26 version should be used, npm install solc@0.4.24

const utils = require('./deployUtils');
//===============Setup the Parameters==========================================

// need to have a valid account to use for contracts deployment
baseaddr = "";//keystore address
basepsd = "";//keystore password


// The known SCS on MOAC network
var scs=["",
         "",
         "",
        ]

// Choose the right DappBase contract 
// DappBasePublic.sol allows other users to deploy the Dapp on the AppChain
// DappBasePrivate.sol only allows the owner
var inDappFile;

// The VNODE benificial address, should be found in the vnodeconfig.json 
var VNODEVia="";

vnodeConnectUrl="127.0.0.1:50062";//VNODE connection as parameter to use for VNODE protocol
var minScsRequired = 3; // Min number of SCSs in the AppChain, recommended 3 or more

//===============Check the Blockchain connection===============================
// 
// Using local node or remote to send TX command
const vnodeUri = 'http://localhost:8545';
const scsUri = 'http://localhost:8548';


let chain3 = new Chain3();
chain3.setProvider(new chain3.providers.HttpProvider(vnodeUri));

if(!chain3.isConnected()){
    throw new Error('unable to connect to moac vnode at ' + vnodeUri);
}else{
    console.log('connected to moac vnode at ' + vnodeUri);
    let balance = chain3.mc.getBalance(baseaddr);
    console.log('Check src account balance:' + baseaddr + ' has ' + balance*1e-18 + " MC");
}

//Setup the SCS monitor of the AppChain
chain3.setScsProvider(new chain3.providers.HttpProvider(scsUri));

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

//===============Step 1. Deploy required Mother Chain contracts=========================
// If you have all these contracts deployed earlier, you can skip this and go to Step 2.
// 1.1 ERC20
// 1.2 vnode pool
// 1.3 scs pool

// 1.1 Deploy the ERC20 contract with precompiled name as "AST COIN", supply with 10000000
var basepath = '.';
var contractName = 'erc20';
var solpath = basepath + '/' + contractName + '.sol';

var contract = fs.readFileSync(solpath, 'utf8');
var output = solc.compile(contract, 1);

//Choose the right variable name
abi = output.contracts[':TestCoin'].interface;
bin = output.contracts[':TestCoin'].bytecode;

// Notice the parameters of this contract is defined in the erc20.sol
// User can change these to other values
// string public name = "AST Coin";
// string public symbol = "AST";
// uint public decimals = 6;
// uint public INITIAL_SUPPLY = 100000000 * (10 ** decimals);

var testcoinContract = chain3.mc.contract(JSON.parse(abi));


var testcoin = testcoinContract.new(
   {
     from: baseaddr, 
     data: '0x' + bin, 
     gas: '8000000'
   }
 );

console.log("ERC20 is being deployed at transaction HASH: " + testcoin.transactionHash);

//ERC20 ADDRESS ON 106
//0xc7d3c72d6a6a91f65f4d086485e94da280b1e10d

// Deploy the VNODE pool contract to allow VNODE join as proxy to the microchain, 
var minVnodeDeposit = 1 ;// number of deposit required for the VNODE proxy to register, unit is mc

contractName = 'VNODEProtocolBase';
solpath = basepath + '/' + contractName + '.sol';

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

// Deploy the AppChain protocol pool to allow SCS join the pool to form the AppChain 
var protocol = "POR";   //Name of the SCS pool, don't change
var minScsDeposit = 10 ;// SCS must pay more than this in the register function to get into the SCS pool
var _protocolType = 0 ; // type of the AppChain protocol, don't change


contractName = 'SCSProtocolBase';
solpath = basepath + '/' + contractName + '.sol';

contract = fs.readFileSync(solpath, 'utf8');

output = solc.compile(contract, 1);

abi = output.contracts[':' + contractName].interface;
bin = output.contracts[':' + contractName].bytecode;

var protocol = "POR";
var bmin = 3;

var scsprotocolbaseContract = chain3.mc.contract(JSON.parse(abi));

var subchainprotocolbase = scsprotocolbaseContract.new(
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

// Check for all three contract deployments
var erc20Addr = waitBlock(testcoin.transactionHash);
var vnodePoolAddr = waitBlock(vnodeprotocolbase.transactionHash);
var scsPoolAddr = waitBlock(subchainprotocolbase.transactionHash);

erc20Contract = testcoinContract.at(erc20Addr);
vnodePool = vnodeprotocolbaseContract.at(vnodePoolAddr);
scsPool = scsprotocolbaseContract.at(scsPoolAddr);

console.log("ERC20 contract address:", erc20Contract.address);
console.log("vnodepoolbase contract address:", vnodePool.address);
console.log("scspoolbase contract address:", scsPool.address);
console.log("Please use the mined contract addresses in deploying the AppChain contract!!!")
//===============Step 2. Use the deployed Contracts to start a AppChain======

// Deploy the AppChain contract to form a AppChain with Atomic Swap of Token (AST) function
var ercRate = 1 ;       //Exchange rate between ERC20 token and AppChain native token, must be int large than 1
var min = 1 ;           //Min SCSs required in the AppChain, only 1,3,5,7 should be used`
var max = 11 ;          //Max SCSs needed in the AppChain, Only 11, 21, 31, 51, 99
var thousandth = 1000 ; //Fixed, do not need change
var flushRound = 60 ;   //Number of MotherChain rounds, must between 40 and 500

// these address should be pass from Step 1. If you use previously deployed contract, then input the address here.
// var erc20Addr = erc20Contract.address;
// var scsPoolAddr = vnodePool.address;
// var vnodePoolAddr = scsPool.address;

var contractName = 'ChainBaseAST';

// Need to read both contract files to compile
var input = {
  '': fs.readFileSync(basepath + '/' +'ChainBaseAST.sol', 'utf8'),
  'SCSProtocolBase.sol': fs.readFileSync(basepath + '/' +'SCSProtocolBase.sol', 'utf8')
};

output = solc.compile({sources: input}, 1);

abi = output.contracts[':' + contractName].interface;
bin = output.contracts[':' + contractName].bytecode;


var subchainbaseContract = chain3.mc.contract(JSON.parse(abi));

var appChain

deploy_subchainbase().then((data) => {
	var appChainAddr = data
	appChain = subchainbaseContract.at(appChainAddr);
	console.log(" **********  appChain Contract Address: " + appChainAddr );
	
	
	//===============Step 3. Use the deployed Contracts to start a AppChain======

	// The deposit is required for each SCS to join the AppChain
	var appChainDeposit = 10;

	if (checkBalance(appChainAddr, appChainDeposit) ){
	   console.log("continue...")
	}else{
	   // Add balance to appChainAddr for AppChain running
	   console.log("Add funding to appChain!  appChain:", appChain.address);
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


	// Open the register for the SCSs to join the AppChain
	registerOpen(appChain.address);
	while (true) {
		let count = appChain.nodeCount();
		if (count >= minScsRequired) {
		  console.log("registertopool has enough scs " + count);
		  break;
		}
		console.log("Waiting registertopool, current scs count=" + count);
		sleep(5000);
	}

	registerClose(appChain.address);
	sleep(5000);

  //===============Step 4. Deploy the DappBase contract at the AppChain======
    console.log("AppChain is ready, prepare to deploy:", inDappFile, " on ", appChain.address);
    // Deploy the DappBase contract to enable the Dapp deployment on the AppChain
    // solc 0.4.24 and 0.4.26 version
    var content = fs.readFileSync(inDappFile, 'utf8');

    output = solc.compile(content, 1);

    var key = Object.keys(output.contracts);

    //this is the object contains the code and ABIs
    var ctt = output.contracts[key];

    if(ctt == null){
      console.log("Contract CTT is empty1");
      return;
    }

    var bytecode = "0x"+ctt.bytecode;
    var mcabi = JSON.parse(ctt.interface);


    // Prepare and Send TX to VNODE to deploy the DAPP on the AppChain;
    //Deploy the DappBase with correct parameters
    var inNonce = chain3.scs.getNonce(appChain.address,baseaddr);

    console.log("Src nonce:", inNonce, " ProcWind AppChain TokenSupply", tokensupply);

    var mchash = sendshardingflagtx(baseaddr,basepsd,appChain.address,SCSVia, tokensupply, bytecode,inNonce,'0x3')
    console.log("dappbase TX HASH:", mchash);

    // Check the DAPP status after deploy, need to wait for several blocks
    // If successful, you should see the new DAPP address
    waitForAppChainBlocks(appChain.address,5);

    console.log("Should see DAPP list on :",appChain.address, "\n at: ", chain3.scs.getDappAddrList(appChain.address));

  console.log("all Done!!!");

  
	
}, (error) => {  console.log("deploy ChainBaseAST error:" + error);});


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

// Send the TX to VNODE with unlocked account
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

// Get the receipt from one block generated.
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

// Check and make sure the balance.
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
// vnodeprotocolbase.vnodeCount()
// vnode - vnode contract object with register function, and address
// num - deposit for VNODE to join the VNODE pool
// data - VNODE register FUNCTION
function vnoderegister(vnode,num,vnodetoadd,ip){
  var data=vnode.register.getData(vnodetoadd,ip)
  console.log("Registering VNODE ......")
  sendtx(baseaddr,vnode.address,num,data)
}


function deploy_subchainbase() {
	return new Promise((resolve, reject) => {
		
		console.log("Start to deploy the chainbase");
		
		console.log(' chainbase scsPoolAddr: ', scsPoolAddr, ' vnodePoolAddr: ', vnodePoolAddr, ' min: ', min, ' max: ', max, ' thousandth: ', thousandth, ' flushRound: ', flushRound, ' erc20Addr: ', erc20Addr, ' ercRate: ', ercRate, ' baseaddr: ', baseaddr); 
		
		var subchainbase = subchainbaseContract.new(
		   scsPoolAddr,
		   vnodePoolAddr,
		   erc20Addr,
		   ercRate,
		   min,
		   max,
		   thousandth,
		   flushRound,
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


