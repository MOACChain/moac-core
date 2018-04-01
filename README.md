## MOAC Pangu 0.8 
This release is for MOAC project Pangu 0.8.
Release Date： 3/31/2018
Major Progress：

* V-node module，
* Smart Contract Service (POS) module，
* chain3 lib，
* MOAC explorer

Available feature：

* v-node mining
* SCS mining
* Sharding
* System contract for auto trigger, hash lock
* Subchain Protocol contract for SCS miner registration
* Subchain contract for Dapp configuration and flush control
* wallet

### Binary Packages:

Current version only work with "--test" option, not working with mainnet yet. 


#### --Debian/Ubuntu/CentOS Linux--
 
Untar the file using tar, under the directory

	./moac --testnet

To enable the console, can use:

	./moac --testnet console

To see the help, use

	./moac --help


A testnet directory will be created under 

	$HOME/.moac/testnet/
and some info should be seen as:

    INFO [03-24|11:24:26.506] 86161:IPC endpoint closed: /home/user/.moac/testnet/moac.ipc 

from another terminal, run moac again to attach the running node

	./moac attach $HOME/.moac/testnet/moac.ipc

#### --Windows-- 

This version only work with "--test" option, not working with mainnet yet.

Untar the file using tar, under the directory 

	moac.exe --testnet

To see the help, use moac --help

To enable the console, can use: 

	moac.exe --testnet console

A testnet directory will be created under 

	C:\Users\xxxxxx\AppData\Roaming\MoacNode 
	
and some info should be seen as:

	IPC endpoint opened: \\.\pipe\moac.ipc
	
from another terminal, run moac again to attach the running node

	./moac.exe attach \\.\pipe\moac.ipc

#### --Example Console commands-- 

If console is not open, open the console using the instructions from above.

1. from console prompt, create coinbase account

	`> personal.newAccount()`

2. from console prompt, start mining by running

	`> miner.start()`

3. check if miner has mined any moac by checking:
	
	`> mc.getBalance(mc.accounts[0])`

4. create another account

	`> personal.newAccount()`

5. See the accounts

	`> mc.accounts`

#### --Example Console Javascript files-- 

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