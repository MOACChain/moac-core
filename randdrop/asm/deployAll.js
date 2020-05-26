/* Script to create a MOAC ASM AppChain using precompiled contracts.
 * 
 * Require:
 * 1. Valid account with enough moac to deploy the contracts;
 * 2. A running VNODE can connect and send Transaction to, need turn on personal in rpc api;
 --rpcapi "chain3,mc,net,vnode,personal,
 * 3. At least three SCSs, recommended 5;
 * 4. A VNODE used as proxy for the AppChain, with VNODE settings in the vnodeconfig.json;
 * 5. Two JS files with precompiled contracts information: mcABIs.js and mcByteCodes.js;
 * 
 * Steps:
 * 1. Deploy the pre requied contracts, include the VNODE pool, SCS pool, and  
 *    VSS contracts. If using the existing pools, need to obtain
 *    existing pool's address;
 * 2. Deploy the AppChain contract using VNODE and SCS pool contract addresses;
 * 3. Register the VNODE, SCSs, then open AppChain to get all the SCSs registered;
 * 4. Open the SCS pool to get enough SCSs and then close the registration to start the AppChain;
 * 5. 
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


const Chain3 = require('chain3');
const fs = require('fs');
// Use precompiled codes to deploy the AppChain
const ABIs = require('./mcABIs');
const ByteCodes = require('./mcByteCodes');

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

// For deploy the DappBase, this should be the SCS that will be included in the AppChain
chain3.setScsProvider(new chain3.providers.HttpProvider('http://localhost:8548'));

// check the connecting with SCS
if (!chain3.isScsConnected()){
    console.log("Chain3 RPC is not connected on SCS!");
    return;
}

// Unlock the baseaddr for contract deployment

if (chain3.personal.unlockAccount(baseaddr, basepsd, 0)) {
    console.log(`${baseaddr} is unlocked`);
}else{
    console.log(`unlock failed, ${baseaddr}`);
    throw new Error('unlock failed ' + baseaddr);
}

//===============Step 1. Deploy required contracts=========================
// If you have all these contracts deployed earlier, you can skip this and go to Step 2.
// There are 3 contracts for RandDrop AppChain:
// vnode pool
// scs pool
// vssbase

// 1.1 Deploy the VNODE pool contract to allow VNODE join as proxy to the microchain
var minVnodeDeposit = 1/* var of type uint256 here, number of deposit required for the VNODE proxy to register, unit is mc*/ ;

var vnodepoolbaseContract = chain3.mc.contract(JSON.parse(ABIs.vnodePool));
var vnodepoolbase = vnodepoolbaseContract.new(
   minVnodeDeposit,
   {
     from: baseaddr, 
     data: ByteCodes.vnodePool, 
     gas: '4700000'
   })

console.log("VNODE protocol is being deployed at transaction HASH: " + vnodepoolbase.transactionHash);

// 1.2 Deploy the SCS protocol pool contract to allow SCS join the pool to form the AppChain 
// precompiled contract
// Deploy the AppChain protocol pool to allow SCS join the pool to form the AppChain 
var protocol = "bls";   //Name of the SCS pool, don't change
var minScsDeposit = 5 ;// SCS must pay more than this in the register function to get into the SCS pool
var _protocolType = 3 ; // type of the AppChain protocol, don't change

var scspoolbaseContract = chain3.mc.contract(JSON.parse(ABIs.scsPool));

var scspoolbase = scspoolbaseContract.new(
   protocol,
   minScsDeposit,
   _protocolType,
   {
     from: baseaddr, 
     data: ByteCodes.scsPool, 
     gas: '4700000'
   })

console.log("SCS protocol is being deployed at transaction HASH: " + scspoolbase.transactionHash);

// 1.3 Deploy the VSS contract to be called by the RandDrop AppChain 
var threshold = 3/* var of type int256 here,  */ ;

// deploy the precompiled code
var vssbaseContract = chain3.mc.contract(JSON.parse(ABIs.vss));
var vssbase = vssbaseContract.new(
   threshold,
   {
     from: baseaddr, 
     data: ByteCodes.vss,
     gas: '5700000'
   }
 )

