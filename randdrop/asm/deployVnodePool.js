/*
 * Example to deploy the VNODE pool contract for MOAC AppChains.
 * The smart contract VnodeProtocolBse.sol is precompiled to prevent any compiler issues.
 * 
 * Require:
 * 1. A valid account keystore with password to deploy the Contract on the MOAC BaseChain;
 * 2. A running VNODE can connect and send Transaction to, need turn on personal in rpc api;
 *    --rpcapi "chain3,mc,net,vnode,personal"
 * 
 * Usage:
 *   node deployVnodePool.js
 * 
 * For AppChain related info, please check online documents:
 * English:
 * https://moac-docs.readthedocs.io/en/latest
 * 中文：
 * https://moacdocs-chn.readthedocs.io/zh_CN/latest
 */

const Chain3 = require('chain3');
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

var bmin = 1/* var of type uint256 here */ ;
// var vnodeprotocolbaseContract = chain3.mc.contract([{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"vnodeList","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"randness","type":"uint256"}],"name":"pickRandomVnode","outputs":[{"name":"target","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdrawRequest","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"vnodeCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"vnode","type":"address"},{"name":"via","type":"address"},{"name":"link","type":"string"},{"name":"rpclink","type":"string"}],"name":"register","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"PEDNING_BLOCK_DELAY","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"outageReportList","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"level","type":"uint256"},{"name":"startpos","type":"uint256"},{"name":"count","type":"uint256"}],"name":"sweepOutage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"bondMin","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"isPerforming","outputs":[{"name":"res","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"vnodeStore","outputs":[{"name":"from","type":"address"},{"name":"bond","type":"uint256"},{"name":"state","type":"uint256"},{"name":"registerBlock","type":"uint256"},{"name":"withdrawBlock","type":"uint256"},{"name":"rpclink","type":"string"},{"name":"via","type":"address"},{"name":"link","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"vnode","type":"address"}],"name":"reportOutage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"WITHDRAW_BLOCK_DELAY","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"bmin","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}]);
var vnodeprotocolbaseContract = chain3.mc.contract(JSON.parse(ABIs.vnodePool));
var vnodepoolbase = vnodeprotocolbaseContract.new(
   bmin,
   {
     from: baseaddr, 
     data: ByteCodes.vnodePool, 
     gas: '4700000'
   })

console.log("VNODE protocol is being deployed at transaction HASH: " + vnodepoolbase.transactionHash);

// Lock the account after use
chain3.personal.lockAccount(baseaddr);
