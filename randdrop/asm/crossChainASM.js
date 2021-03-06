/*
 * Example shows how to deposit mc to the AppChain and withdraw mc from the AppChain.
 * 
 * Require:
 * 1. A valid account keystore with password to deploy the DappBase on the AppChain;
 * 2. A running VNODE can connect and send Transaction to, need turn on personal in rpc api;
 *    --rpcapi "chain3,mc,net,vnode,personal"
 * 3. A running SCS with rpc port open, need turn on when start SCS:
 *    --rpc;
 * 4. A VNODE address used as proxy for the AppChain, can check the VNODE settings in the vnodeconfig.json;
 * 5. A running randdrop ASM AppChain with valid AppChain address;
 * 6. Chain3.js library installed with verion 0.1.19 and later;
 * 
 * Further Readings:
 * This script calls the AppChain close method to close a deployed AppChain.
 * For AppChain related info, please check online documents:
 * English:
 * https://moac-docs.readthedocs.io/en/latest
 * 中文：
 * https://moacdocs-chn.readthedocs.io/zh_CN/latest
 * 
*/

// const Chain3 = require('chain3');
const Chain3 = require('../index.js');

/*--- Parameters need to be set ---*/
// Be aware that this need to be the owner of the AppChain to deploy
// DAPPs on the AppChain.
// need turn on personal in rpc api
// Need to add the addr and private key
baseaddr = "";//Account used to 
basepsd  = "";//
// Note these addresses should be changed if VNODE and SCS changed
var viaAddress = "";//The VNODE via address, VnodeBeneficialAddress in the vnodeconfig.json 
var appchainAddress="";// AppChain address,
//For ASM, this value should be the same as the TokenSupply when deploying
//the ChainBaseASM.sol,
// var exchangerate = 100;// the exchange rate bewteen moac and AppChain token. 
var appChainTokenSupply = 0;

//==================================
// baseaddr = "0xf6a36118751c50f8932d31d6d092b11cc28f2258";
// basepsd = "test";
basepsd = "test";
baseaddr = "0xa8863fc8ce3816411378685223c03daae9770ebb";// for dev net
viaAddress="0xD814F2ac2c4cA49b33066582E4e97EBae02F2aB9";


// 注意部署dappbase合约的value为 1000(tokensupply) * 10的18次方(应用链原生币decimals)
appChainTokenSupply = 996;//987654321 * 100 * 1e18;

// The SCS via is in the userconfig.json
// VNODE proxy
SCSVia="0xD814F2ac2c4cA49b33066582E4e97EBae02F2aB9";

/*--- End of Parameters need to be set ---*/

// 1. Check the AppChain address and the source account nonce on the AppChain;
// Create the Chain3 obj
var chain3 = new Chain3();

//Setup the VNODE provider to send the transaction to
// and the SCS provider to get the results
chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:8545'));
chain3.setScsProvider(new chain3.providers.HttpProvider('http://localhost:8548'));

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
mclist = chain3.scs.getAppChainList();

if (mclist.length < 1){
    console.log("No ASM AppChain on the SCS server!!! Exit with Error ");
    return;
}

// The following can be processed 
appchainAddress = mclist[0];
// Display AppChain Info on the SCS server
console.log("AppChain ASM", appchainAddress,",state should be 0:", chain3.scs.getDappState(appchainAddress)," blockNumber:", chain3.scs.getBlockNumber(appchainAddress));
console.log("DAPP list should be 0:", chain3.scs.getDappAddrList(appchainAddress));

console.log("AppChain", appchainAddress,"\nbalance:", chain3.scs.getMicroChainInfo(appchainAddress).balance);
console.log("Account",baseaddr, "\nbalance on AppChain:", chain3.scs.getBalance(appchainAddress, baseaddr).toString());
console.log("balance on baseChain:", chain3.mc.getBalance(baseaddr).toString()*1e-18);

// Deposit the amount to baseaddr on BaseChain, 
// the baseaddr will have less mc in the basechain and more token on the AppChain
var amount = 0.5;

var depositFlag = 0;

if ( depositFlag == 1){
  // Deposit action is a BaseChain TX
  depositToAppChain(baseaddr, basepsd, appchainAddress, amount);
}else{

  // To withdraw the token, need dappbase address, can get from AppChain
  var dapplist = chain3.scs.getDappAddrList(appchainAddress);
  var dappbaseaddr = dapplist[0];//dappbase is the 1st contract address
  console.log("Dappbase:", dappbaseaddr);
  var appChainNonce = chain3.scs.getNonce(appchainAddress,baseaddr)

  withdrawFromAppChain(baseaddr, basepsd, appchainAddress, dappbaseaddr, appChainNonce, amount, SCSVia);

}


// Wait the account balance to change on the AppChain
waitForAppChainBalance(appchainAddress, baseaddr);