console.log("VSS contract is being deployed at transaction HASH: " + vssbase.transactionHash);

// Check for the two POO contract deployments
var vnodePoolAddr = waitBlock(vnodepoolbase.transactionHash);
var scsPoolAddr = waitBlock(scspoolbase.transactionHash);
var vssAddr = waitBlock(vssbase.transactionHash);


vnodePool = vnodepoolbaseContract.at(vnodePoolAddr);
scsPool = scspoolbaseContract.at(scsPoolAddr);
vss = vssbaseContract.at(vssAddr);

console.log("VNODE pool contract address:", vnodePool.address);
console.log("SCS pool contract address:", scsPool.address);
console.log("VSS contract address:", vss.address);
console.log("Please use the mined contract addresses in deploying the RandDrop AppChain!!!")


//===============Step 2. Use the deployed Contracts to start a AppChain======

// Deploy the AppChain contract to form a AppChain with Atomic Swap of Token (ASM) function
var min = 1 ;           //Min SCSs required in the AppChain, only 1,3,5,7 should be used`
var max = 11 ;          //Max SCSs needed in the AppChain, Only 11, 21, 31, 51, 99
var thousandth = 1000 ; //Fixed, do not need change
var flushRound = 60 ;   //Number of MotherChain rounds, must between 40 and 500

// these address should be pass from Step 1. If you use previously deployed contract, then input the address here.
// var scsPoolAddr = vnodePool.address;
// var vnodePoolAddr = scsPool.address;
// var vssAddr =  vss.address;

var tokensupply = 996;// AppChain token amount, used to exchange for native token, should 
var exchangerate = 10;// the exchange rate bewteen moac and AppChain token.

// For deploy the AppChain contract, need to optimize the output size of the contract
// need to set to 1
var appchainASMContract = chain3.mc.contract(JSON.parse(ABIs.randdropAsm));
var appChain;

// Need to use callback function, otherwise this process may halt under Windows.

