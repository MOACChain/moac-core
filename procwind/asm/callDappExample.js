/*
 * Example shows how to call MicroChain functions and DAPPbase functions.
 * 
 * Require:
 * 1. A valid account to call the contracts;
 * 2. A running VNODE can connect and send Transaction to, need turn on personal in rpc api;
 *    --rpcapi "chain3,mc,net,vnode,personal,
 * 3. A running SCS with rpc port open, need turn on when start SCS:
 *    --rpc;
 * 4. A VNODE address used as proxy for the MicroChain, can check the VNODE settings in the vnodeconfig.json;
 * 5. A running MicroChain with address;
 * 6. Chain3.js library installed with verion 0.1.19 and later;
 * 
 * Steps:
 * 1. Deploy the VNODE and SCS pool contracts;
 * 2. Create the MicroChain contract using VNODE and SCS pools;
 * 3. Register the VNODE, SCSs, then open MicroChain to get all the SCSs registered.
 *  
 * Further Readings:
 * This script calls the MicroChain and Dappbase functions
 * To generates a MicroChain with no DAPP on it, check 
 * deployASM.js or deployAST.js.
 * To deploy the Dappbase and additional DAPP contracts on MicroChain
 * Check deployDapp.js
 * To call the MicroChain functions and Dapp functions, please check 
 * callDappExample.js
 * 
 * For MicroChain related info, please check online documents:
 * English:
 * https://moac-docs.readthedocs.io/en/latest/subchain
 * 中文：
 * https://moacdocs-chn.readthedocs.io/zh_CN/latest/subchain
 */

const Chain3 = require('chain3');
var chain3 = new Chain3();

// external file holds MicroChain ABI
var ABIs = require('./mcABIs');

//Setup the VNODE provider to send the transaction to
// and the SCS provider to get the results

chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:8545'));
chain3.setScsProvider(new chain3.providers.HttpProvider('http://localhost:8548'));
  
// Note these addresses should be changed if VNODE and SCS changed
var viaAddress = "";//The VNODE via address
var microchainAddress="";//Input the MicroChain address

// start connecting with VNODE
if (!chain3.isConnected()){
    console.log("Chain3 RPC is not connected!");
    return;
}

// Display MicroChain Info on the SCS server
mclist = chain3.scs.getMicroChainList();
console.log("SCS MicroChain Info List:");
for(var i = 0; i < mclist.length; i++){
      console.log("MicroChain ", mclist[i],",state:", chain3.scs.getDappState(mclist[i])," blockNumber:", chain3.scs.getBlockNumber(mclist[i]));
      console.log("MC balance:", chain3.scs.getMicroChainInfo(mclist[i]).balance);
      console.log("DAPP list:", chain3.scs.getDappAddrList(mclist[i]));
}

//=======================================================
//Create a MicroChain Object and test functions
//Load the contract ABI, must be fixed types, otherwise
var mcabi = ABIs.astABI;//load in the MicroChain ABI from external file

// Create the MicroChain Object with abi
var mcObject = chain3.microchain(JSON.parse(mcabi));

// Need to setup the via address
mcObject.setVnodeAddress(viaAddress);

// This enables the MICROCHAIN objec, which is a Global contract on the MotherChain
var mchain=mcObject.at(microchainAddress);

//call MicroChain methods
console.log("============================================\nTest MicroChain functions");
console.log("nodeCount:", mchain.nodeCount().toString());
console.log("Microchain Info:\nBALANCE:", mchain.BALANCE().toString());
console.log("via Reward:", mchain.viaReward().toString());
console.log("flush Info:", mchain.getFlushInfo().toString());
//=======================================================


//Create a DappBase Object and test functions with it
var baseabi = ABIs.dappBaseABI;//load in the DappBase ABI from external file
var baseAddr = mclist[0]; //DappBase address should be the 1st Dapp address on the MicroChain

// Create the MicroChain DappBase Object with abi and address
var dappBase = mcObject.getDapp(microchainAddress, JSON.parse(baseabi), baseAddr);

console.log("============================================\nTest DappBase functions");
console.log("dappBase nodeList:", dappBase.getCurNodeList());


return;

