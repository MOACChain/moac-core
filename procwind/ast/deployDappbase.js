/*
 * Example shows how to deploy DAPPBase for AppChain to support Multiple Dapps.
 * 
 * Require:
 * 1. A valid account keystore with password to deploy the DappBase on the AppChain;
 * 2. A running VNODE can connect and send Transaction to, need turn on personal in rpc api;
 *    --rpcapi "chain3,mc,net,vnode,personal"
 * 3. A running SCS with rpc port open, need turn on when start SCS:
 *    --rpc;
 * 4. A VNODE address used as proxy for the AppChain, can check the VNODE settings in the vnodeconfig.json;
 * 5. A running AppChain with valid AppChain address;
 * 6. Chain3.js library installed with verion 0.1.19 and later;
 * 
 * Usage:
 *   node deployDappBase.js DappBasePrivate.sol
 * 
 * For AppChain related info, please check online documents:
 * English:
 * https://moac-docs.readthedocs.io/en/latest
 * 中文：
 * https://moacdocs-chn.readthedocs.io/zh_CN/latest
 */

// only 0.4.24 or 0.4.26 version should be used, 
// To install a certain version of solc: npm install solc@0.4.24
const solc = require('solc');
const Chain3 = require('chain3');
const fs = require('fs');

//===============Setup the Parameters==========================================
// Be aware that this need to be the owner of the AppChain to deploy
// DAPPs on the AppChain.
// need turn on personal in rpc api
// Need to add the addr and private key
baseaddr = "";//mc.accounts[0];
basepsd  = "";//
// Note these addresses should be changed if VNODE and SCS changed
var viaAddress = "";//The VNODE via address, can be get from vnodeconfig.json
var appchainAddress="";// AppChain address,
//For AST, this value should be the same as the TokenSupply in the ERC20 
//the ChainBaseAST.sol
var appChainTokenSupply=0;

//===============Step 1========================================================
// Check the AppChain address and the source account nonce on the AppChain;
// Create the Chain3 obj
var chain3 = new Chain3();
//Setup the VNODE provider to send the transaction to
// and the SCS provider to get the results
chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:8545'));

// start connecting with VNODE
if (!chain3.isConnected()){
    console.log("Chain3 RPC is not connected!");
    return;
}

// For deploy the DappBase, this should be the SCS that will be included in the AppChain
chain3.setScsProvider(new chain3.providers.HttpProvider('http://localhost:8548'));

// check the connecting with SCS
if (!chain3.isScsConnected()){
    console.log("Chain3 RPC is not connected on SCS!");
    return;
}

// Display AppChain Info on the SCS server
console.log("AppChain ", appchainAddress,",state:", chain3.scs.getDappState(appchainAddress)," blockNumber:", chain3.scs.getBlockNumber(appchainAddress));
console.log("DAPP list:", chain3.scs.getDappAddrList(appchainAddress));

//===============Step 2========================================================
// Compiled the input sol source file for the DAPP;
// Read in the DAPP source file from the command line
var cmds = process.argv;
if(cmds != null && cmds.length == 3){
  var inDappFile = cmds[2];
}else
{
  console.log("Input should have DappBase contract file name after the script:\neg: node deploy.js add.sol");
  return;
}
  
var content = fs.readFileSync(inDappFile, 'utf8');

output = solc.compile(content, 1);
// console.log('contracts', Object.keys(output.contracts));

var key = Object.keys(output.contracts);
//this is the contract object contains interface and bytecode
var ctt = output.contracts[key];

if(ctt == null){
  console.log("Contract CTT is empty1");
  return;
}

var bytecode = "0x"+ctt.bytecode;
var mcabi = JSON.parse(ctt.interface);

//===============Step 3========================================================
// Prepare and Send TX to VNODE to deploy the DAPP on the AppChain;
// Deploy the DappBase with correct parameters
var inNonce = chain3.scs.getNonce(appchainAddress,baseaddr);

console.log("Src nonce:", inNonce, " AppChain TokenSupply", appChainTokenSupply);

var mchash = sendshardingflagtx(baseaddr,basepsd,appchainAddress,viaAddress, appChainTokenSupply, bytecode,inNonce,'0x3')
console.log("dappbase TX HASH:", mchash);

// Check the DAPP status after deploy, need to wait for several blocks
// If successful, you should see the new DAPP address
waitForAppChainBlocks(appchainAddress,10);

console.log("Should see nonce change to 1:", chain3.scs.getNonce(appchainAddress,baseaddr));
console.log("Should see DAPP address on:",appchainAddress, "\n at: ", chain3.scs.getDappAddrList(appchainAddress));


return;

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
  let preBlk = startBlk;
  console.log("Waiting for blocks to confirm the contract... currently in block " + startBlk);
  while (true) {
    let curblk = chain3.scs.getBlockNumber(inMcAddr);
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
    
    sleep(3000000);
  }
}

// Sleep seconds
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
}