console.log("========================= After change =========================")
console.log("AppChain", appchainAddress,"\nbalance:", chain3.scs.getMicroChainInfo(appchainAddress).balance);
console.log("Account",baseaddr, "\nbalance on AppChain:", chain3.scs.getBalance(appchainAddress, baseaddr).toString());
console.log("balance on baseChain:", chain3.mc.getBalance(baseaddr).toString()*1e-18);

return;

// Deposit mc to the AppChain
// the balance of baseaddr on BaseChain should decrease amount
// The balance of baseaddr on AppChain should increase amount * ratio
// ABI chain3.sha3("buyMintToken()") = 0x6bbded701cd78dee9626653dc2b2e76d3163cc5a6f81ac3b8e69da6a057824cb
function depositToAppChain(baseaddr,basepsd, appchainaddr, amount)
{
  console.log("Account:", baseaddr, "\nDepositing ", amount, " to ", appchainaddr)
    chain3.personal.unlockAccount(baseaddr,basepsd);
    txhash = chain3.mc.sendTransaction( { from: baseaddr, 
      value: chain3.toSha(amount,'mc'), 
      to: appchainaddr, 
      gas:"2000000", 
      gasPrice: chain3.mc.gasPrice, 
      data: '0x6bbded70'});
    chain3.personal.lockAccount(baseaddr);

    return txhash;
}

// WithDraw from the AppChain
// the balance of baseaddr on BaseChain should decrease amount
// The balance of baseaddr on AppChain should increase amount * ratio
// ABI chain3.sha3("buyMintToken()") = 0x6bbded701cd78dee9626653dc2b2e76d3163cc5a6f81ac3b8e69da6a057824cb
function withdrawFromAppChain(baseaddr,basepsd, appchainaddr, dappbassaddr, innonce, nonamount, vnodevia)
{
    console.log("Account:", baseaddr, "\nWithdrawing ", amount, " from ", appchainaddr)
    chain3.personal.unlockAccount(baseaddr,basepsd);

    txhash = chain3.mc.sendTransaction( 
      { nonce: innonce, 
        from: baseaddr, 
        value:chain3.toSha(amount,'mc'), 
        to: appchainaddr, 
        gas:0, 
        shardingFlag:'0x1', 
        data: dappbassaddr + '89739c5b', 
        via: vnodevia});

    chain3.personal.lockAccount(baseaddr);
    return txhash;
}

// wait certain blocks on the BaseChain for the contract to be mined
function waitForBaseChainBlocks(innum) {
  let startBlk = chain3.mc.blockNumber;
  let preBlk = startBlk;
  console.log("Waiting for blocks to confirm the contract... currently at block " + startBlk);
  while (true) {
    let curblk = chain3.mc.blockNumber;
    if (curblk > startBlk + innum) {
      console.log("Waited for " + innum + " blocks!");
      break;
    }
    if ( curblk > preBlk){
      console.log("Waiting for blocks to confirm the contract... currently at block " + curblk);
      preBlk = curblk;
    }else{
        console.log("...");
    }
    
    sleep(2000000);
  }
}

// Wait for results to come
function waitForAppChainBlocks(inMcAddr, innum) {
  let startBlk = chain3.scs.getBlockNumber(inMcAddr);
  let preBlk = startBlk;
  console.log("Waiting for blocks on ", inMcAddr, " to confirm the transaction... \ncurrently at block " + startBlk);
  while (true) {
    let curblk = chain3.scs.getBlockNumber(inMcAddr);
    if (curblk > startBlk + innum) {
      console.log("Waited for " + innum + " blocks!");
      break;
    }
    if ( curblk > preBlk){
      console.log("Waiting for blocks to confirm the transaction... \ncurrently at block " + curblk);
      preBlk = curblk;
    }
    
    sleep(3000000);
  }
}


// Wait for results to show on the AppChain
function waitForAppChainBalance(inMcAddr, inAddr) {
  let bal1 = chain3.scs.getBalance(appchainAddress, baseaddr).toString();
  let bal2 = bal1;
  let startBlk = chain3.scs.getBlockNumber(inMcAddr);
  console.log("Waiting for balance changes on ", inMcAddr, " to confirm the transaction... \ncurrently at block " + startBlk);
  while (true) {
    let curblk = chain3.scs.getBlockNumber(inMcAddr);
    if (curblk > startBlk + 100) {
      console.log("Waited for 100 blocks, quit the listening!");
      break;
    }
    bal1 = chain3.scs.getBalance(appchainAddress, baseaddr).toString();
    if ( bal1 != bal2){
      console.log("Account", inAddr," balance changed at ", curblk, " from ", startBlk, "\nfrom ", bal2, " to ", bal1);
      break;
    }else{
      console.log("At blk", curblk, bal1, bal2);
    }
    
    sleep(5000000);
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



