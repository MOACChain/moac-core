/* Script to create a MOAC AST AppChain using three contracts in the input files.
 * 
 * Require:
 * 1. Valid account with enough moac to deploy the contracts;
 * 2. A running VNODE can connect and send Transaction to, need turn on personal in rpc api;
 --rpcapi "chain3,mc,net,vnode,personal,
 * 3. At least three SCSs, recommended 5;
 * 4. A VNODE used as proxy for the AppChain, with VNODE settings in the vnodeconfig.json;
 * 5. Three contract files:
 *    VnodeProtocolBase.sol
 *    SubChainProtocolBase.sol
 *    ChainBaseAST.sol
 *
 * Steps:
 * 1. Deploy the erc20, VNODE and SCS pool contracts;
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
const solc = require('solc');//only 0.4.24 version should be used, npm install solc@0.4.24


// Deploy the ERC20 contract
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


