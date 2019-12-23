/*
 * Example shows how to deploy MicroChain DAPPs.
 * 
 * Require:
 * 1. A valid account keystore with password to deploy the Dapp on MicroChain;
 * 2. A running VNODE can connect and send Transaction to, need turn on personal in rpc api;
 *    --rpcapi "chain3,mc,net,vnode,personal"
 * 3. A running SCS with rpc port open, need turn on when start SCS:
 *    --rpc;
 * 4. A VNODE address used as proxy for the MicroChain, can check the VNODE settings in the vnodeconfig.json;
 * 5. A running MicroChain with valid MicroChain address;
 * 6. Chain3.js library installed with verion 0.1.19 and later;
 * 
 * Steps:
 * 1. Check the MicroChain address and the source account nonce on the MicroChain;
 * 2. Compiled the input sol source file for the DAPP;
 * 3. Send TX to VNODE to deploy the DAPP on the MicroChain;
 *  
 * Usage:
 *   node deployDapp.js hello.sol
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

// Be aware that this need to be the owner of the MicroChain to deploy
// DAPPs on the MicroChain.
// need turn on personal in rpc api
// Need to add the addr and private key
baseaddr = "";//mc.accounts[0];
basepsd  = "";//
// Note these addresses should be changed if VNODE and SCS changed
var viaAddress = "";//The VNODE via address, can be get from vnodeconfig.json
var appchainAddress="";// MicroChain address,

//===============Step 1========================================================
// Check the MicroChain address and the source account nonce on the MicroChain;
// Be aware that this need to be the owner of the MicroChain to deploy
// DAPPs on the MicroChain.
// Need to add the address and private key

// Create the Chain3 obj
var chain3 = new Chain3();

//Setup the VNODE provider to send the transaction to
// and the SCS provider to get the results

chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:8545'));
chain3.setScsProvider(new chain3.providers.HttpProvider('http://localhost:8548'));
  
// start connecting with VNODE
if (!chain3.isConnected()){
    console.log("Chain3 RPC is not connected!");
    return;
}

// Display MicroChain Info on the SCS server
console.log("MicroChain ", appchainAddress,",state:", chain3.scs.getDappState(appchainAddress)," blockNumber:", chain3.scs.getBlockNumber(appchainAddress));
console.log("DAPP list:", chain3.scs.getDappAddrList(appchainAddress), chain3.scs.getNonce(appchainAddress,baseaddr));

//===============Step 2========================================================
// Compiled the input sol source file for the DAPP;
// Read in the file from the command line
var cmds = process.argv;
if(cmds != null && cmds.length == 3){
  var inDappFile = cmds[2];
}else
{
  console.log("Input should have Dapp contract file and contract name:\neg: node deploy.js add.sol");
  return;
}

var content = fs.readFileSync(inDappFile, 'utf8');

output = solc.compile(content, 1);

var key = Object.keys(output.contracts);

//this is the comiled object
var ctt = output.contracts[key];

if(ctt == null){
  console.log("Contract CTT is empty!");
  return;
}

var bytecode = "0x"+ctt.bytecode;
var mcabi = JSON.parse(ctt.interface);

//===============Step 3========================================================
// Prepare and Send TX to VNODE to deploy the DAPP on the MicroChain;
// Deploy the Dapp with correct nonce
var inNonce = chain3.scs.getNonce(appchainAddress,baseaddr);

console.log("Src nonce:", inNonce);

// No need to pass the amount when deploying the DAPP
var mchash = sendshardingflagtx(baseaddr,basepsd,appchainAddress,viaAddress, 0, bytecode,inNonce,'0x3')
console.log("dappbase TX HASH:", mchash);

// Check the DAPP status after deploy, need to wait for several blocks
// If successful, you should see the new DAPP address
waitForMicroChainBlocks(appchainAddress,2);

console.log("Should see DAPP list on :",appchainAddress, "\n at: ", chain3.scs.getDappAddrList(appchainAddress));


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
function waitForMicroChainBlocks(inMcAddr, innum) {
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



