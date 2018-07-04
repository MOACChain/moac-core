## [墨客中文发布信息-盘古版](READMECH.md)

## MOAC Pangu 0.8.x 

### This release is for Pangu 0.8.4:

Release Date: 06/30/2018

This release is for testnet only. 

**Updates：**

* Smart Contract Server(SCS) is released for public testing. Users can run the SCS and connect to the testnet. They can also get mining rewards from MicroChain.
* The MOAC client can connect with SCSs.
* MicroChain can be deployed on SCSs with instructions. 

**Other tools and useful links**


* [MOAC explorer](http://explorer.moac.io/), (*mainnet*), network info, [Account list](), [ERC20 token](http://explorer.moac.io/tokenlist20), and [ERC721 token](http://explorer.moac.io/tokenlist721)
* [MOAC testnet explorer](http://47.75.144.55:3000/home), (*testnet*)
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

### This release is for MOAC project Pangu 0.8.2:

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

### This release is for MOAC project Pangu 0.8.1:

Release Date: 04/18/2018

This release is for testnet only. The mainnet will be available in late April.

**Updates：**

* The network ID changed to 99 (mainnet) and 101 (testnet) to adopt the EIP155 specification.
* Fixed a previous "no data attached" issue in contract deploying.
* Added config file vnodeconfig.json.
* [MOAC explorer](http://explorer.moac.io/), (*new version connect to the testnet 101*)
* [Mining], (*provided by third party， updated to the new testnet 101*)
* [Faucet], (*provided by third party*)

### This release is for MOAC project Pangu 0.8.0:

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
