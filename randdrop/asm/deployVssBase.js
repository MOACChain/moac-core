/*
 * Example to deploy the VSS base contract for RandDrop AppChain.
 * The smart contract VssBase.sol is precompiled to prevent any compiler issues.
 * 
 * Solidity compiler v0.4.24 is suggested to use for compiling VssBase.sol.
 * 
 * Require:
 * 1. A valid account keystore with password to deploy the Contract on the MOAC BaseChain;
 * 2. A running VNODE can connect and send Transaction to, need turn on personal in rpc api;
 *    --rpcapi "chain3,mc,net,vnode,personal"
 * 
 * Usage:
 *   node deployVssBase.js
 * 
 * For AppChain related info, please check online documents:
 * English:
 * https://moac-docs.readthedocs.io/en/latest
 * 中文：
 * https://moacdocs-chn.readthedocs.io/zh_CN/latest
 */


// const Chain3 = require('chain3');
const Chain3 = require('../../index.js');
const ABIs = require('./mcABIs');
const ByteCodes = require('./mcByteCodes');

// need to have a valid account to use for contracts deployment
var baseaddr = "";//keystore address
var basepsd = "";//keystore password

//===============Check the BaseChain connection===============================

// Setup VNODE server to send TX command and the SCS to monitor the AppChain

const vnodeUri = 'http://localhost:8545';// can be change to other urls

// Setup the provider and try to connect
let chain3 = new Chain3();
chain3.setProvider(new chain3.providers.HttpProvider(vnodeUri));

if(!chain3.isConnected()){
    throw new Error('unable to connect to moac vnode at ' + vnodeUri);
}else{
    console.log('connected to VNODE ' + vnodeUri);
    let balance = chain3.mc.getBalance(baseaddr);
    console.log('Check src account balance:' + baseaddr + ' has ' + balance*1e-18 + " MC");
}

//===============Deploy the contract ===============================
// Unlock the account to send the TX
chain3.personal.unlockAccount(baseaddr,basepsd);

var threshold = 3/* var of type int256 here */ ;

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
// Lock the account after use
chain3.personal.lockAccount(baseaddr);
