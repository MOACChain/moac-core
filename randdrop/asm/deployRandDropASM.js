/* Script to deploy MOAC RandDrop AppChain using pre-compiled contract
 * 
 * Require:
 * 1. Valid account with enough moac to deploy the contracts;
 * 2. A running VNODE can connect and send Transaction to, need turn on personal in rpc api;
 --rpcapi "chain3,mc,net,vnode,personal,
 * 3. At least three SCSs, recommended 5;
 * 4. A VNODE used as proxy for the AppChain, with VNODE settings in the vnodeconfig.json;
 * 5. Three contract address from the following contracts:
 *    VnodeProtocolBase.sol - scsPoolAddr
 *    SCSProtocolBase.sol - vnodeProtocolBaseAddr
 *    ChainBaseASM.sol
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

const ABIs = require('./mcABIs');
const ByteCodes = require('./mcByteCodes');

// Deploy the AppChain contract to form a AppChain with Atomic Swap of Token (ASM) function


var min = '';/* var of type uint256 here */ 
var max = '';/* var of type uint256 here */ 
var thousandth = '';/* var of type uint256 here */ 
var flushRound = '';/* var of type uint256 here */ 
var tokensupply = '';/* var of type uint256 here */ 
var exchangerate = '';/* var of type uint256 here */ 

var scsPoolAddr = "";/* var of type address here */ 
var vnodeProtocolBaseAddr = '';/* var of type address here */ 
var vssbaseAddr = '';/* var of type address here */ 

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

// Unlock the account to send the TX
chain3.personal.unlockAccount(baseaddr,basepsd);


// Contract to be deployed
var subchainbaseContract = chain3.mc.contract(JSON.parse(ABIs.randdropAsm));

var subchainbase = subchainbaseContract.new(
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
     data: ByteCodes.rangdropAsm, 
     gas: '9000000'
   }, function (e, contract){
    // console.log(e, contract);
    if (typeof contract.address !== 'undefined') {
         console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
    }
 })

// Lock the account after use
chain3.personal.lockAccount(baseaddr);