deploy_randdrop(  
   scsPoolAddr,
   vnodePoolAddr,
   min,
   max,
   thousandth,
   flushRound,
   tokensupply,
   exchangerate,
   vssAddr, 
   baseaddr).then((data) => {

	var appChainAddr = data
	appChain = appchainASMContract.at(appChainAddr);
	console.log(" **********  appChain Contract Address: " + appChainAddr );
	
	
  //setCaller(subchain)
  var setCallerData=vss.setCaller.getData(appChainAddr);
  console.log("Setup the RandDrop Appchain as VSS caller:", data);
  sendtx(baseaddr,vssAddr,'0',setCallerData);
  sleep(5000);

	//===============Step 3. Use the deployed Contracts to start a AppChain======

	// The deposit is required for each SCS to join the AppChain
	var appChainDeposit = 10;

	if (checkBalance(appChainAddr, appChainDeposit) ){
	   console.log("continue...")
	}else{
	   // Add balance to appChainAddr for AppChain running
	   console.log("Add funding to AppChain!");
	   addFundToAppChain(appChainAddr, appChainDeposit)
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

  // put the VNODE in the pool to communicate the data in BaseChain
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


  //===============Step 4. Open the SCS pool to get enough SCSs and then close to start the AppChain======
	// Open the register for the SCSs to join the AppChain
  console.log("Opening the pool!")
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

  // Close the registration to let the AppChain start running
  console.log("Closing the pool!")
	registerClose(appChain.address);

	sleep(5000);

    //===============Step 5. Deploy the DappBase contract at the AppChain======
    console.log("AppChain is ready, prepare to deploy dappBase on ", appChain.address);
    
    // Check the DAPP status after deploy, need to wait for several blocks
    // If successful, you should see the new DAPP address
    // Need to wait on the new AppChains to run for a while
    waitForAppChainBlocks(appChain.address,5);
    // Deploy the DappBasePublic contract to enable the Dapp deployment on the AppChain
    // Please notice this is to deploy to the AppChain

    // Prepare and Send TX to VNODE to deploy the DAPP on the AppChain;
    //Deploy the DappBase with correct parameters
    var inNonce = chain3.scs.getNonce(appChain.address,baseaddr);

    console.log("Src nonce:", inNonce, " RandDrop AppChain TokenSupply", tokensupply);

    // Use precompiled codes and input parameters to deploy to the AppChain
    var dappBaseContract = chain3.mc.contract(JSON.parse(ABIs.dappBase));
    // There are two params 
    // Name is a string for the DappBase
    // true/false is the flag to set to allow non-owner deploy the contracts on the AppChain
    var dappBaseContractByteCodes = dappBaseContract.new.getData(
        "randdropAppChain01",
        true,
        {data:ByteCodes.dappBasePublic});
    // set TX flag to '0x3' for deploy contract on the AppChain
    var mchash = sendAppChainTx(baseaddr,basepsd,appChain.address,VNODEVia, tokensupply, dappBaseContractByteCodes, inNonce,'0x3')
    console.log("dappbase TX HASH:", mchash);

    // Check the DAPP status after deploy, need to wait for several blocks
    // If successful, you should see the new DAPP address
    waitForAppChainBlocks(appChain.address,5);

    console.log("Should see DAPP list on :",appChain.address, "\n at: ", chain3.scs.getDappAddrList(appChain.address));

	console.log("all Done!!! Should see the blocks info on SCSs");
  // Lock the account after use
  chain3.personal.lockAccount(baseaddr);

	
    
}, (error) => {  console.log("deploy RandDropChainBaseASM error:" + error);});


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

// Send BaseChain TX
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
function addFundToAppChain(inaddr, num){
  sendtx(baseaddr, inaddr, num,'0xa2f09dfa')
}

// vnoderegister(viaAddress, 1, "127.0.0.1:50062")
// vnodepoolbase.vnodeCount()
// vnode - vnode pool contract object with register function, and address
// num - deposit for VNODE to join the VNODE pool
// data - VNODE register FUNCTION
function vnoderegister(vnode,num,via,ip){
  var data=vnode.register.getData(vnode.address,via.toLowerCase(),ip,'')
  sendtx(baseaddr,vnode.address,num,data)
}

// use precompiled code to create the contract
// Note the baseaddr account need to be unlocked
function deploy_randdrop(   
  scsPoolAddr,
   vnodeProtocolBaseAddr,
   min,
   max,
   thousandth,
   flushRound,
   tokensupply,
   exchangerate,
   vssbaseAddr, baseaddr) {
	return new Promise((resolve, reject) => {
		
	console.log("Start to deploy the RandDrop AppChain contract");

  //console.log(' scsPoolAddr: ', scsPoolAddr, ' vnodePoolAddr: ', vnodePoolAddr, ' min: ', min, ' max: ', max, ' thousandth: ', thousandth, ' flushRound: ', flushRound, ' tokensupply: ', tokensupply, ' exchangerate: ', exchangerate, ' baseaddr: ', baseaddr); 
    
		
  // Precompiled Contract to be deployed
  var subchainbase = appchainASMContract.new(
   scsPoolAddr,
   vnodeProtocolBaseAddr,
   min,
   max,
   thousandth,
   flushRound,
   tokensupply,
   exchangerate,
   vssbaseAddr,
   {
     from: baseaddr, 
     data: ByteCodes.randdropAsm, 
     gas: '9000000'
   }, function (e, contract){
         if (e!=null){console.log('RandDrop AppChain contract deploy error : ', e); reject(e); return}
         console.log(' AppChain Contract transactionHash: ', contract.transactionHash); 
         if (typeof(contract.address)!='undefined'){ resolve(contract.address);}    
    });
		
	})
}

// Functions to use in the process
// Send TX to AppChain with account password and Sharding Flag set
function sendAppChainTx(baseaddr,basepsd, subchainaddr, via, amount,code,n,sf)
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


