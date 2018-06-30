## 墨客中文发布信息-盘古版

## [MOAC Pangu 0.8.x ](README.md)

### 墨客盘古 0.8.4 发布:

发布日期: 06/30/2018

本版本仅适用在测试网络（testnet, id=101）

**主要更新：**

* 智能合约服务器(SCS)目前可以与测试网络连接，参与子链（MicroChain）的验证，并从中获得挖矿奖励.
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
* [Youtube for Developers] (https://www.youtube.com/channel/UC_U54wsGNrm_Yivj5bH9i7Q)

### 墨客盘古 0.8.2 发布:

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

### 墨客盘古 0.8.1 发布:

Release Date: 04/18/2018

This release is for testnet only. The mainnet will be available in late April.

**Updates：**

* The network ID changed to 99 (mainnet) and 101 (testnet) to adopt the EIP155 specification.
* Fixed a previous "no data attached" issue in contract deploying.
* Added config file vnodeconfig.json.
* [MOAC explorer](http://explorer.moac.io/), (*new version connect to the testnet 101*)
* [Mining], (*provided by third party， updated to the new testnet 101*)
* [Faucet], (*provided by third party*)

### 墨客盘古 0.8.0 发布:

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

### 可执行文件包:

A stable release Pangu 0.8.2 is released April 30th, 2018.

墨客主网络（mainnet，id=101）的默认路径为:

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
