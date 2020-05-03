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
 *   node deployDappBase.js DappBasePublic.sol
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

var ABIs = require('./mcABIs');

var vnodeConnectUrl="127.0.0.1:50062";//VNODE connection as parameter to use for VNODE pool protocol
var minScsRequired = 3; // Min number of SCSs in the AppChain, recommended 3 or more

//===============Setup the Parameters==========================================
// Be aware that this need to be the owner of the AppChain to deploy
// DAPPs on the AppChain.
// need turn on personal in rpc api
// Need to add the addr and private key
baseaddr = "";//should be an account on the via VNODE, such as mc.accounts[0];
basepsd  = "";//
// Note these addresses should be changed if VNODE and SCS changed
var viaAddress = "";//The VNODE via address, can be get from vnodeconfig.json
var appChainAddress="";// AppChain address,

// For ASM chain, this needs to be the same parameter as defined in the ChainBaseASM
// or can be read from 
var tokensupply=0;

//===============Check the Blockchain connection===============================
// Using local node or remote VNODE server to send TX command
const vnodeUri = 'http://localhost:8545';

//===============Step 1========================================================
// Check the AppChain address and the source account nonce on the AppChain;
// Create the Chain3 obj
let chain3 = new Chain3();
chain3.setProvider(new chain3.providers.HttpProvider(vnodeUri));

if(!chain3.isConnected()){
    throw new Error('unable to connect to moac vnode at ' + vnodeUri);
}else{
    console.log('connected to moac vnode at ' + vnodeUri);
    let balance = chain3.mc.getBalance(baseaddr);
    console.log('Check src account balance:' + baseaddr + ' has ' + balance*1e-18 + " MC");
}

// For deploy the DappBase, this should be the SCS that will be included in the AppChain
chain3.setScsProvider(new chain3.providers.HttpProvider('http://localhost:8548'));

// check the connecting with SCS
if (!chain3.isScsConnected()){
    console.log("Chain3 RPC is not connected on SCS!");
    return;
}

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

