## 墨客项目中文更新信息

## [MOAC English](READMEen.md)

## 墨客伏羲 2.x 

### Fuxi v2.1.2:
2021/07/02

本次发布版本仅用于测试网络。
本版本修复了搜索事件索引时返回空值的问题，避免在事件查询的时候，有可能返回错误的结果。

**下载链接**

VNODE 可执行文件包

* [Linux 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v2.1.2/fuxi2.1.2-testnet.linux.tar.gz)
* [Windows 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v2.1.2/fuxi2.1.2-testnet.win.zip)
* [MAC OS 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v2.1.2/fuxi2.1.2-testnet.mac.tar.gz)

### Fuxi v2.1.1:
2021/05/25

本次发布版本用于正式网络，包含了测试网络上2.0.5以来的所有新增功能，主网预定分叉高度在6850000，预计分叉时间为北京时间5月28日到29日之间。

本版本修复了DAG文件生成过程中多线程并发产生的问题。

VNODE客户端增加了对web3的接口支持，使得用户可以使用以太坊的 EIP155 签名方式发送交易到MOAC基础链/母链。这次升级可以让开发者使用以太坊类的开发工具，如MetaMask，直接接入MOAC基础链。

在VNODE客户端增加了支持以太坊 EIP-2537(https://eips.ethereum.org/EIPS/eip-2537) 中 BLS12-381 签名的预编译合约模块，使得MOAC网络能够使用和以太坊网络相同的签名验证算法，来验证BLS和SNARKS的签名。这个新的特征为下一步实现MOAC网络和以太坊网络的跨链做准备，也是MOAC网络上实现聚合自动化市商（AMM）的一个重要工具。

主网可以提供了eth_subscribe接口中支持参数的问题，使得用户可以在提供websocket接口的客户端订阅信息。
目前可以订阅的信息包括：
* newHeads
* logs
* newPendingTransactions
* syncing


**下载链接**

VNODE 可执行文件包

* [Linux 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v2.1.1/fuxi2.1.1-stable.linux.tar.gz)
* [Windows 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v2.1.1/fuxi2.1.1-stable.win.zip)
* [MAC OS 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v2.1.1/fuxi2.1.1-stable.mac.tar.gz)

### Fuxi v2.1.0:
2021/05/14

使用以太坊 web3.js 开发MOAC应用的两个注意问题
1，MOAC链的一般交易, gaslimit是1000，如果用web3来做sign的话，gaslimit仍必须要21000以上了，这个21000是web3的限制，实际使用仍是1000 gas；

2，当使用web3.eth.accounts.signTransaction 来做签名交易时，如果用web3.eth.sendSignedTransaction(signedTx.rawTransaction)来发送交易，sendSignedTransaction的结果里面有一个transactionHash。这个transactionHash是web3.js本地生成的，和以太坊上receipt中的transactionHash一致。但是，MOAC的receipt中的transactionHash，即实际链上产生的transactionHash，和web3.js本地产生的不一致。开发者需要使用receipt给出的为准。

### Fuxi v2.1.0:
2021/05/12

本次发布版本用于正式网络，包含了测试网络上2.0.5以来的所有新增功能。

VNODE客户端增加了对web3的接口支持，使得用户可以使用以太坊的 EIP155 签名方式发送交易到MOAC基础链/母链。这次升级可以让开发者使用以太坊类的开发工具，如MetaMask，直接接入MOAC基础链。

在VNODE客户端增加了支持以太坊 EIP-2537(https://eips.ethereum.org/EIPS/eip-2537) 中 BLS12-381 签名的预编译合约模块，使得MOAC网络能够使用和以太坊网络相同的签名验证算法，来验证BLS和SNARKS的签名。这个新的特征为下一步实现MOAC网络和以太坊网络的跨链做准备，也是MOAC网络上实现聚合自动化市商（AMM）的一个重要工具。

主网可以提供了eth_subscribe接口中支持参数的问题，使得用户可以在提供websocket接口的客户端订阅信息。
目前可以订阅的信息包括：
* newHeads
* logs
* newPendingTransactions
* syncing

**下载链接**

VNODE 可执行文件包

* [Linux 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v2.1.0/fuxi2.1.0-stable.linux.tar.gz)
* [Windows 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v2.1.0/fuxi2.1.0-stable.win.zip)
* [MAC OS 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v2.1.0/fuxi2.1.0-stable.mac.tar.gz)

### Fuxi v2.0.7:
2021/05/09

本次发布版本仅用于测试网络，修复了eth_subscribe接口中支持参数的问题，使得用户可以在提供websocket接口的客户端订阅信息。
目前可以订阅的信息包括：
* newHeads
* logs
* newPendingTransactions
* syncing

为了使用订阅功能，需要VNODE客户端在启动时候使用"ws"选项：

``````
moac --testnet --ws --wsaddr 0.0.0.0 --wsport 8546 --wsapi "chain3,mc,net,db,personal" --wsorigins "*"
``````

然后，在web3中使用订阅功能

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

**下载链接**

VNODE 可执行文件包

* [Linux 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v2.0.7/fuxi2.0.7-beta.linux.tar.gz)
* [Windows 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v2.0.7/fuxi2.0.7-beta.win.zip)
* [MAC OS 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v2.0.7/fuxi2.0.7-beta.mac.tar.gz)


### Fuxi v2.0.6:
2021/04/28

本次发布版本仅用于测试网络，测试网升级区块高度为5330000区块。
本次更新在VNODE客户端增加了支持以太坊 EIP-2537(https://eips.ethereum.org/EIPS/eip-2537) 中 BLS12-381 签名的预编译合约模块，使得MOAC网络能够使用和以太坊网络相同的签名验证算法，来验证BLS和SNARKS的签名。这个新的特征为下一步实现MOAC网络和以太坊网络的跨链做准备，也是MOAC网络上实现聚合自动化市商（AMM）的一个重要工具。

**下载链接**

VNODE 可执行文件包

* [Linux 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v2.0.6/fuxi2.0.6-beta.linux.tar.gz)
* [Windows 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v2.0.6/fuxi2.0.6-beta.win.zip)
* [MAC OS 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v2.0.6/fuxi2.0.6-beta.mac.tar.gz)

### Fuxi v2.0.5:
2021/04/18

本次发布版本仅用于测试网络的VNODE，测试网升级区块高度为5260000区块。本次更新在VNODE客户端增加了对web3的接口支持，使得用户可以使用以太坊的 EIP155 签名方式发送交易到MOAC基础链/母链。这次升级可以让开发者使用以太坊类的开发工具，如MetaMask，直接接入MOAC基础链。
本次发布也提供了示例程序 send_web3.js，使用 web 1.2.1 发送签名交易到MOAC VNODE。

**下载链接**

VNODE 可执行文件包

* [Linux 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v2.0.5/fuxi2.0.5-beta.linux.tar.gz)
* [Windows 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v2.0.5/fuxi2.0.5-beta.win.zip)
* [MAC OS 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v2.0.5/fuxi2.0.5-beta.mac.tar.gz)

### Fuxi v2.0.4:
2021/04/06

本次发布提高了vnode节点运行时的稳定性，修复了访问区块状态数据时出现错误的问题。建议所有vnode节点尽快升级。
同时在log文件中加入更多的debug信息，以帮助调试区块状态问题。
此外，为了MOAC公链未来更好的发展，建议参与挖矿的矿工将区块gas上限提升至1800万。
具体方法为，在启动节点程序时，加入如下启动参数：
```
moac --targetgaslimit 18000000
```

**下载链接**

VNODE 可执行文件包

* [Linux 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v2.0.4/fuxi2.0.4-stable.linux.tar.gz)
* [Windows 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v2.0.4/fuxi2.0.4-stable.win.zip)
* [MAC OS 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v2.0.4/fuxi2.0.4-stable.mac.tar.gz)

### Fuxi v2.0.3:
2021/03/25

本次发布用于解除MOAC主网上的难度炸弹，以提高出块速度，主网mainnet升级后分叉高度为6462000区块，建议用户尽快升级到这一版本。
为了MOAC公链未来更好的发展，同时建议参与挖矿的矿工将区块gas上限提升至1800万。
具体方法为，在启动节点程序时，加入如下启动参数：
```
moac --targetgaslimit 18000000
```

**下载链接**

VNODE 可执行文件包

* [Linux 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v2.0.3/fuxi2.0.3-stable.linux.tar.gz)
* [Windows 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v2.0.3/fuxi2.0.3-stable.win.zip)
* [MAC OS 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v2.0.3/fuxi2.0.3-stable.mac.tar.gz)

### Fuxi v2.0.2:
2021/03/18

本次发布版本仅用于测试网络，更新了VNODE客户端，用于解除难度炸弹，提高出块速度，测试网分叉区块高度在5042000。

**下载链接**

VNODE 可执行文件包

* [Linux 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v2.0.2/fuxi2.0.2-test.linux.tar.gz)
* [Windows 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v2.0.2/fuxi2.0.2-test.win.zip)
* [MAC OS 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v2.0.2/fuxi2.0.2-test.mac.tar.gz)

### Fuxi v2.0.1:
2021/02/28

本次发布的更新仅限于VNODE，包含对MOAC主网 mainnet 的Vnode节点的智能合约运行环境VM进行重大升级，新增对以下opcode的支持。升级后，Vnode节点可最高支持运行solidity 0.8编译器编译的合约字节码。按照发布计划，mainnet升级后分叉高度为6435000区块，预计分叉时间为北京时间3月5日前后（周五）。
新增的opcode如下：

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

建议所有 VNODE 节点尽快升级到这一版本。此外，在本次 VNODE 节点程序升级的同时，为了MOAC公链未来更好的发展，我们建议参与挖矿的矿工将区块gas上限提升至1800万。
具体方法为，在启动节点程序时，加入如下启动参数：
```
moac --targetgaslimit 18000000
```

经过一段时间后，新区块的gas上限会逐步由当前的900万提升至1800万，从而允许MOAC公链运行更加复杂的智能合约。
如果节点不参与挖矿，则无需设置 targetgaslimit 参数。

**下载链接**

VNODE 可执行文件包

* [Linux 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v2.0.1/fuxi2.0.1-stable.linux.tar.gz)
* [Windows 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v2.0.1/fuxi2.0.1-stable.win.zip)
* [MAC OS 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v2.0.1/fuxi2.0.1-stable.mac.tar.gz)

### Fuxi v2.0.0:
2020/12/30

本版本的更新仅限于VNODE，发布的版本仅能用于测试网.
本次发布对Vnode节点的智能合约运行环境VM进行重大升级，新增对以下opcode的支持。升级后，Vnode节点可最高支持运行 Solidity 0.8编译器编译的合约字节码。按照发布计划，testnet升级后分叉高度为4900000区块，预计分叉时间为北京时间2020年12月30日（周三）。
新增的opcode如下：

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


**下载链接**

VNODE 可执行文件包

* [Linux 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v2.0.0/fuxi2.0.0-test.linux.tar.gz)
* [Windows 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v2.0.0/fuxi2.0.0-test.win.zip)
* [MAC OS 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v2.0.0/fuxi2.0.0-test.mac.tar.gz)

## 墨客女娲 1.x 

### Nuwa v1.1.5:
2020/09/10

本版本发布的VNODE和SCS为可以在正式网上运行新型应用链RandDrop的版本。
增加了主网上的白名单功能，使用官方提供的编译代码可以直接在主网上部署RandDrop应用链。
本版本在VNODE和SCS上有更新。

本版本主要进行了以下更新：

* VNODE 增加了admin.getSubnetP2PList 功能和JSON-RPC接口；
* VNODE 修正了Subnet P2P网络异常退出的问题；
* SCS版本号中加入Randdrop信息，便于用户识别;
* 其他常规的bug修复与升级。

更多信息可以参考最新的开发文档
https://moacdocs-chn.readthedocs.io/zh_CN/latest/appchain/RandDrop.html

测试环境的moac可以免费获取：https://faucet.moacchina.com/

**下载链接**

VNODE+SCS 可执行文件包

* [Linux 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v1.1.5/nuwa1.1.5.linux.tar.gz)
* [Windows 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v1.1.5/nuwa1.1.5.win.zip)
* [MAC OS 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v1.1.5/nuwa1.1.5.mac.tar.gz)

### Nuwa v1.1.4:

2020/07/06

本版本发布的VNODE和SCS为可以在正式网上运行新型应用链RandDrop的版本。
本版本在VNODE、SCS和应用链合约上均有更新。

本版本主要进行了以下更新：

* 加强了randdrop共识协议在高负载条件下的性能与稳定性；
* 更新了应用链部署合约VssBase.sol以解决测试中发现的问题；
* 更新了部署RandDrop的脚本程序并增加了跨链调用的脚本；
* 其他常规的bug修复与升级。

更多信息可以参考最新的开发文档
https://moacdocs-chn.readthedocs.io/zh_CN/latest/appchain/RandDrop.html

测试环境的moac可以免费获取：https://faucet.moacchina.com/

**下载链接**

RandDrop 合约文件和部署脚本

* [ASM 跨链模式](https://github.com/MOACChain/moac-core/tree/master/randdrop/asm)

VNODE+SCS 可执行文件包

* [Linux 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v1.1.4/nuwa1.1.4.linux.tar.gz)
* [Windows 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v1.1.4/nuwa1.1.4.win.zip)
* [MAC OS 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v1.1.4/nuwa1.1.4.mac.tar.gz)

### Nuwa v1.1.3:
2020/05/26

本版本仅在测试网上运行，是为了测试新型应用链RandDrop。
本版本在VNODE和SCS上均有更新。

本版本进行了以下更新：

* 加强了randdrop共识协议在高负载条件下的性能与稳定性；
* 增加了rpc接口中对链上随机数查询的支持，getBlock的接口返回对象中多了一个random字段，类型为32字节数组；
* 更新了应用链部署合约VssBase.sol以支持新功能；
* 添加了调用应用链随机数的合约test.sol；
* 更新了部署RandDrop的脚本程序；
* 其他常规的bug修复与升级。

更多信息可以参考最新的开发文档
https://moacdocs-chn.readthedocs.io/zh_CN/latest/appchain/RandDrop.html

测试环境的moac可以免费获取：https://faucet.moacchina.com/

**下载链接**

VNODE+SCS 可执行文件包

* [Linux 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v1.1.3/nuwa1.1.3.linux.tar.gz)
* [Windows 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v1.1.3/nuwa1.1.3.win.zip)
* [MAC OS 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v1.1.3/nuwa1.1.3.mac.tar.gz)


### Nuwa v1.1.2:
2020/05/04

本版本仅在测试网上运行，是为了测试新型应用链RandDrop。
本版本在VNODE和SCS上均有更新。

RandDrop应用链是指采用BLS签名，支持多合约部署的MOAC应用链。

RandDrop采用BLS签名，从共识层支持多个节点的签名片段进行合并得到阈值签名，以此为基础产生随机数。随机数可以在RandDrop的智能合约里面直接调用。RandDrop随机数的优点是可以杜绝单个节点对最终签名的可操作性，更加安全可靠。同时，RandDrop的信息量是O(n)，比其他类似的随机数区块链具有较大的优势。

RandDrop应用链的验证过程由支持RandDrop应用链的客户端（SCS）完成，ProcWind和RandDrop的SCS节点不能混用。

与ProcWind的部署相比，RandDrop主要有以下不同
* 需要部署支持私钥共享的合约VssBase.sol
* 在部署应用链合约时需要VssBase合约的地址作为输入
* 在部署完VssBase和RandDropChainBase的合约后，需要在基础链上，调用VssBase合约的setCaller方法，传入之前的RandDrop合约地址。此方法调用后，保证了VssBase合约的部分关键函数只能由RandDrop的应用链合约调用，而无法由外部普通账户调用。

更多信息可以参考最新的开发文档
https://moacdocs-chn.readthedocs.io/zh_CN/latest/appchain/RandDrop.html

测试环境的moac可以免费获取：https://faucet.moacchina.com/

**下载链接**

VNODE+SCS 可执行文件包

* [Linux 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v1.1.2/nuwa1.1.2.linux.tar.gz)
* [Windows 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v1.1.2/nuwa1.1.2.win.zip)
* [MAC OS 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v1.1.2/nuwa1.1.2.mac.tar.gz)

### Nuwa v1.1.1:
2020/03/15

本版本仅在测试网上运行，是为了测试应用链的新交互界面。目前主要在SCS客户端提供了一个可以和用户交互的JavaScript界面，
界面的启动需要首先运行SCS客户端并打开RPC端口：

./scsserver --rpc --rpcport 8548

然后打开另外一个窗口，运行以下命令(默认路径 ./scsdata)

./scsserver attach

或者

./scsserver attach ./scsdata/scs.ipc

用户应该可以看到一个交互命令行窗口。

在交互界面中提供了appchain新组件，用于应用链的方法调用。用户可以在命令行中输入appchain看到所有的方法和属性。appchain新组件中提供SetAddress（）和GetAddress（）来设定和显示应用链地址，并且提供和scs组件中类似的应用链调用方法。不同之处在于不用每次输入应用链地址作为第一个参数。例如，下面的命令会返回应用链的最新区块高度：

更多信息可以参考最新的开发文档
https://moacdocs-chn.readthedocs.io/zh_CN/latest

测试环境的moac可以免费获取：https://faucet.moacchina.com/

**下载链接**

VNODE+SCS 可执行文件包

* [Linux 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v1.1.1/nuwa1.1.1.linux.tar.gz)
* [Windows 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v1.1.1/nuwa1.1.1.win.zip)
* [MAC OS 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v1.1.1/nuwa1.1.1.mac.tar.gz)

### Nuwa v1.1.0:
2020/02/08

本版本是2020年的主要升级，包括了之前v1.0.x的所有功能，并着重对VNODE节点之间的连接进行了优化，加强应用链SCS之间的通讯。
本版本支持ProcWind应用链的所有功能。

更多信息可以参考最新的开发文档
https://moacdocs-chn.readthedocs.io/zh_CN/latest

测试环境的moac可以免费获取：https://faucet.moacchina.com/

**下载链接**

VNODE+SCS 可执行文件包

* [Linux](https://github.com/MOACChain/moac-core/releases/download/v1.1.0/nuwa1.1.0.linux.tar.gz)
* [Windows](https://github.com/MOACChain/moac-core/releases/download/v1.1.0/nuwa1.1.0.win.zip)
* [MAC OS](https://github.com/MOACChain/moac-core/releases/download/v1.1.0/nuwa1.1.0.mac.tar.gz)

### Nuwa v1.0.12:
2019/12/23

版本特性 

本版本仅在测试网上运行，进行了以下改进：

1. 应用链客户端（SCS）可以部署使用solidity 0.5.x编译的DAPP合约，但需要部署相应的DappBase合约；
2. 提供 JSON-RPC 接口scs_listening，并修正了scs_getBalance接口之前显示大数的错误；
3. 更新了ASM和AST两种应用链中的合约；
4. 增加了关闭应用链的脚本，和实现跨链操作的脚本；


更多信息可以参考最新的开发文档
https://moacdocs-chn.readthedocs.io/zh_CN/latest

开发团队同时提供可以接入子链的API和SDK，可以参考API 文档.
https://moacdocs-chn.readthedocs.io/zh_CN/latest/restapi

测试环境地址：http://139.198.126.104:8080
测试环境获取access token，可使用测试账号：test 密码：123456
测试环境的moac可以免费获取：https://faucet.moacchina.com/

**下载链接**

VNODE+SCS 可执行文件包

* [Linux](https://github.com/MOACChain/moac-core/releases/download/v1.0.12/nuwa1.0.12.linux.tar.gz)
* [Windows](https://github.com/MOACChain/moac-core/releases/download/v1.0.12/nuwa1.0.12.win.zip)
* [MAC OS](https://github.com/MOACChain/moac-core/releases/download/v1.0.12/nuwa1.0.12.mac.tar.gz)

### Nuwa v1.0.11:
2019/09/26

版本特性 

本版本可在主网和测试网上支持子链多合约，并进行了以下优化：

1. 为 SCS 提供 RPCdebug 开发接口，便于用户调试；
2. 为 SCS 提供 JSON-RPC ；
3. 更新了ASM和AST两种子链中的合约；


此外，本次发布一同更新了nuwa1.0.11.ASM.tar.gz 和 nuwa1.0.11.AST.tar.gz
更新了部署ASM和AST子链合约的NODEJS脚本，可以实现一键发链，修正了之前脚本在windows下的问题；
提供了在子链上部署控制合约和普通合约的NODEJS脚本，可以用来部署DappBase和更多的Dapp；
提供了调用子链和DAPPBASE函数的例子；
更多信息可以参考最新的开发文档
https://moacdocs-chn.readthedocs.io/zh_CN/latest

开发团队同时提供可以接入子链的API和SDK，可以参考API 文档.
https://moacdocs-chn.readthedocs.io/zh_CN/latest/restapi

测试环境地址：http://139.198.126.104:8080
测试环境获取access token，可使用测试账号：test 密码：123456
测试环境的moac可以免费获取：https://faucet.moacchina.com/

**下载链接**

VNODE+SCS 可执行文件包

* [Linux](https://github.com/MOACChain/moac-core/releases/download/v1.0.11/nuwa1.0.11.linux.tar.gz)
* [Windows](https://github.com/MOACChain/moac-core/releases/download/v1.0.11/nuwa1.0.11.win.zip)
* [MAC OS](https://github.com/MOACChain/moac-core/releases/download/v1.0.11/nuwa1.0.11.mac.tar.gz)
* [ARM Linux](https://github.com/MOACChain/moac-core/releases/download/v1.0.11/nuwa1.0.11.arm.tar.gz)


### LICENSE 文件更新和应用链源程序发布
2019/08/29
为了更好地服务社区和商业用户，我们把应用链的LICENSE从GPL更换为MIT。
同时把目前ProcWind应用链的源程序发布到新目录 procwind，替代之前的contractsamples目录。
之后我们也计划把MOAC底层的不同软件库和应用程序的源程序逐步开源，欢迎大家使用。

### Nuwa v1.0.10:
2019/07/12

版本特性 

本版本仅在测试网上支持多合约，是为了测试子链新结构使用：

1. 为SCS提供更多开发接口，便于用户使用；
2. 在VNODE console中提供internal transaction的接口；
3. 更新了ASM和AST两种子链中的DappBase合约；
4. 修正了VNODE README中的错误，增加了SCS README；

此外，本次发布还更新了nuwa1.0.10.ASM.tar.gz 和 nuwa1.0.10.AST.tar.gz
本版开始，开始使用应用链（AppChain）来称呼子链（MicroChain），
基础链（BaseChain）来称呼母链（MotherChain）。
更新了部署ASM和AST子链合约的NODEJS脚本，可以实现一键发链，修正了之前脚本在windows下的问题；
提供了在子链上部署控制合约和普通合约的NODEJS脚本，可以用来部署DappBase和更多的Dapp；
提供了调用子链和DAPPBASE函数的例子；
更多信息可以参考最新的开发文档
https://moacdocs-chn.readthedocs.io/zh_CN/latest

开发团队同时提供可以接入子链的API和SDK，可以参考API 文档.
https://moacdocs-chn.readthedocs.io/zh_CN/latest/restapi

测试环境地址：http://139.198.126.104:8080
测试环境获取access token，可使用测试账号：test 密码：123456
测试环境的moac可以免费获取：https://faucet.moacchina.com/

**下载链接**

VNODE+SCS 可执行文件包

* [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/v1.0.10/nuwa1.0.10.linux.tar.gz)
* [Binary package for Windows](https://github.com/MOACChain/moac-core/releases/download/v1.0.10/nuwa1.0.10.win.zip)
* [Binary package for MAC OS](https://github.com/MOACChain/moac-core/releases/download/v1.0.10/nuwa1.0.10.mac.tar.gz)
* [Binary package for ARM Linux](https://github.com/MOACChain/moac-core/releases/download/v1.0.10/nuwa1.0.10.arm.tar.gz)

跨链交换子链的合约文件和执行脚本

* [ASM contracts and script](https://github.com/MOACChain/moac-core/releases/download/v1.0.10/nuwa1.0.10.ASM.tar.gz)
* [AST contracts and script](https://github.com/MOACChain/moac-core/releases/download/v1.0.10/nuwa1.0.10.AST.tar.gz)

### Nuwa v1.0.9: 

版本特性 

1.  在主网和测试网上支持多合约。子链多合约指的是在一条子链中部署多个智能合约，多合约可以将业务逻辑进行拆分，相互调用，合约之间也可以进行升级;
2.  为SCS提供更多开发接口，便于用户使用；
3.  提供更多JSON-RPC接口；
4.  优化了交易池中对子链确认过程的处理；
5.  优化了P2P的连接方式；
6.  更新了ASM和AST两种子链的合约；
7.  提供了部署ASM和AST子链合约的脚本；

更多信息可以参考最新的[开发文档](https://moac-docs.readthedocs.io/en/latest/index.html).

开发团队同时提供可以接入子链的API和SDK，可以参考[API 文档](https://moac-docs.readthedocs.io/en/latest/restapi/index.html).
接入API需要首先获取access token，请联系开发团队:moacapi@mossglobal.net.

**下载链接**

VNODE+SCS 可执行文件包

* [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/1.0.9/nuwa1.0.9.linux.tar.gz)
* [Binary package for Windows](https://github.com/MOACChain/moac-core/releases/download/1.0.9/nuwa1.0.9.win.zip)
* [Binary package for MAC OS](https://github.com/MOACChain/moac-core/releases/download/1.0.9/nuwa1.0.9.mac.tar.gz)
* [Binary package for ARM Linux](https://github.com/MOACChain/moac-core/releases/download/1.0.9/nuwa1.0.9.arm.tar.gz)

跨链交换子链的合约文件和执行脚本

* [ASM contracts and script](https://github.com/MOACChain/moac-core/releases/download/1.0.9/nuwa1.0.9.ASM.tar.gz)
* [AST contracts and script](https://github.com/MOACChain/moac-core/releases/download/1.0.9/nuwa1.0.9.AST.tar.gz)

### Nuwa 1.0.8

本次发布的软件包仅用测试网，用于测试子链的多合约部署。
本版本的SCS和VNODE需要一起使用以支持子链上部署多个合约。
子链多合约指的是在一条子链中部署多个智能合约，多合约可以将业务逻辑进行拆分，相互调用，合约之间也可以进行升级;
为SCS提供更多开发接口，便于用户使用；

1.  允许子链上同时部署多个合约;
2.  通过 SCS RPCdebug 接口提供多个合约查询方法以允许用户调用子链上的多个合约，并查询结果;
3.  通过 SCS RPC 接口提供多个合约查询方法以允许用户调用子链上的多个合约，并查询结果;
4.  优化了P2P的连接方式；

合约例子里面提供了可以部署一条支持AST的多合约子链，包括以下合约

* erc20.sol: 母链上的ERC20 token合约，可以用于交换子链原生token；
* SubChainProtocolBase.sol: 支持多合约的子链池合约;
* VnodeProtocolBase.sol: 支持多合约的VNODE代理池合约.
* SubChainBase.sol: 支持多合约的子链合约.;
* Dappbase.sol: 支持多合约的子链DAPP控制合约;

**下载链接**

VNODE+SCS 可执行文件包

* [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/1.0.8/nuwa1.0.8.linux.tar.gz)
* [Binary package for Windows](https://github.com/MOACChain/moac-core/releases/download/1.0.8/nuwa1.0.8.win.zip)
* [Binary package for MAC OS](https://github.com/MOACChain/moac-core/releases/download/1.0.8/nuwa1.0.8.mac.tar.gz)
* [Binary package for ARM Linux](https://github.com/MOACChain/moac-core/releases/download/1.0.8/nuwa1.0.8.arm.tar.gz)

母链 ERC20 token 跨链交换子链 tokens

* [ERC20 sample](https://github.com/MOACChain/moac-core/releases/download/v1.0.8/erc20.sol)
* [VnodeProtocolBaseAST.sol](https://github.com/MOACChain/moac-core/releases/download/v1.0.8/VnodeProtocolBase.sol)
* [SubChainProtocolBase.sol](https://github.com/MOACChain/moac-core/releases/download/1.0.8/SubChainProtocolBase.sol)

带有跨链功能的子链协议合约

* [SubChainBase](https://github.com/MOACChain/moac-core/releases/download/1.0.8/SubChainBase.sol)

带有跨链功能的子链DAPP控制合约

* [dappbase.sol](https://github.com/MOACChain/moac-core/releases/download/1.0.8/DappBase.sol)

### Nuwa v1.0.7: 

本次发布的软件包可用于主网和测试网。
修正了之前测试中发现的一些问题，提供了母链和子链之间的使用MOAC和ERC20 token的原子跨链交易；
优化了跨链功能：
1. 允许快速充值并将充值上限提高到500以上；
2. 优化VIA节点奖励模式;
3. 增加白名单快速通道，使得符合一定条件的母链合约可以不经审核直接部署;
4. 修正Fixed the bug that MicroChain flush stop before DAPP deployed;
5. 提供MOAC和母链ERC20 TOKEN对子链的跨链兑换功能;
6. 提供ARM linux的编译版本.


**下载链接**

VNODE+SCS 可执行文件包

* [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/v1.0.7/nuwa1.0.7.linux.tar.gz)
* [Binary package for Windows](https://github.com/MOACChain/moac-core/releases/download/v1.0.7/nuwa1.0.7.win.zip)
* [Binary package for MAC OS](https://github.com/MOACChain/moac-core/releases/download/v1.0.7/nuwa1.0.7.mac.tar.gz)
* [Binary package for ARM Linux](https://github.com/MOACChain/moac-core/releases/download/v1.0.7/nuwa1.0.7.arm.tar.gz)

带有跨链功能的子链合约

MOAC 跨链交换子链 tokens

* [SubChainBaseASM](https://github.com/MOACChain/moac-core/releases/download/v1.0.7/SubChainBaseASM.sol)
* [VnodeProtocolBaseASM](https://github.com/MOACChain/moac-core/releases/download/v1.0.7/VnodeProtocolBaseASM.sol)

母链 ERC20 token 跨链交换子链 tokens

* [ERC20 sample](https://github.com/MOACChain/moac-core/releases/download/v1.0.7/erc20.sol)
* [SubChainBaseAST](https://github.com/MOACChain/moac-core/releases/download/v1.0.7/SubChainBaseAST.sol)
* [VnodeProtocolBaseAST.sol](https://github.com/MOACChain/moac-core/releases/download/v1.0.7/VnodeProtocolBaseAST.sol)

带有跨链功能的子链协议合约

* [SubChainProtocolBase.sol](https://github.com/MOACChain/moac-core/releases/download/v1.0.7/SubChainProtocolBase.sol)

带有跨链功能的子链DAPP合约

* [dappbase.sol](https://github.com/MOACChain/moac-core/releases/download/v1.0.7/dappbase.sol)



### Nuwa v1.0.6: 

本次发布的软件包可用于主网和测试网。
修正了之前测试中发现的一些问题，提供了母链和子链之间的原子跨链交易；


对于VNODE节点用户
* 如果要使用跨链功能，必须升级到v1.0.6；
* 如果只是使用VNODE挖矿，或者作为监听节点，短期内不会有影响，但建议升级；

对于SCS节点用户
* 如果要使用跨链功能，必须升级到v1.0.6；
* 必须使用v1.0.6提供的带有跨链功能的子链合约来部署子链；

VNODE

* 在母链上提供了原子跨链功能;
* 修正之前测试发现的一些问题;

SCS

* 为子链提供了原子跨链功能，可以配合子链DAPP来完成和母链之间的原子交易，每次充/提不超过500母链token;
* 和子链代理节点之间提供了缓存功能，增加了NotifySyncEvent;


**Download links**

VNODE+SCS 可执行文件包

* [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/v1.0.6/nuwa1.0.6.linux.tar.gz)
* [Binary package for Windows](https://github.com/MOACChain/moac-core/releases/download/v1.0.6/nuwa1.0.6.win.zip)
* [Binary package for MAC OS](https://github.com/MOACChain/moac-core/releases/download/v1.0.6/nuwa1.0.6.mac.tar.gz)

MicroChain contracts

带有跨链功能的子链合约

* [SubChainProtocolBase.sol](https://github.com/MOACChain/moac-core/releases/download/v1.0.6/SubChainProtocolBase.sol)
* [VnodeProtocolBase.sol](https://github.com/MOACChain/moac-core/releases/download/v1.0.6/VnodeProtocolBase.sol)
* [SubChainBaseAST.sol](https://github.com/MOACChain/moac-core/releases/download/v1.0.6/SubChainBase.sol)
* [dappbase.sol](https://github.com/MOACChain/moac-core/releases/download/v1.0.6/dappbase.sol)

### Nuwa 1.0.5:

本次发布的软件包可用于主网和测试网。
修正了之前测试中发现的一些问题，提供了完整的子链功能；
为用户提供了便于使用的SCS端的JSON-RPC的接口。

对于VNODE节点用户
* 如果要配置子链，成为子链代理节点（MicroChain Proxy）的，请尽快升级到v1.0.5；
* 如果只是使用VNODE挖矿，或者作为监听节点，短期内不会有影响，但建议升级；

对于SCS节点用户
* 必须升级到v1.0.5；
* 必须使用v1.0.5提供的子链合约来初始部署子链；

VNODE

* 在SubChainBase中增加了更多功能；
* 在主链上提供了子链whitelist的控制功能;
* 修正之前测试发现的一些问题;

SCS

* 修正 HandleProposalDistribute 和 getCurNodeList  函数中的问题;
* 修改 account 在子链上获取 nonce 的方式;
* 把SCS命令行的 RPC 命令名称进行了修改，之前'rpc1'改为'rpcdebug', 'rpc2'改为'rpc';
* SCS命令行使用 'rpccorsdomain' 来控制外部访问SCS的功能;

**下载链接**

VNODE+SCS 可执行文件包

* [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/v1.0.5/nuwa1.0.5.linux.tar.gz)
* [Binary package for Windows](https://github.com/MOACChain/moac-core/releases/download/v1.0.5/nuwa1.0.5.win.zip)
* [Binary package for MAC OS](https://github.com/MOACChain/moac-core/releases/download/v1.0.5/nuwa1.0.5.mac.tar.gz)

MicroChain contracts

* [SubChainProtocolBase.sol](https://github.com/MOACChain/moac-core/releases/download/v1.0.5/SubChainProtocolBase.sol)
* [VnodeProtocolBase.sol](https://github.com/MOACChain/moac-core/releases/download/v1.0.5/VnodeProtocolBase.sol)
* [SubChainBase.sol](https://github.com/MOACChain/moac-core/releases/download/v1.0.5/SubChainBase.sol)

### Nuwa 1.0.4:

发布日期: 10/31/2018

本次发布的软件包仅适用于测试网。
修正了测试中发现的一些问题，SCS端增加了JSON-RPC类型的RPC接口。
本次发布对linux和windows提供了386和amd64的编译版本.

VNODE

* 修正了配置文件vnodeconfig.json中scsservice设置为false时，via没配置报错；
* 仅对进行子链确认的SCS节点发送通知;
* 修正子链对主链的写入确认中的问题;

SCS

* 修正子链对主链的写入确认中的问题;
* 修改了command line界面的选项，提供了更多信息，可以用"-h"来看最新的信息；
* 增加多个SCS端JSON-RPC的命令，具体可以参考[文档部分](https://github.com/MOACChain/moac-core/wiki/JSON-RPC)；


**下载链接**

VNODE+SCS 可执行文件包

* [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/v1.0.4/nuwa1.0.4.linux.tar.gz)
* [Binary package for Windows](https://github.com/MOACChain/moac-core/releases/download/v1.0.4/nuwa1.0.4.win.zip)
* [Binary package for MAC OS](https://github.com/MOACChain/moac-core/releases/download/v1.0.4/nuwa1.0.4.mac.tar.gz)


### 墨客女娲版本 1.0.3:

发布日期: 09/29/2018

本次发布的软件包仅适用于非主网的测试网。
主要更新包括修正了压力测试中发现的一些问题，提高了子链系统的处理能力，相应的子链部署合约也进行了更新。
新的子链部署合约需要和更新的软件包一起使用。

**下载链接**

VNODE+SCS 可执行文件包

* [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/v1.0.3/nuwa1.0.3.ubuntu.tar.gz)
* [Binary package for Windows](https://github.com/MOACChain/moac-core/releases/download/v1.0.3/nuwa1.0.3.win.zip)
* [Binary package for MAC OS](https://github.com/MOACChain/moac-core/releases/download/v1.0.3/nuwa1.0.3.mac.tar.gz)

部署子链的合约文件

* [SubChainProtocolBase](https://github.com/MOACChain/moac-core/releases/download/v1.0.3/SubChainProtocolBase.sol)
* [VnodeProtocolBase](https://github.com/MOACChain/moac-core/releases/download/v1.0.3/VnodeProtocolBase.sol)
* [SubChainBase](https://github.com/MOACChain/moac-core/releases/download/v1.0.3/SubChainBase.sol)

### 文件风暴（FileStorm）1.0.1:

发布日期: 08/27/2018


[文件风暴 1.0.1](https://github.com/MOACChain/moac-core/releases/download/1.0.1/filestorm1.0.1.tar)

可以使用[deploy.js](https://github.com/MOACChain/moac-core/releases/download/1.0.1/deploy.js) 在一个VNODE和3个SCS来部署一个子链.

### 文件风暴（FileStorm）1.0.0:

发布日期: 08/18/2018

文件风暴（FileStorm）是一个通过墨客子链实现的IPFS存储平台。它需要专用的SCS客户端来部署和执行IPFS功能。当前的FileStorm SCS客户端可以接入墨客女娲版本 1.0.2。
更多信息可以参考[FileStorm](https://github.com/MOACChain/moac-core/wiki/FileStorm)和[FileStorm使用指南](https://github.com/MOACChain/moac-core/wiki/FileStormUserGuide).

**下载链接**

FileStorm 子链共识协议:

* [FileStorm 子链共识协议合约](https://github.com/MOACChain/moac-core/releases/download/v1.0/DeploySubChainBase.sol)

FileStorm 子链合约:

* [FileStorm Dapp子链合约](https://github.com/MOACChain/moac-core/releases/download/v1.0/FileStormMicroChain.sol)

FileStorm 子链专用SCS客户端:

* [Linux 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v1.0/filestorm.tar)
<!-- * [Windows 可执行文件包]()
* [MAC OS 可执行文件包]() -->


### 墨客女娲版本 1.0.2:

发布日期: 08/10/2018

感谢墨客社区的大力支持，墨客主网顺利地从盘古版本升级到女娲。本次发布的主链节点和子链服务器1.0.2版本可以在主网和101测试网上运行子链。目前我们在测试网上已经部署了一些子链所需的服务，请参考[测试网101子链部署信息](https://nodes101.moac.io/) 和[如何运行SCS服务器](https://github.com/MOACChain/moac-core/wiki/MicroChainSCSMining).

**下载链接**

主链节点服务器（VNODE）

* [Linux 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v1.0.2/nuwa-vnode1.0.2.ubuntu.tar.gz)
* [Windows 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v1.0.2/nuwa-vnode1.0.2.win.zip)
* [MAC OS 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v1.0.2/nuwa-vnode1.0.2.mac.tar.gz)
   

子链服务器（SCS）

* [Linux 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v1.0.2/nuwa-scs1.0.2.ubuntu.tar.gz)
* [Windows 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v1.0.2/nuwa-scs1.0.2.zip)
* [MAC OS 可执行文件包](https://github.com/MOACChain/moac-core/releases/download/v1.0.2/nuwa-scs1.0.2.mac.tar.gz)


### 墨客女娲版本 1.0.1:

发布日期: 08/01/2018

解决一些服务器无法正确接收event subscription的问题。

### 墨客女娲版本 1.0.0:

发布日期: 07/31/2018

**主要更新：**

* 墨客主链客户端（VNODE），可以在正式网络和测试网络连接子链服务器（SCS），以部署子链（MicroChain）。
* 可以通过主链客户端在主链和测试链上部署子链，步骤可以参考WIKI部分说明. 
* 主链客户端可以参与子链挖矿并获得奖励。
* 提供一个使用POS共识的子链模板。


**可用功能：**

* 允许主网子链挖矿。
* 支持子链分片。
* 支持IPFS子链部署。
* 支持无币区块链部署。

**下载链接**

主链节点服务器（VNODE）

* [Binary package for Linux](https://github.com/MOACChain/moac-core/releases/download/v1.0.0/nuwa1.0.0.ubuntu.tar.gz)
* [Binary package for Windows](https://github.com/MOACChain/moac-core/releases/download/v1.0.0/nuwa1.0.0.win.zip)
* [Binary package for MAC OS](https://github.com/MOACChain/moac-core/releases/download/v1.0.0/nuwa1.0.0.mac.tar.gz)

子链服务器（SCS）

将于8月8日公布


### 墨客盘古版本 0.8.4:

发布日期: 06/30/2018

本版本仅适用在测试网络（testnet, id=101）

**主要更新**

* 子链服务器(SCS)目前可以与测试网络连接，参与子链（MicroChain）的验证，并从中获得挖矿奖励.
* 墨客链客户端（VNODE），可以连接测试网络和SCS服务器.
* 测试链上可以部署子链，步骤可以参考WIKI部分说明. 

**工具网站**

* [MOAC explorer](http://explorer.moac.io/), (*mainnet*)：主网浏览器，可以看到区块状态，[帐号列表](), [发行的ERC20代币](http://explorer.moac.io/tokenlist20), 和 [发行的ERC721代币](http://explorer.moac.io/tokenlist721)
* [MOAC testnet explorer](http://47.75.144.55:3000/home), (*testnet*)：测试网络浏览器。
* [MOAC online wallet](https://moacwalletonline.com/): 可以使用KEYSTORE JSON文件来发送交易

**墨客社区网站**

* [Official Website](https://moac.io)：官方主网
* [Blog/Medium](https://medium.com/@moac_io)
* [Facebook](https://www.facebook.com/moacchain/)
* [Twitter](https://twitter.com/moac_io)
* [Reddit](https://www.reddit.com/r/MOAC/)
* [LinkedIn](https://www.linkedin.com/company/moac-chain)
* [Telegram Developers](https://t.me/MOACDevelopers)
* [墨客中文电报群](https://t.me/moacchina)
* [Youtube for Developers](https://www.youtube.com/channel/UC_U54wsGNrm_Yivj5bH9i7Q)

### 墨客盘古 0.8.2 发布:

发布日期: 04/30/2018

This release is for both mainnet and testnet. 
The mainnet was launched on April 30th, 2018.

**主要更新**

* Added the community message in the [genesis block](http://explorer.moac.io/block/0). 
* Updated the system contract to fix future send issue.
* The SCS ports were loaded and will be ready to use after the mainnet is launched and testing is finished for SCS.
* Fixed an issue of pending transactions . 
* Removed config file and put the configs in the source files.
* [MOAC explorer](http://explorer.moac.io/), (*mainnet*)
* [MOAC testnet explorer](http://47.75.144.55:3000/home), (*testnet*)

### 墨客盘古 0.8.1 发布:

发布日期: 04/18/2018

This release is for testnet only. The mainnet will be available in late April.

**主要更新**

* The network ID changed to 99 (mainnet) and 101 (testnet) to adopt the EIP155 specification.
* Fixed a previous "no data attached" issue in contract deploying.
* Added config file vnodeconfig.json.
* [MOAC explorer](http://explorer.moac.io/), (*new version connect to the testnet 101*)
* [Mining], (*provided by third party， updated to the new testnet 101*)
* [Faucet], (*provided by third party*)

### 墨客盘古 0.8.0 发布:

发布日期: 3/31/2018

This release is for testnet only. The mainnet will be available in April.

**主要更新**

* V-node module，
* Smart Contract Service (POS) module (*in April*)，
* [chain3 lib](https://github.com/innowells/Chain3)，
* [MOAC explorer](http://explorer.moac.io/),
* [Mining], (*provided by third parties*)
* [Wallets]， (*provided by third parties*)

**可用功能：**

* v-node mining
* SCS mining
* Sharding
* System contract for auto trigger, hash lock
* Subchain Protocol contract for SCS miner registration
* Subchain contract for Dapp configuration and flush control
* wallet

### 可执行文件包:

A stable release Pangu 0.8.2 is released April 30th, 2018.

墨客主网络（mainnet，id=99）的默认路径为:

	Mac: ~/Library/MoacNode
	Linux: ~/.moac
	Windows: %APPDATA%\MOAC

测试网络（testnet，id=101）的默认路径为:

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

#### 运行'scsserver'

必须在含有'scsserver'文件的文件夹中，运行

	./scsserver

#### 命令行中的例子

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

#### 命令行下的Javascript文件例子

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

#### 墨客社区创世语

在墨客链启动前，向社区征集了创世语，并储存在一个智能合约中。使用者可以通过下面的调用来查看创世语。

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
