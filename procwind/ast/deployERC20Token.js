/* Script to deploy an ERC20 contract named erc20.sol
 * 
 * Require:
 * 1. Valid account with enough moac to deploy the contracts;
 * 2. A running VNODE can connect and send Transaction to, need turn on personal in rpc api;
 --rpcapi "chain3,mc,net,vnode,personal,
 *
 * 
*/

const Chain3 = require('chain3');
const fs = require('fs');
const solc = require('solc');//only 0.4.24 version should be used, npm install solc@0.4.24


let chain3 = new Chain3();

//===============Check the Blockchain connection===============================
// need to have a valid account to use for contracts deployment
var baseaddr = "";//keystore address
var basepsd = "";//keystore password

// Using local node or remote VNODE server to send TX command
const vnodeUri = 'http://localhost:8545';

chain3.setProvider(new chain3.providers.HttpProvider(vnodeUri));

if(!chain3.isConnected()){
    throw new Error('unable to connect to moac vnode at ' + vnodeUri);
}else{
    console.log('connected to moac vnode at ' + vnodeUri);
    let balance = chain3.mc.getBalance(baseaddr);
    console.log('Check src account balance:' + baseaddr + ' has ' + balance*1e-18 + " MC");
}
// Unlock the baseaddr for contract deployment



if (chain3.personal.unlockAccount(baseaddr, basepsd, 0)) {
    console.log(`${baseaddr} is unlocked`);
}else{
    console.log(`unlock failed, ${baseaddr}`);
    throw new Error('unlock failed ' + baseaddr);
}

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

  // Lock the account after use
  chain3.personal.lockAccount(baseaddr);