//===============Deploy the DappBase contract at the AppChain======
 console.log("SCS ", appChainAddress,",state:", chain3.scs.getDappState(appChainAddress)," blockNumber:", chain3.scs.getBlockNumber(appChainAddress));
 var dappbasepublicBytecode="0x606060405260068054600160a060020a03191633600160a060020a03161790556111368061002e6000396000f3006060604052600436106100985763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166310ba0499811461009d57806312df94121461010b57806331a06771146101e1578063442e95b11461023057806357058a33146103305780635b1222b4146103965780635b15270c146103c857806389739c5b14610480578063f2096c3b14610488575b600080fd5b34156100a857600080fd5b6100f7600460248135818101908301358060208181020160405190810160405280939291908181526020018383602002808284375094965050509235600160a060020a031692506104ad915050565b604051901515815260200160405180910390f35b341561011657600080fd5b6101df60048035906044602480359081019083013580602081810201604051908101604052809392919081815260200183836020028082843782019150505050505091908035906020019082018035906020019080806020026020016040519081016040528093929190818152602001838360200280828437820191505050505050919080359060200190820180359060200190808060200260200160405190810160405280939291908181526020018383602002808284375094965061050695505050505050565b005b34156101ec57600080fd5b6101df60046024813581810190830135806020818102016040519081016040528093929190818152602001838360200280828437509496506108ec95505050505050565b341561023b57600080fd5b610252600160a060020a0360043516602435610ad1565b60405180806020018060200180602001848103845287818151815260200191508051906020019060200280838360005b8381101561029a578082015183820152602001610282565b50505050905001848103835286818151815260200191508051906020019060200280838360005b838110156102d95780820151838201526020016102c1565b50505050905001848103825285818151815260200191508051906020019060200280838360005b83811015610318578082015183820152602001610300565b50505050905001965050505050505060405180910390f35b341561033b57600080fd5b610343610d6d565b60405160208082528190810183818151815260200191508051906020019060200280838360005b8381101561038257808201518382015260200161036a565b505050509050019250505060405180910390f35b34156103a157600080fd5b6103ac600435610dd6565b604051600160a060020a03909116815260200160405180910390f35b34156103d357600080fd5b6103e7600160a060020a0360043516610dfe565b604051808060200180602001838103835285818151815260200191508051906020019060200280838360005b8381101561042b578082015183820152602001610413565b50505050905001838103825284818151815260200191508051906020019060200280838360005b8381101561046a578082015183820152602001610452565b5050505090500194505050505060405180910390f35b6101df610f83565b341561049357600080fd5b61049b61100a565b60405190815260200160405180910390f35b6000805b83518110156104fa5782600160a060020a03168482815181106104d057fe5b90602001906020020151600160a060020a031614156104f257600191506104ff565b6001016104b1565b600091505b5092915050565b60008061056d600380548060200260200160405190810160405280929190818152602001828054801561056257602002820191906000526020600020905b8154600160a060020a03168152600190910190602001808311610544575b5050505050336104ad565b151561057857600080fd5b835185511461058657600080fd5b600b54861461059457600080fd5b8585858560405180858152602001848051906020019060200280838360005b838110156105cb5780820151838201526020016105b3565b50505050905001838051906020019060200280838360005b838110156105fb5780820151838201526020016105e3565b50505050905001828051906020019060200280838360005b8381101561062b578082015183820152602001610613565b5050505090500194505050505060405190819003902060008181526004602052604090206002015490925060ff1615610663576108e4565b6106e160046000846000191660001916815260200190815260200160002060010180548060200260200160405190810160405280929190818152602001828054801561056257602002820191906000526020600020908154600160a060020a03168152600190910190602001808311610544575050505050336104ad565b15156108e4576000828152600460205260409020600190810180549091810161070a8382611010565b506000918252602090912001805473ffffffffffffffffffffffffffffffffffffffff191633600160a060020a03161790556003546002906000848152600460205260409020600101549190049011156108e457506000818152600460205260408120600201805460ff191660011790555b84518110156108d85760078054600181016107978382611010565b916000526020600020900160008784815181106107b057fe5b906020019060200201518254600160a060020a039182166101009390930a92830291909202199091161790555060088054600181016107ef8382611010565b9160005260206000209001600086848151811061080857fe5b90602001906020020151909155505060098054600181016108298382611010565b506000918252602090912042910155600a80546001810161084a8382611010565b9160005260206000209001600085848151811061086357fe5b9060200190602002015190915550859050818151811061087f57fe5b90602001906020020151600160a060020a03166108fc8583815181106108a157fe5b906020019060200201519081150290604051600060405180830381858888f1935050505015156108d057600080fd5b60010161077c565b8451600b805490910190555b505050505050565b6006546000908190819033600160a060020a039081169116141561091f57600384805161091d929160200190611039565b505b8360405180828051906020019060200280838360005b8381101561094d578082015183820152602001610935565b5050505090500191505060405180910390209250600360405180828054801561099f57602002820191906000526020600020905b8154600160a060020a03168152600190910190602001808311610981575b50509150506040519081900390209150828214156109bc57610acb565b610a3760056000856000191660001916815260200190815260200160002080548060200260200160405190810160405280929190818152602001828054801561056257602002820191906000526020600020908154600160a060020a03168152600190910190602001808311610544575050505050336104ad565b9050801515610acb576000838152600560205260409020805460018101610a5e8382611010565b506000918252602090912001805473ffffffffffffffffffffffffffffffffffffffff191633600160a060020a031617905560028451811515610a9d57fe5b600085815260056020526040902054919004901115610acb576003848051610ac9929160200190611039565b505b50505050565b610ad96110ad565b610ae16110ad565b610ae96110ad565b600080610af46110ad565b610afc6110ad565b610b046110ad565b60009450849350600160a060020a038a1615610b74578893505b600054841015610b6f5760008054600160a060020a038c16919086908110610b4257fe5b600091825260209091200154600160a060020a03161415610b64576001909401935b600190930192610b1e565b610b80565b60005489900394909401935b84604051805910610b8e5750595b9080825280602002602001820160405250925084604051805910610baf5750595b9080825280602002602001820160405250915084604051805910610bd05750595b90808252806020026020018201604052509050600094508893505b600054841015610d5d57600160a060020a038a1615610ca55760008054600160a060020a038c16919086908110610c1e57fe5b600091825260209091200154600160a060020a03161415610ca0576001805485908110610c4757fe5b906000526020600020900154828681518110610c5f57fe5b602090810290910101526002805485908110610c7757fe5b906000526020600020900154818681518110610c8f57fe5b602090810290910101526001909401935b610d52565b6000805485908110610cb357fe5b600091825260209091200154600160a060020a0316838681518110610cd457fe5b600160a060020a039092166020928302909101909101526001805485908110610cf957fe5b906000526020600020900154828681518110610d1157fe5b602090810290910101526002805485908110610d2957fe5b906000526020600020900154818681518110610d4157fe5b602090810290910101526001909401935b600190930192610beb565b9199909850909650945050505050565b610d756110ad565b6003805480602002602001604051908101604052809291908181526020018280548015610dcb57602002820191906000526020600020905b8154600160a060020a03168152600190910190602001808311610dad575b505050505090505b90565b6003805482908110610de457fe5b600091825260209091200154600160a060020a0316905081565b610e066110ad565b610e0e6110ad565b600080610e196110ad565b610e216110ad565b60009250600093505b600b54841015610e7b5760078054600160a060020a038916919086908110610e4e57fe5b600091825260209091200154600160a060020a03161415610e70576001909201915b600190930192610e2a565b82604051805910610e895750595b9080825280602002602001820160405250915082604051805910610eaa5750595b9080825280602002602001820160405250905060009250600093505b600b54841015610f775760078054600160a060020a038916919086908110610eea57fe5b600091825260209091200154600160a060020a03161415610f6c576008805485908110610f1357fe5b906000526020600020900154828481518110610f2b57fe5b602090810290910101526009805485908110610f4357fe5b906000526020600020900154818481518110610f5b57fe5b602090810290910101526001909201915b600190930192610ec6565b90969095509350505050565b6000805460018101610f958382611010565b506000918252602090912001805473ffffffffffffffffffffffffffffffffffffffff191633600160a060020a031617905560018054808201610fd88382611010565b5060009182526020909120349101556002805460018101610ff98382611010565b506000918252602090912042910155565b600b5481565b815481835581811511611034576000838152602090206110349181019083016110bf565b505050565b82805482825590600052602060002090810192821561109d579160200282015b8281111561109d578251825473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a039190911617825560209290920191600190910190611059565b506110a99291506110d9565b5090565b60206040519081016040526000815290565b610dd391905b808211156110a957600081556001016110c5565b610dd391905b808211156110a957805473ffffffffffffffffffffffffffffffffffffffff191681556001016110df5600a165627a7a7230582080204de5c86ad5f7a7ff60a40ee609308104cef33209c881c4f162330fd1481b0029"

    var inNonce = chain3.scs.getNonce(appChainAddress,baseaddr);

    console.log("Src nonce:", inNonce, " RandDrop AppChain TokenSupply", tokensupply);

    // set TX flag to '0x3' for deploy contract on the AppChain
    var mchash = sendAppChainTx(baseaddr,basepsd,appChainAddress,viaAddress, tokensupply, dappbasepublicBytecode, inNonce,'0x3')
    console.log("dappbase TX HASH:", mchash);

    // Check the DAPP status after deploy, need to wait for several blocks
    // If successful, you should see the new DAPP address
    waitForAppChainBlocks(appChainAddress,2);

    console.log("Should see DAPP list on :",appChainAddress, "\n at: ", chain3.scs.getDappAddrList(appChain.address));

    return;
    // Deploy the DappBase contract to enable the Dapp deployment on the AppChain
    // solc 0.4.24 and 0.4.26 version
    var content = fs.readFileSync(inDappFile, 'utf8');

    output = solc.compile(content, 1);

    var key = Object.keys(output.contracts);

    //this is the object contains the code and ABIs
    var ctt = output.contracts[key];

    if(ctt == null){
      console.log("Contract CTT is empty1");
      return;
    }

    var bytecode = "0x"+ctt.bytecode;
    var mcabi = JSON.parse(ctt.interface);

    // Prepare and Send TX to VNODE to deploy the DAPP on the AppChain;
    //Deploy the DappBase with correct parameters
    var inNonce = chain3.scs.getNonce(appChainAddress,baseaddr);

    console.log("Src nonce:", inNonce, "AppChain TokenSupply", tokensupply);


    var mchash = sendAppChainTx(baseaddr,basepsd,appChainAddress,viaAddress, tokensupply, bytecode,inNonce,'0x3')
    console.log("dappbase TX HASH:", mchash);

  // Check the DAPP status after deploy, need to wait for several blocks
  // If successful, you should see the new DAPP address
  waitForAppChainBlocks(appChainAddress,5);

  console.log("Should see DAPP list on :",appChainAddress, "\n at: ", chain3.scs.getDappAddrList(appChainAddress));

	console.log("all Done!!!");

// Functions to use in the process
// Send TX with unlock account and Sharding Flag set
function sendAppChainTx(baseaddr,basepsd, subchainaddr, via, amount,code,n,sf)
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
  let preBlk = 0;
  // Incase the return is not valid, use 0 instead of NAN
  if ( startBlk > 0 ){
    let preBlk = startBlk;
  }else{
        startBlk = 0;
          let preBlk = startBlk;
  }

  console.log("Waiting for blocks to confirm the TX... currently at block " + startBlk);
  while (true) {
    let curblk = chain3.scs.getBlockNumber(inMcAddr);
    if (curblk > startBlk + innum) {
      console.log("Waited for " + innum + " blocks!");
      break;
    }
    if ( curblk > preBlk){
      console.log("Waiting for blocks to confirm the TX... currently at block " + curblk);
      preBlk = curblk;
    }else{
        console.log("...");
    }
    
    sleep(3000000);
  }
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
}
