/* Script to close a MOAC AST AppChain after deployed.
 * 
 * Require:
 * 1. Valid account with unlock password;
 * 2. Valid AppChain address;
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

const Chain3 = require('chain3');

//===============Setup the Parameters==========================================

// need to have a valid account to use for contracts deployment
var baseaddr = "";//keystore address
var basepsd = "";//keystore password

// Appchain address to be closed
var appchainAddress = "";

//===============Check the Blockchain connection===============================
// 
// Setup VNODE server to send TX command and the SCS to monitor the AppChain

const vnodeUri = 'http://localhost:8545';
const scsUri = 'http://localhost:8548';

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

//Setup the SCS monitor of the AppChain
chain3.setScsProvider(new chain3.providers.HttpProvider(scsUri));

if (!chain3.isScsConnected()){
    console.log("Chain3 RPC is not connected on SCS!");
    return;
}

// Check the AppChain status
// Display AppChain Info on the SCS server, you should see the input AppChain address listed
mclist = chain3.scs.getMicroChainList();

if (mclist < 1) {
  console.log("No AppChain info on the SCS, quit closing AppChain!");
  return;
}


for(var i = 0; i < mclist.length; i++){
      if ( mclist[i] == appchainAddress ){
        //close the AppChain
        console.log("Find AppChain, try closing:", appchainAddress);
        // Send out the closing command
        // ABI chain3.sha3("close()") = 0x43d726d69bfad97630bc12e80b1a43c44fecfddf089a314709482b2b0132f662
        // 4 bytes 0x43d726d6

        chain3.personal.unlockAccount(baseaddr,basepsd);
        chain3.mc.sendTransaction( { from: baseaddr, value:0, to: appchainAddress, gas: "2000000", gasPrice: chain3.mc.gasPrice, data: '0x43d726d6'});

        // wait for flush cycle ends
        // If successful, you should see the DAPP address was removed from the AppChain list on the SCS

        sleep(3000000);
        chain3.personal.lockAccount(baseaddr);// Lock the account after TX to be safe
        console.log("Should close AppChain:",appchainAddress);

      }else{
        console.log("Skipping AppChain:", mclist[i]);
      }
      
}


//===============================================================


// Sleep seconds
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
}

