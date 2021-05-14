## [墨客中文发布信息](README.md)

## MOAC Fuxi 2.x 

### Fuxi v2.1.0:
2021/05/14

Two reminders for the developers using Ethereum web3.js library on MOAC net work:
1. The gas cost for one simple transaction, not contract call, on MOAC network is 1000 instead of 21000 on Ethereum network. But web3.js still requires the input gasLimit over 21000. The actual cost is 1000 gas.

2. When using web3.eth.accounts.signTransaction to sign a transaction, if you use web3.eth.sendSignedTransaction(signedTx.rawTransaction) and get a returned transactionHash. This transactionHash is the same as Ethereum network, but not the MOAC network. This is because MOAC network has extra fields to perform layer 2 transactions. To get the correct transactionHash value, please use transactionHash in the TX receipt instead.

### Fuxi v2.1.0:
2021/05/12

This release runs on mainnet and contains all the updates from Fuxi 2.0.5.
Mainnet will be updated after block height 6780000, estimated fork time is on Monday, May 18th, 2021.

Enabled the web3 RPC commands and transactions can be send to MOAC basechain/mother chain with Ethereum EIP155 signed methods.

Added the precompiled contract for BLS12-381 curve operations as suggested on Ethereum EIP-2537(https://eips.ethereum.org/EIPS/eip-2537). This new feature will enable the operations such as BLS signature verification and perform SNARKs verifications on MOAC network, which are required for future cross-chain operations.

Fixed the issue of parameters in eth_subscribe method, the VNODE client supports all four parameters in eth_subscribe method:
* newHeads
* logs
* newPendingTransactions
* syncing

**Download links**

VNODE client only

* [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/v2.1.0/fuxi2.1.0-stable.linux.tar.gz)
* [Binary package for Windows](https://github.com/MOACChain/moac-core/releases/download/v2.1.0/fuxi2.1.0-stable.win.zip)
* [Binary package for MAC OS](https://github.com/MOACChain/moac-core/releases/download/v2.1.0/fuxi2.1.0-stable.mac.tar.gz)

### Fuxi v2.0.7:
2021/05/09

This release runs on testnets only and fixed the issue of parameters in eth_subscribe method.
Now the VNODE will support all four parameters in eth_subscribe method:
* newHeads
* logs
* newPendingTransactions
* syncing

To enable the JSON-RPC notifications, VNODE client needs to start with ws options.
For example, using the following parameters instead of "rpc".

``````
moac --testnet --ws --wsaddr 0.0.0.0 --wsport 8546 --wsapi "chain3,mc,net,db,personal" --wsorigins "*"
``````

Example code:

``````
const Web3 = require('web3')
const web3 = new Web3("wss://localhost:8546")

function newBlockHeaders(){
  var subscription = eth.subscribe('newBlockHeaders', function(error, result){
      
        if (!error){
            console.log(result);
        }else{
            console.log(error);
        }
    })
    .on("data", function(transaction){
        console.log(`transaction:${transaction}`);
    })
}

// Start listening to different events
newBlockHeaders();

``````


**Download links**

VNODE client only

* [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/v2.0.7/fuxi2.0.7-beta.linux.tar.gz)
* [Binary package for Windows](https://github.com/MOACChain/moac-core/releases/download/v2.0.7/fuxi2.0.7-beta.win.zip)
* [Binary package for MAC OS](https://github.com/MOACChain/moac-core/releases/download/v2.0.7/fuxi2.0.7-beta.mac.tar.gz)

### Fuxi v2.0.6:
2021/04/28

This release runs on testnets only and the new features will be enabled after block height 5330000 on the testnet. 
This release added the precompiled contract for BLS12-381 curve operations as suggested on Ethereum EIP-2537(https://eips.ethereum.org/EIPS/eip-2537). This new feature will enable the operations such as BLS signature verification and perform SNARKs verifications on MOAC network, which are required for future cross-chain operations.

**Download links**

VNODE client only

* [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/v2.0.6/fuxi2.0.6-beta.linux.tar.gz)
* [Binary package for Windows](https://github.com/MOACChain/moac-core/releases/download/v2.0.6/fuxi2.0.6-beta.win.zip)
* [Binary package for MAC OS](https://github.com/MOACChain/moac-core/releases/download/v2.0.6/fuxi2.0.6-beta.mac.tar.gz)

### Fuxi v2.0.5:
2021/04/18

This version runs on testnets only and will be enabled after block height 5260000 on testnet. It enables the web3 RPC commands and transactions can be send to MOAC basechain/mother chain with Ethereum EIP155 signed methods. An example is provided in send_web3.js.

**Download links**

VNODE client only

* [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/v2.0.5/fuxi2.0.5-beta.linux.tar.gz)
* [Binary package for Windows](https://github.com/MOACChain/moac-core/releases/download/v2.0.5/fuxi2.0.5-beta.win.zip)
* [Binary package for MAC OS](https://github.com/MOACChain/moac-core/releases/download/v2.0.5/fuxi2.0.5-beta.mac.tar.gz)

### Fuxi v2.0.4:
2021/04/06

This release fixed the error when VNODE read block states and improve the stability of VNODE, especially while mining.
We stronglly suggested all the mining nodes to upgrade to this version.
We also suggested all the mining nodes to increase their block gasLimit to 18,000,000. To do this, please setup the targetgaslimit parameter when starting the MOAC VNODE:
```
moac --targetgaslimit 18000000
```

**Download links**

VNODE client only

* [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/v2.0.4/fuxi2.0.4-stable.linux.tar.gz)
* [Binary package for Windows](https://github.com/MOACChain/moac-core/releases/download/v2.0.4/fuxi2.0.4-stable.win.zip)
* [Binary package for MAC OS](https://github.com/MOACChain/moac-core/releases/download/v2.0.4/fuxi2.0.4-stable.mac.tar.gz)

### Fuxi v2.0.3:
2021/03/25

The VNODE is upgraded to defuse the difficulty bomb on mainnet at block height 6462000.
We stronglly suggested all the mining nodes to increase their block gasLimit to 18,000,000. To do this, please setup the targetgaslimit parameter when starting the MOAC VNODE:
```
moac --targetgaslimit 18000000
```

**Download links**

VNODE client only

* [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/v2.0.3/fuxi2.0.3-stable.linux.tar.gz)
* [Binary package for Windows](https://github.com/MOACChain/moac-core/releases/download/v2.0.3/fuxi2.0.3-stable.win.zip)
* [Binary package for MAC OS](https://github.com/MOACChain/moac-core/releases/download/v2.0.3/fuxi2.0.3-stable.mac.tar.gz)

### Fuxi v2.0.2:
2021/03/18

This version runs on testnets only. 
The VNODE is upgraded to defuse the difficulty bomb on testnet at block 5042000.

**Download links**

VNODE client only

* [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/v2.0.2/fuxi2.0.2-test.linux.tar.gz)
* [Binary package for Windows](https://github.com/MOACChain/moac-core/releases/download/v2.0.2/fuxi2.0.2-test.win.zip)
* [Binary package for MAC OS](https://github.com/MOACChain/moac-core/releases/download/v2.0.2/fuxi2.0.2-test.mac.tar.gz)

### Fuxi v2.0.1:
2020/02/28

This release contains VNODE only and can be used on mainnet and testnet.
This release upgrade the VNODE VM to support the Solidity 0.8 compiler. 
The MOAC mainnet will be upgrade at block number 6435000, estimate time is on Wednesday, March 5th, 2021.
The new VNODE can support the opcode as the following:
* SHL
* SHR
* SAR
* EXTCODEHASH
* CHAINID
* SELFBALANCE
* BEGINSUB
* RETURNSUB
* JUMPSUB
* CREATE2

We stronglly suggested all the mining nodes to increase their block gasLimit to 18,000,000. To do this, please setup the targetgaslimit parameter when starting the MOAC VNODE:
```
moac --targetgaslimit 18000000
```

This will allow the VNODE supporting more advanced smart contracts and improve the performance of MOAC blockchain. 
If the VNODE is not mining, then you don't need to setup the targetgaslimit parameter.

**Download links**

VNODE client only

* [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/v2.0.1/fuxi2.0.1-stable.linux.tar.gz)
* [Binary package for Windows](https://github.com/MOACChain/moac-core/releases/download/v2.0.1/fuxi2.0.1-stable.win.zip)
* [Binary package for MAC OS](https://github.com/MOACChain/moac-core/releases/download/v2.0.1/fuxi2.0.1-stable.mac.tar.gz)

### Fuxi v2.0.0:
2020/12/30

This release contains VNODE only and only used on the testnet.
This release upgrade the VNODE VM to support the Solidity 0.8 compiler. 
The MOAC testnet will be upgrade at block number 4900000, estimate time is on Wednesday, Dec 30th, 2020.
The new VNODE can support the opcode as the following:
* SHL
* SHR
* SAR
* EXTCODEHASH
* CHAINID
* SELFBALANCE
* BEGINSUB
* RETURNSUB
* JUMPSUB
* CREATE2

**Download links**

VNODE client only

* [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/v2.0.0/fuxi2.0.0-test.linux.tar.gz)
* [Binary package for Windows](https://github.com/MOACChain/moac-core/releases/download/v2.0.0/fuxi2.0.0-test.win.zip)
* [Binary package for MAC OS](https://github.com/MOACChain/moac-core/releases/download/v2.0.0/fuxi2.0.0-test.mac.tar.gz)

## MOAC Nuwa 1.x 

### Nuwa v1.1.5:
2020/09/10

Nuwa v1.1.5 is a release for the mainnet to support the RandDrop AppChain. 
Both VNODE and SCS clients are updated to better support RandDrop AppChain.

This release contains the following updates:

* VNODE added admin.getSubnetP2PList function and JSON-RPC methods；
* VNODE fixed the Subnet P2P2 network bug that caused unusual exit;
* Other bug fixes;

More info can be found at the most recent documentation:
https://moac-docs.readthedocs.io/en/latest

Testnet moac can be get from：https://faucet.moacchina.com/

**Download links**

VNODE+SCS client

* [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/v1.1.5/nuwa1.1.5.linux.tar.gz)
* [Binary package for Windows](https://github.com/MOACChain/moac-core/releases/download/v1.1.5/nuwa1.1.5.win.zip)
* [Binary package for MAC OS](https://github.com/MOACChain/moac-core/releases/download/v1.1.5/nuwa1.1.5.mac.tar.gz)

### Nuwa v1.1.4:
2020/07/06

Nuwa v1.1.4 is a release for the mainnet to support new AppChain type RandDrop. 
Both VNODE and SCS clients are updated to support RandDrop AppChain.

This release contains the following updates:

* Improved the stability under high TPS for the RandDrop AppChain;
* Updated the VssBase.sol to fix the bug in the previous tests;
* Update the deploy scripts and added an example of crossing chain operations;
* Other bug fixes;


More info can be found at the most recent documentation:
https://moac-docs.readthedocs.io/en/latest

Testnet moac can be get from：https://faucet.moacchina.com/

**Download links**

RandDrop contract source files and node.js scripts.

* [ASM cross chain](https://github.com/MOACChain/moac-core/tree/master/randdrop/asm)

VNODE+SCS client

* [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/v1.1.4/nuwa1.1.4.linux.tar.gz)
* [Binary package for Windows](https://github.com/MOACChain/moac-core/releases/download/v1.1.4/nuwa1.1.4.win.zip)
* [Binary package for MAC OS](https://github.com/MOACChain/moac-core/releases/download/v1.1.4/nuwa1.1.4.mac.tar.gz)

### Nuwa v1.1.3: 
2020/05/26

Nuwa v1.1.3 is a version used on testnet only. 
Both VNODE and SCS clients are updated to support RandDrop AppChain.

This release contains the following updates:

* Improved the stability under high TPS for the RandDrop AppChain;
* Added the random number info in the getBlock JSON object;
* Updated the VssBase.sol;
* Updated example contract test.sol;
* Update the deploy scripts;
* Other bug fixes;

More info can be found at the most recent documentation:
https://moac-docs.readthedocs.io/en/latest

Testnet moac can be get from：https://faucet.moacchina.com/

**Download links**

VNODE+SCS client

* [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/v1.1.3/nuwa1.1.3.linux.tar.gz)
* [Binary package for Windows](https://github.com/MOACChain/moac-core/releases/download/v1.1.3/nuwa1.1.3.win.zip)
* [Binary package for MAC OS](https://github.com/MOACChain/moac-core/releases/download/v1.1.3/nuwa1.1.3.mac.tar.gz)


### Nuwa v1.1.2: 
2020/05/04

Nuwa v1.1.2 is a version used for testnet only. Both VNODE and SCS clients are updated to use RandDrop AppChain. 
RandDrop uses BLS signatures, and merges signature fragments that support multiple nodes from the consensus layer to obtain threshold signatures, and generates random numbers based on this. Random numbers can be directly called in RandDrop's smart contract. The advantage of RandDrop random number is that it can eliminate the operability of a single node to the final signature, which is more secure and reliable. At the same time, RandDrop's information volume is O (n), which has a greater advantage than other similar random number blockchains.

More info can be found at the most recent documentation:
https://moac-docs.readthedocs.io/en/latest

Testnet moac can be get from：https://faucet.moacchina.com/

**Download links**

VNODE+SCS client

* [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/v1.1.1/nuwa1.1.1.linux.tar.gz)
* [Binary package for Windows](https://github.com/MOACChain/moac-core/releases/download/v1.1.1/nuwa1.1.1.win.zip)
* [Binary package for MAC OS](https://github.com/MOACChain/moac-core/releases/download/v1.1.1/nuwa1.1.1.mac.tar.gz)

### Nuwa v1.1.1: 
2020/03/15

Nuwa v1.1.1 is a version used for testnet only. The major updates are in the SCS server. SCS server provides a new console that is similar to VNODE console so users can interact with SCS server.

There is a new package called appchain in the console. The appchain has an internal address property to be set with setAddress() method and it provides similar methods as the scs package except no need to input the AppChain address as the 1st parameter.

More info can be found at the most recent documentation:
https://moac-docs.readthedocs.io/en/latest

Testnet moac can be get from：https://faucet.moacchina.com/

**Download links**

VNODE+SCS client

* [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/v1.1.1/nuwa1.1.1.linux.tar.gz)
* [Binary package for Windows](https://github.com/MOACChain/moac-core/releases/download/v1.1.1/nuwa1.1.1.win.zip)
* [Binary package for MAC OS](https://github.com/MOACChain/moac-core/releases/download/v1.1.1/nuwa1.1.1.mac.tar.gz)


### Nuwa v1.1.0: 
2020/02/08

Nuwa v1.1.0 is the first release in 2020. It contains all the updates in the v1.0.x version and can be used on both mainnet and testnet. It improved the P2P connections between trusted VNODE peers and fully support the ProcWind AppChain.

**Download links**

VNODE+SCS client

* [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/v1.1.0/nuwa1.1.0.linux.tar.gz)
* [Binary package for Windows](https://github.com/MOACChain/moac-core/releases/download/v1.1.0/nuwa1.1.0.win.zip)
* [Binary package for MAC OS](https://github.com/MOACChain/moac-core/releases/download/v1.1.0/nuwa1.1.0.mac.tar.gz)

### Nuwa v1.0.12: 
2019/12/23

Nuwa v1.0.12 runs for testnet only.

1. Supports Solidity 0.5.12 contracts on AppChain, this requires deploying the DappBasePublic_0.5.sol or 
DappBasePrivate_0.5.sol with solidity compiler 0.5.12 and above;
2. Added JSON-RPC method scs_listening, fixed the scs_getBalance method when displaying large numbers with AppChain;
3. The contracts used to generate ProcWind AppChains are updated to the latest version with ASM and AST supports in nuwa1.0.12.ASM.tar.gz and nuwa1.0.12.AST.tar.gz;
4. Added scripts to close AppChain and perform cross chain functions between AppChain and BaseChain;

More info can be found at:
https://moac-docs.readthedocs.io/en/latest

testnet API server：http://139.198.126.104:8080
testnet access token can be get with the following login information:
username：test
password：123456
Testnet moac can be get from：https://faucet.moacchina.com/

**Download links**

VNODE+SCS client

* [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/v1.0.12/nuwa1.0.12.linux.tar.gz)
* [Binary package for Windows](https://github.com/MOACChain/moac-core/releases/download/v1.0.12/nuwa1.0.12.win.zip)
* [Binary package for MAC OS](https://github.com/MOACChain/moac-core/releases/download/v1.0.12/nuwa1.0.12.mac.tar.gz)


### Nuwa v1.0.11: 
2019/09/26

Nuwa v1.0.11 runs on mainnet and testnet.

Allow multiple contracts to be deployed on one MicroChain;
Supports SCS RPCdebug APIs;
Supports JSON-RPC methods in SCS to work with MicroChain and DAPPs;

The contracts used to generate MicroChains are also updated to the latest version with ASM and AST supports in nuwa1.0.11.ASM.tar.gz and nuwa1.0.11.AST.tar.gz;

Updated scripts to launch the MicroChains for both ASM and AST,
Added scripts to deploy DappBase and Dapp,;
Added script to call MicroChain and DappBase functions;
More info can be found on the latest documentation
More info can be found at:
https://moac-docs.readthedocs.io/en

There are APIs and SDKs to use with the MicroChain.
More info can be found on the API documentation:
https://moac-docs.readthedocs.io/en/latest/restapi/introduction.html#access-control

testnet API server：http://139.198.126.104:8080
testnet access token can be get with the following login information:
username：test
password：123456
Testnet moac can be get from：https://faucet.moacchina.com/

**Download links**

VNODE+SCS client

* [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/v1.0.11/nuwa1.0.11.linux.tar.gz)
* [Binary package for Windows](https://github.com/MOACChain/moac-core/releases/download/v1.0.11/nuwa1.0.11.win.zip)
* [Binary package for MAC OS](https://github.com/MOACChain/moac-core/releases/download/v1.0.11/nuwa1.0.11.mac.tar.gz)
* [Binary package for ARM Linux](https://github.com/MOACChain/moac-core/releases/download/v1.0.11/nuwa1.0.11.arm.tar.gz)


### LICENSE update and AppChain code is uploaded
2019/08/29
We updated the LICENSE of AppChain contracts to MIT LICENSE so we can provide better services to our customers and commercial partners.
We also uploaded the source code for ProcWind AppChain to the procwind directory. This is to replace the previous contractsamples

### Nuwa v1.0.10: 
2019/07/12

Nuwa v1.0.10 runs on testnets only. It is used to test new algorithms on MicroChains:

Allow multiple contracts to be deployed on one MicroChain;
Enable new data structure supports in SCS RPCdebug APIs;
Enable new JSON-RPC methods in SCS to work with MicroChain and DAPPs;
Update the README files in VNODE and added README file in SCS.

The contracts used to generate MicroChains are also updated to the latest version with ASM and AST supports in nuwa1.0.10.ASM.tar.gz and nuwa1.0.10.AST.tar.gz;
Also from this release, we call MicroChain as AppChain and MotherChain as BaseChain.
Updated scripts to launch the MicroChains for both ASM and AST,
Added scripts to deploy DappBase and Dapp,;
Added script to call MicroChain and DappBase functions;
More info can be found on the latest documentation
More info can be found at:
https://moac-docs.readthedocs.io/en/latest/subchain

There are APIs and SDKs to use with the MicroChain.
More info can be found on the API documentation:
https://moac-docs.readthedocs.io/en/latest/restapi/introduction.html#access-control

testnet API server：http://139.198.126.104:8080
testnet access token can be get with the following login information:
username：test
password：123456
Testnet moac can be get from：https://faucet.moacchina.com/

**Download links**

VNODE+SCS client

* [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/v1.0.10/nuwa1.0.10.linux.tar.gz)
* [Binary package for Windows](https://github.com/MOACChain/moac-core/releases/download/v1.0.10/nuwa1.0.10.win.zip)
* [Binary package for MAC OS](https://github.com/MOACChain/moac-core/releases/download/v1.0.10/nuwa1.0.10.mac.tar.gz)
* [Binary package for ARM Linux](https://github.com/MOACChain/moac-core/releases/download/v1.0.10/nuwa1.0.10.arm.tar.gz)

Support contracts and scripts to create the MicroChain

* [ASM contracts and script](https://github.com/MOACChain/moac-core/releases/download/v1.0.10/nuwa1.0.10.ASM.tar.gz)
* [AST contracts and script](https://github.com/MOACChain/moac-core/releases/download/v1.0.10/nuwa1.0.10.AST.tar.gz)

### Nuwa v1.0.9: 

Nuwa v1.0.9 is the version runs on both mainnet and testnet to support Multiple contracts on MicroChains:

1.  Allow multiple contracts to be deployed on one MicroChain;
2.  Enable new data structure supports in SCS RPCdebug APIs;
3.  Enable new JSON-RPC methods in SCS to work with MicroChain and DAPPs;
4.  Optimized txpool handling of MicroChain flushing process.
5.  Updated bootnodes to improve the P2P connections;
6.  The contracts used to generate MicroChains are also updated to the latest version with ASM and AST supports;
7.  Added scripts to launch the MicroChains for both ASM and AST;

More info can be found on the latest [documentation](https://moac-docs.readthedocs.io/en/latest/index.html).

There are APIs and SDKs to use with the MicroChain.
More info can be found on the [API documentation](https://moac-docs.readthedocs.io/en/latest/restapi/index.html).
To get the Access Token to the REST-API, please contact: moacapi@mossglobal.net

**Download links**

VNODE+SCS client

* [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/1.0.9/nuwa1.0.9.linux.tar.gz)
* [Binary package for Windows](https://github.com/MOACChain/moac-core/releases/download/1.0.9/nuwa1.0.9.win.zip)
* [Binary package for MAC OS](https://github.com/MOACChain/moac-core/releases/download/1.0.9/nuwa1.0.9.mac.tar.gz)
* [Binary package for ARM Linux](https://github.com/MOACChain/moac-core/releases/download/1.0.9/nuwa1.0.9.arm.tar.gz)

Support contracts and scripts to create the MicroChain

* [ASM contracts and script](https://github.com/MOACChain/moac-core/releases/download/1.0.9/nuwa1.0.9.ASM.tar.gz)
* [AST contracts and script](https://github.com/MOACChain/moac-core/releases/download/1.0.9/nuwa1.0.9.AST.tar.gz)

### Nuwa v1.0.8: 

Nuwa v1.0.8 only runs on testnet and is used to test the new Multiple contracts on MicroChain:

1.  Allow multiple contracts to be deployed on one MicroChain;
2.  Enable new RPCdebug methods in SCS to work with MicroChain and DAPPs;
3.  Enable new JSON-RPC methods in SCS to work with MicroChain and DAPPs;
4.  Added more bootnodes to improve the P2P connections;

MicroChain contracts

The example contracts are used to form a MicroChain with capability to support Atomic Token Swap of ERC20 token.

* erc20.sol: Example contract to generate an ERC20 token on MOAC mother chain which can be used to swap with tokens on the MicroChain. This contract used a fixed supply for the token and user can change the name/symbol of the token before deploy;
* SubChainProtocolBase.sol: Contract with protocol to register SCSs;
* VnodeProtocolBase.sol: Vnode Protocol contract for VNODES to enable the multiple contracts.
* SubChainBase.sol: Subchain contract for SCSs to form the MicroChain and hold multiple contracts;
* Dappbase.sol: Contract required to first deploy on the MicroChain and enable multiple contracts deployment;

**Download links**

VNODE+SCS client

* [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/1.0.8/nuwa1.0.8.linux.tar.gz)
* [Binary package for Windows](https://github.com/MOACChain/moac-core/releases/download/1.0.8/nuwa1.0.8.win.zip)
* [Binary package for MAC OS](https://github.com/MOACChain/moac-core/releases/download/1.0.8/nuwa1.0.8.mac.tar.gz)
* [Binary package for ARM Linux](https://github.com/MOACChain/moac-core/releases/download/1.0.8/nuwa1.0.8.arm.tar.gz)

Support contracts to form the MicroChain

* [ERC20 sample](https://github.com/MOACChain/moac-core/releases/download/v1.0.8/erc20.sol)
* [VnodeProtocolBaseAST.sol](https://github.com/MOACChain/moac-core/releases/download/v1.0.8/VnodeProtocolBase.sol)
* [SubChainProtocolBase.sol](https://github.com/MOACChain/moac-core/releases/download/1.0.8/SubChainProtocolBase.sol)

MicroChain contract

* [SubChainBase](https://github.com/MOACChain/moac-core/releases/download/1.0.8/SubChainBase.sol)

DAPP control contract

* [dappbase.sol](https://github.com/MOACChain/moac-core/releases/download/1.0.8/DappBase.sol)

### Nuwa v1.0.7: 

Nuwa v1.0.7 is a package released to use cross chain service between MotherChain and MicroChain. 
It optimized the MicroChain service with:
1.  Enable the fast deposit to MicroChain from MotherChain and increase the flush limit larger than 500;
2. Optimized the via reward model;
3. Added express Smart Contract channel for white list;
4. Fixed the bug that MicroChain flush stop before DAPP deployed;
5. Provide a Atomic Swap of Moac (ASM) in addition to Atomic Swap of Token (AST).Enabled the atomic swap of tokens and MOACs between MicroChains and MotherChain;
6. Added compiled binaries for ARM linux.

For VNODE users:
* If you want to use the cross-chain atomic swap, you need to upgrade the VNODE software to this version v1.0.7.
* If you only mining or monitoring the network, you don't have to upgrade your VNODE software.

For SCS users:
* Please upgrade to this version to allow cross-chain atomic swap functions.
* Please also use the MicroChain contracts provided with v1.0.7.

VNODE

* Enable the cross-chain atomic swap of tokens and MOACs between MicroChains and MotherChain;
* Optimized the via reward model;
* Added express Smart Contract channel for white list;

SCS

* Enable the cross-chain atomic swap of Moacs between MicroChains and MotherChain;
* Fixed the bug that MicroChain flush stop before DAPP deployed;


**Download links**

VNODE+SCS client

* [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/v1.0.7/nuwa1.0.7.linux.tar.gz)
* [Binary package for Windows](https://github.com/MOACChain/moac-core/releases/download/v1.0.7/nuwa1.0.7.win.zip)
* [Binary package for MAC OS](https://github.com/MOACChain/moac-core/releases/download/v1.0.7/nuwa1.0.7.mac.tar.gz)
* [Binary package for ARM Linux](https://github.com/MOACChain/moac-core/releases/download/v1.0.7/nuwa1.0.7.arm.tar.gz)

MicroChain contracts v1.0.7

Atomic Swap of MOAC with MicroChain tokens

* [SubChainBaseASM](https://github.com/MOACChain/moac-core/releases/download/v1.0.7/SubChainBaseASM.sol)
* [VnodeProtocolBaseASM](https://github.com/MOACChain/moac-core/releases/download/v1.0.7/VnodeProtocolBaseASM.sol)

Atomic Swap of ERC20 token with MicroChain tokens

* [ERC20 sample](https://github.com/MOACChain/moac-core/releases/download/v1.0.7/erc20.sol)
* [SubChainBaseAST](https://github.com/MOACChain/moac-core/releases/download/v1.0.7/SubChainBaseAST.sol)
* [VnodeProtocolBaseAST.sol](https://github.com/MOACChain/moac-core/releases/download/v1.0.7/VnodeProtocolBaseAST.sol)

MicroChain protocol 
* [SubChainProtocolBase.sol](https://github.com/MOACChain/moac-core/releases/download/v1.0.7/SubChainProtocolBase.sol)

Example DAPP contract using Atomic Swap of MOAC/tokens
* [dappbase.sol](https://github.com/MOACChain/moac-core/releases/download/v1.0.6/dappbase.sol)

### Nuwa v1.0.6: 

Nuwa v1.0.6 is a package released for both mainnet and testnet. 
It enable the cross-chain atomic swap of tokens between MicroChains and MotherChain.

For VNODE users:
* If you want to use the cross-chain atomic swap, you need to upgrade the VNODE software to this version v1.0.6.
* If you only mining or monitoring the network, you don't have to upgrade your VNODE software.

For SCS users:
* Please upgrade to this version to allow cross-chain atomic swap functions.
* Please also use the MicroChain contracts provided with v1.0.6.

VNODE

* Enable the cross-chain atomic swap of tokens between MicroChains and MotherChain;
* Fixed the issues found in the v1.0.5;

SCS

* Enable the cross-chain atomic swap of tokens between MicroChains and MotherChain;
* Support proxy server cache and added NotifySyncEvent in proxy server;


**Download links**

VNODE+SCS client

* [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/v1.0.6/nuwa1.0.6.linux.tar.gz)
* [Binary package for Windows](https://github.com/MOACChain/moac-core/releases/download/v1.0.6/nuwa1.0.6.win.zip)
* [Binary package for MAC OS](https://github.com/MOACChain/moac-core/releases/download/v1.0.6/nuwa1.0.6.mac.tar.gz)

MicroChain contracts v1.0.6

* [SubChainProtocolBase.sol](https://github.com/MOACChain/moac-core/releases/download/v1.0.6/SubChainProtocolBase.sol)
* [VnodeProtocolBase.sol](https://github.com/MOACChain/moac-core/releases/download/v1.0.6/VnodeProtocolBase.sol)
* [SubChainBaseAST.sol](https://github.com/MOACChain/moac-core/releases/download/v1.0.6/SubChainBaseAST.sol)
* [dappbase.sol](https://github.com/MOACChain/moac-core/releases/download/v1.0.6/dappbase.sol)

### Nuwa v1.0.5: 

Nuwa v1.0.5 is a package released for both mainnet and testnet. It enable all the functionality of MicroChain and fixed a few issues discovered during the test.
It provides JSON-RPC commands for the SCS server.

For VNODE users:
* If you want to become a VNODE proxy and join MicroChain mining, you need to upgrade the VNODE software to this version v1.0.5.
* If you only mining or monitoring the network, you don't need to upgrade your VNODE software.

For SCS users:
* Please upgrade to this version as soon as possible to allow MicroChain usage.
* Please also use the MicroChain contracts provided with v1.0.5.

VNODE

* Enabled the whitelist for Microchains in the mainnet;
* Increased SubChainBase contract functions;
* Fixed the issues found in the test process;

SCS

* Fixed the bugs in HandleProposalDistribute and getCurNodeList  functions;
* Modified the way to get account nonce;
* In command line flags, changed 'rpc1' to 'rpcdebug', 'rpc2' to 'rpc';
* Used 'rpccorsdomain' flag to control the domains from which to accept cross origin requests;


**Download links**

VNOD + SCS client v1.0.5

* [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/v1.0.5/nuwa1.0.5.linux.tar.gz)
* [Binary package for Windows](https://github.com/MOACChain/moac-core/releases/download/v1.0.5/nuwa1.0.5.win.zip)
* [Binary package for MAC OS](https://github.com/MOACChain/moac-core/releases/download/v1.0.5/nuwa1.0.5.mac.tar.gz)

MicroChain contracts v1.0.5

* [SubChainProtocolBase](https://github.com/MOACChain/moac-core/releases/download/v1.0.5/SubChainProtocolBase.sol)
* [VnodeProtocolBase](https://github.com/MOACChain/moac-core/releases/download/v1.0.5/VnodeProtocolBase.sol)
* [SubChainBase](https://github.com/MOACChain/moac-core/releases/download/v1.0.5/SubChainBase.sol)

### Nuwa 1.0.4:

Release Date: 10/31/2018

This release is for testnet only.
It fixed a few issues discovered during the test.
It provides JSON-RPC commands for the SCS server in addition to nuwa1.0.3 RPC commands.
A video tutorial can be found on MOAC youtube channel.
For Linux and Windows platform, we provided both 386 and amd64 compilations.

VNODE

* Discarded the vnode address error in vnodeconfig.json when scsservice is false;
* NotifiedSCS only for mining SCS;
* Fixed the issues found in the flush process;

SCS

* Fixed an "out of gas" error when calling contract function using JSON-RPC calls
* Fixed some issues found in the flush process;
* Provided a new command options, user can use -h to see the new options ;
* Added JSON-RPC rpc interfaces with new RPC commands;


**Download links**

VNODE + SCS client

* [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/v1.0.4/nuwa1.0.4.linux.tar.gz)
* [Binary package for Windows](https://github.com/MOACChain/moac-core/releases/download/v1.0.4/nuwa1.0.4.win.zip)
* [Binary package for MAC OS](https://github.com/MOACChain/moac-core/releases/download/v1.0.4/nuwa1.0.4.mac.tar.gz)


### Nuwa 1.0.3:

Release Date: 09/29/2018

This release is for testnet only.
It fixed a few issues discovered during our pressure test on the microchain and implement new RPC commands for the SCS server.

We also update the MicroChain protocol contracts. Please use the new contracts with the updated servers.

**Download links**

VNODE + SCS client

* [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/v1.0.3/nuwa1.0.3.ubuntu.tar.gz)
* [Binary package for Windows](https://github.com/MOACChain/moac-core/releases/download/v1.0.3/nuwa1.0.3.win.zip)
* [Binary package for MAC OS](https://github.com/MOACChain/moac-core/releases/download/v1.0.3/nuwa1.0.3.mac.tar.gz)

MicroChain contracts v1.0.3

* [SubChainProtocolBase](https://github.com/MOACChain/moac-core/releases/download/v1.0.3/SubChainProtocolBase.sol)
* [VnodeProtocolBase](https://github.com/MOACChain/moac-core/releases/download/v1.0.3/VnodeProtocolBase.sol)
* [SubChainBase](https://github.com/MOACChain/moac-core/releases/download/v1.0.3/SubChainBase.sol)


### FileStorm:
Release Date: 08/27/2018

Added some small enhancements.
[FileStorm 1.0.1](https://github.com/MOACChain/moac-core/releases/download/1.0.1/filestorm1.0.1.tar)

Use [deploy.js](https://github.com/MOACChain/moac-core/releases/download/1.0.1/deploy.js) to create one vnode and 3 (or more) scs.

Release Date: 08/18/2018

The FileStorm is a DAPP running on MOAC MicroChain to perform the Interplanetary File System (IPFS) application. It requires a custom SCS client. The SCS client released works with MOAC VNODE Nuwa 1.0.2.

**Download links**

FileStorm MicroChain protocol:

* [Smart Contract for the FileStorm protocol](https://github.com/MOACChain/moac-core/releases/download/v1.0/DeploySubChainBase.sol)

FileStorm MicroChain:

* [Smart Contract for the FileStorm Dapp](https://github.com/MOACChain/moac-core/releases/download/v1.0/FileStormMicroChain.sol)

Custom SCS client for FileStorm:

* [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/v1.0/filestorm.tar)
<!-- * [Binary package for Windows]()
* [Binary package for MAC OS]() -->

### Nuwa 1.0.2:

Release Date: 08/10/2018

Thanks for the support from the community, MOAC mainnet upgraded successfully from Pangu to Nuwa after block number 647,200. The VNODE and SCS clients release 1.0.2 can be used to build MicroChain and enable the MicroChain mining in both testnet and mainnet.
To help the developers to try the SCS mining, we has a website providing information in the testnet, please check [Testnet MicroChain Information](https://nodes101.moac.io/) and [instructions to start SCS](https://github.com/MOACChain/moac-core/wiki/MicroChainSCSMining).

**Download links**

VNODE client

* [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/v1.0.2/nuwa-vnode1.0.2.ubuntu.tar.gz)
* [Binary package for Windows](https://github.com/MOACChain/moac-core/releases/download/v1.0.2/nuwa-vnode1.0.2.win.zip)
* [Binary package for MAC OS](https://github.com/MOACChain/moac-core/releases/download/v1.0.2/nuwa-vnode1.0.2.mac.tar.gz)

SCS client

* [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/v1.0.2/nuwa-scs1.0.2.ubuntu.tar.gz)
* [Binary package for Windows](https://github.com/MOACChain/moac-core/releases/download/v1.0.2/nuwa-scs1.0.2.zip)
* [Binary package for MAC OS](https://github.com/MOACChain/moac-core/releases/download/v1.0.2/nuwa-scs1.0.2.mac.tar.gz)



### Nuwa 1.0.1:

Release Date: 08/01/2018

This release is to fix a bug that event subscription in some machines does not work.

**Download links**

VNODE client

* [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/v1.0.1/nuwa1.0.1.ubuntu.tar.gz)
* [Binary package for Windows](https://github.com/MOACChain/moac-core/releases/download/v1.0.1/nuwa1.0.1.win.zip)
* [Binary package for MAC OS](https://github.com/MOACChain/moac-core/releases/download/v1.0.1/nuwa1.0.1.mac.tar.gz)

### Nuwa 1.0.0:

Release Date: 07/31/2018

**Major Progress：**

* Fully functional VNODE to support MicroChain;
* Fully functional SCS server to support MicroChain；
* Enabled VNODE to get rewards from MicroChain mining;
* MicroChain protocol smart contract;
* MicroChain base smart contract that supports POS consensus;
* Fully functional MicroChain supports sharding;
* Supports FileStorm Protocol for IPFS MicroChain; 
* Supports MicroChain without token;

**Available feature：**

* MicroChain mining through SCSs and MicroChain contracts;
* MicroChain supports POS consensus;
* IPFS MicroChain support.


SCS server

Will be released on 08/08/2018.


## MOAC Pangu 0.8.x 

### Pangu 0.8.4:

Release Date: 06/30/2018

This release is for testnet only. 

**Updates：**

* Smart Contract Server(SCS) is released for public testing. Users can run the SCS and connect to the testnet. They can also get mining rewards from MicroChain.
* The MOAC client can connect with SCSs.
* MicroChain can be deployed on SCSs with instructions. 

**Other tools and useful links**


* [MOAC explorer](http://explorer.moac.io/), (*mainnet*), network info, [Account list](), [ERC20 token](http://explorer.moac.io/tokenlist20), and [ERC721 token](http://explorer.moac.io/tokenlist721)
* [MOAC testnet explorer](http://testnet.moac.io:3000/home), (*testnet*)
* [MOAC online wallet](https://moacwalletonline.com/)

**Connecting with MOAC community**

* [Official Website](https://moac.io)
* [Blog/Medium](https://medium.com/@moac_io)
* [Facebook](https://www.facebook.com/moacchain/)
* [Twitter](https://twitter.com/moac_io)
* [Reddit](https://www.reddit.com/r/MOAC/)
* [LinkedIn](https://www.linkedin.com/company/moac-chain)
* [Telegram Developers](https://t.me/MOACDevelopers)
* [Telegram English Users](https://t.me/moacblockchain)
* [Youtube for Developers](https://www.youtube.com/channel/UC_U54wsGNrm_Yivj5bH9i7Q)

### Pangu 0.8.2:

Release Date: 04/30/2018

This release is for both mainnet and testnet. 
The mainnet was launched on April 30th, 2018.

**Updates：**

* Added the community message in the [genesis block](http://explorer.moac.io/block/0). 
* Updated the system contract to fix future send issue.
* The SCS ports were loaded and will be ready to use after the mainnet is launched and testing is finished for SCS.
* Fixed an issue of pending transactions . 
* Removed config file and put the configs in the source files.
* [MOAC explorer](http://explorer.moac.io/), (*mainnet*)
* [MOAC testnet explorer](http://47.75.144.55:3000/home), (*testnet*)

### Pangu 0.8.1:

Release Date: 04/18/2018

This release is for testnet only. The mainnet will be available in late April.

**Updates：**

* The network ID changed to 99 (mainnet) and 101 (testnet) to adopt the EIP155 specification.
* Fixed a previous "no data attached" issue in contract deploying.
* Added config file vnodeconfig.json.
* [MOAC explorer](http://explorer.moac.io/), (*new version connect to the testnet 101*)
* [Mining], (*provided by third party， updated to the new testnet 101*)
* [Faucet], (*provided by third party*)

### Pangu 0.8.0:

Release Date： 3/31/2018

This release is for testnet only. The mainnet will be available in April.

**Major Progress：**

* V-node module，
* Smart Contract Service (POS) module (*in April*)，
* [chain3 lib](https://github.com/innowells/Chain3)，
* [MOAC explorer](http://explorer.moac.io/),
* [Mining], (*provided by third parties*)
* [Wallets]， (*provided by third parties*)

**Available feature：**

* v-node mining
* SCS mining
* Sharding
* System contract for auto trigger, hash lock
* Subchain Protocol contract for SCS miner registration
* Subchain contract for Dapp configuration and flush control
* wallet

### Binary Packages:

A stable release Pangu 0.8.2 is released April 30th, 2018.

The default directory of mainnet is：

	Mac: ~/Library/MoacNode
	Linux: ~/.moac
	Windows: %APPDATA%\MOAC

The default direcotry of testnet is:

	Mac: ~/Library/MoacNode/testnet
	Linux: ~/.moac/testnet
	Windows: %APPDATA%\MOAC\testnet


#### Debian/Ubuntu/CentOS Linux
 
 [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/0.8.2/pangu0.8.2.ubuntu.tar.gz)
 
Untar the file using tar, under the directory

To start connecting with mainnet
	./moac

To start connecting with testnet
	./moac --testnet

To enable the console, can use:

	./moac console
	./moac --testnet console

A testnet directory will be created under 

	$HOME/.moac/testnet/
and some info should be seen as:

    INFO [03-24|11:24:26.506] 86161:IPC endpoint closed: /home/user/.moac/testnet/moac.ipc 

from another terminal, run moac again to attach the running node

	./moac attach $HOME/.moac/testnet/moac.ipc

To see the help, use

	./moac --help

#### Windows

[Binary package for Windows](https://github.com/MOACChain/moac-core/releases/download/0.8.2/pangu0.8.2.windows.zip)

This version only work with "--test" option, not working with mainnet yet.

Untar the file using tar, under the directory 

	moac.exe
	moac.exe --testnet

To see the help, use 
	moac.exe --help

To enable the console, can use: 

	moac.exe --testnet console

A testnet directory will be created under 

	C:\Users\xxxxxx\AppData\Roaming\MoacNode 
	
and some info should be seen as:

	IPC endpoint opened: \\.\pipe\moac.ipc
	
from another terminal, run moac again to attach the running node

	./moac.exe attach \\.\pipe\moac.ipc

#### To run 'scsserver'

It has to be under directory containing 'scsserver' file, run

	./scsserver

#### Example Console commands

If console is not open, open the console using the instructions from above.

1. from console prompt, create coinbase account

	`> personal.newAccount()`

2. from console prompt, start mining by running

	`> miner.start()`

3. check if miner has mined any moac by checking:
	
	`> mc.getBalance(mc.accounts[0])`

4. create another account

	`> personal.newAccount()`

5. See the accounts in the node

	`> mc.accounts`

#### Example Console Javascript files

MOAC can execute Javascript functions under the console.

The binary package contains a js file for testing purpose.
To use, under the console:

	> loadScript("mctest.js")

There are three Javascript functions:

Display the moac balances of the accounts at the current node

`function checkBalance()`

	> checkBalance()

Send moac from one account to another

`function Send(src, passwd, target, value)`


	> Send(mc.accounts[0], '', mc.accounts[1], 0.1)

FutureSend is a good example to test the System Contract
performance. It will send a mc transaction using the 
System Contract at a certain block. If the input block
number is smaller than current block number, the transaction
will fail.

`function FutureSend(src, passwd, target, value, block, revertable)`

	> FutureSend(mc.accounts[0], '', mc.accounts[1], 0.1, 20000, 0)

The transaction will happen when blocknumber = 20000.

#### Community messages

MOAC saved some messages in a system contract to honor the contributors.

Users can check these messages by calling the system contract.

The binary package contains a sysinfo_test.js file. It contains four lines:

	var infoabi='[{"constant ......}]';
	var infoaddress='0x0000000000000000000000000000000000000088';
	var infoContract=mc.contract(JSON.parse(infoabi));
	var genesisInfo=infoContract.at(infoaddress);

To use the function, first load the file under the console:

	> loadScript("sysinfo_test.js")

Then run the function:
	
	> genesisInfo.CommunityMsg()
	"313936392C415250414E45542E313937332C5443502F49502E20323030392C426974636F696E2E2068656C6C6F2032303138EFBC8C4D4F414320697320636F6D696E672E"

These messages are in HEX format, you need a [HEX to ASCII converter](https://www.rapidtables.com/convert/number/hex-to-ascii.html) to see the texts.
There are other messages in the contract made by the contributors. 
Thanks very much for all who contributes to the project!
