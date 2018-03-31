## MOAC Pangu 0.8 testnet
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

### Packages:

1. Setup
--Debian/Ubuntu/CentOS--
This version only work with "--test" option, not working with mainnet yet.  
Untar the file using tar, under the directory
./moac --testnet

To see the help, use
./moac --help

To enable the console, can use:
./moac --testnet console

A testnet directory will be created under $HOME/.moac/testnet/
and some info should be seen as:

    IPC endpoint opened: /home/user/.moac/testnet/moac.ipc 

from another terminal, run moac again to attach the running node
./moac attach $HOME/.moac/testnet/moac.ipc


--Windows--
This version only work with "--test" option, not working with mainnet yet.  
Untar the file using tar, under the directory
moac --testnet

To see the help, use
moac --help

To enable the console, can use:
moac --testnet console

A testnet directory will be created under C:\Users\xxxxxx\AppData\Roaming\MoacNode
and some info should be seen as:

    IPC endpoint opened: \\.\pipe\moac.ipc

from another terminal, run moac again to attach the running node
moac attach 


2. from console prompt, create coinbase account
>personal.newAccount()

3. from console prompt, start mining by running
>miner.start()

4. from another terminal, run moac again to attach the running node
moac attach

5. from prompt, load script
>loadScript("mctest.js")

6. check if miner has mined any moac by checking:
>mc.accounts

7. create another account
>personal.newAccount()


8. try send from one account to another:
>Send(mc.accounts[0], '', mc.accounts[1], 0.1)



--Test file--
This testpackage contains a js file for testing purpose.
To use, under the console:
>loadScript("mctest.js")

FutureSend is a good example to test the System Contract
performance. It will send a mc transaction using the 
System Contract at a certain block. If the input block
number is smaller than current block number, the transaction
will fail.



