/*
 * Example shows how to call AppChain functions and DAPPbase functions.
 * 
 * Require:
 * 1. A valid account to call the contracts;
 * 2. A running VNODE can connect and send Transaction to, need turn on personal in rpc api;
 *    --rpcapi "chain3,mc,net,vnode,personal,
 * 3. A running SCS with rpc port open, need turn on when start SCS:
 *    --rpc;
 * 4. A VNODE address used as proxy for the AppChain, can check the VNODE settings in the vnodeconfig.json;
 * 5. A running AppChain with address;
 * 6. A deployed Dapp contract on the AppChain with valid address and registered in the DappBase contract;
 * 7. Chain3.js library installed with verion 0.1.19 and later;
 * 
 * Further Readings:
 * This script calls the AppChain close method to close a deployed AppChain.
 * For AppChain related info, please check online documents:
 * English:
 * https://moac-docs.readthedocs.io/en/latest
 * 中文：
 * https://moacdocs-chn.readthedocs.io/zh_CN/latest
 */

const Chain3 = require('chain3');
var chain3 = new Chain3();

// external file holds AppChain ABI
var ABIs = require('./mcABIs');

//Setup the VNODE provider to send the transaction to
// and the SCS provider to get the results

chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:8545'));
chain3.setScsProvider(new chain3.providers.HttpProvider('http://localhost:8548'));
  
// Note these addresses should be changed if VNODE and SCS changed
var viaAddress = "";//The VNODE via address
var appchainAddress="";//Input the AppChain address

// Using local node or remote VNODE server to send TX command
const vnodeUri = 'http://localhost:8545';


// start connecting with VNODE
if (!chain3.isConnected()){
    console.log("Chain3 RPC is not connected on VNODE!");
    return;
}

// check the connecting with SCS
if (!chain3.isScsConnected()){
    console.log("Chain3 RPC is not connected on SCS!");
    return;
}

// Display AppChain Info on the SCS server
mclist = chain3.scs.getMicroChainList();
console.log("SCS AppChain Info List:");
for(var i = 0; i < mclist.length; i++){
      console.log("AppChain ", mclist[i],",state:", chain3.scs.getDappState(mclist[i])," blockNumber:", chain3.scs.getBlockNumber(mclist[i]));
      console.log("MC balance:", chain3.scs.getMicroChainInfo(mclist[i]).balance);
      console.log("DAPP list:", chain3.scs.getDappAddrList(mclist[i]));
}

//=======================================================
//Create a AppChain Object and test functions
//Load the contract ABI, must be fixed types, otherwise
var mcabi = ABIs.asmABI;//load in the AppChain ABI from external file

// Create the AppChain Object with abi
var mcObject = chain3.microchain(JSON.parse(mcabi));

// Need to setup the via address
mcObject.setVnodeAddress(viaAddress);

// This enables the MICROCHAIN objec, which is a Global contract on the MotherChain
var mchain=mcObject.at(appchainAddress);

//call AppChain methods
console.log("============================================\nTest AppChain functions");
console.log("nodeCount:", mchain.nodeCount().toString());
console.log("AppChain Info:\nBALANCE:", mchain.BALANCE().toString());
console.log("via Reward:", mchain.viaReward().toString());
console.log("flush Info:", mchain.getFlushInfo().toString());
//=======================================================


//Create a DappBase Object and test functions with it
var baseabi = ABIs.dappBaseABI;//load in the DappBase ABI from external file
var baseAddr = mclist[0]; //DappBase address should be the 1st Dapp address on the AppChain

// Create the AppChain DappBase Object with abi and address
var dappBase = mcObject.getDapp(appchainAddress, JSON.parse(baseabi), baseAddr);

console.log("============================================\nTest DappBase functions");
console.log("dappBase nodeList:", dappBase.getCurNodeList());


return;

