/* Script to create MOAC RandDrop AppChain using compiled contract
 * 
 * Require:
 * 1. Valid account with enough moac to deploy the contracts;
 * 2. A running VNODE can connect and send Transaction to, need turn on personal in rpc api;
 --rpcapi "chain3,mc,net,vnode,personal,
 * 3. At least three SCSs, recommended 5;
 * 4. A VNODE used as proxy for the AppChain, with VNODE settings in the vnodeconfig.json;
 * 5. Three contract address from the following contracts:
 *    VnodeProtocolBase.sol - scsPoolAddr
 *    SCSProtocolBase.sol - vnodeProtocolBaseAddr
 *    ChainBaseASM.sol
 * 
 * Further Readings:
 * This script generates a AppChain with DAPPBase on it.
 * To deploy DAPP contracts on AppChain, check deployDappBase.js
 * To call the AppChain functions and Dapp functions, please check callDappExample.js.
 * 
 * For AppChain related info, please check online documents:
 * English:
 * https://moac-docs.readthedocs.io/en/latest
 * 中文：
 * https://moacdocs-chn.readthedocs.io/zh_CN/latest
 * 
*/

const Chain3 = require('chain3');

// need to have a valid account to use for contracts deployment
var baseaddr = "";//keystore address
var basepsd = "";//keystore password

// SCS server addresses
var scs=[]

var monitor=""
var via=""
var subchain=""
var vnodecontractaddr=""
var proto=""
var vssaddr=""

// The known SCS accounts on MOAC network
// the account data is in the scskeystore under the SCS running directory
scs=["0x1b65cE1A393FFd5960D2ce11E7fd6fDB9e991945",
         "0xecd1e094ee13d0b47b72f5c940c17bd0c7630326",
         "0x50C15fafb95968132d1a6ee3617E99cCa1FCF059",
         "0x9fab306379d4647ea333e2cf9d77013313226a1c",
         "0x29e9832842c131ce5a32f7f8e37be0e8dffc1e62",
        ]
// The SCS via is in the vnodeconfig.json
via="0xD814F2ac2c4cA49b33066582E4e97EBae02F2aB9";

function vnodeWithdraw(baseaddr,basename,vnodecontractaddr)
{
	var xContract=chain3.mc.contract(JSON.parse(vnodeabi));
	var xInstance=xContract.at(vnodecontractaddr);
	var data=xInstance.withdraw.getData()

	console.log(data)
	chain3.personal.unlockAccount(baseaddr,basename,0);
	sendtx(baseaddr,vnodecontractaddr,'0',data)
}


//函数
function sendtx(src, tgtaddr, amount, strData) {

        chain3.mc.sendTransaction(
                {
                        from: src,
                        value:chain3.toSha(amount,'mc'),
                        to: tgtaddr,
                        gas: "1000000",
                        gasPrice: chain3.mc.gasPrice,
                        data: strData
                });

        console.log('sending from:' +   src + ' to:' + tgtaddr  + ' with data:' + strData);

}
for( var i = 0;i<scs.length;i++){
	console.log(scs[i]);
	console.log(mc.getBalance(scs[i])/1E18)
}
function initscs(){
	sendmoactoscs(1)
	sendmoactomonitor(0.5)
}
//注意修改
function initregister(){
	protocolregisterAll(10)
	
}

function init2(){
	addFund(subchain,10)
//新版本取消	setToken()
//	updateOwner()
	registerOpen()
}

// Send mc to one SCS account 
function sendmoac(scs,num){
	chain3.personal.unlockAccount(baseaddr, basepsd,0);
	sendtx(baseaddr, scs, num ,'')
}

// Send to all SCSs
function sendmoactoscs(amount){
	for( var i = 0;i<scs.length;i++){
	sendmoac(scs[i],amount)
	}
}
function sendmoactomonitor(amount){
        for( var i = 0;i<monitor.length;i++){
        sendmoac(monitor[i],amount)
        }
}

function protocolregister(proto,num,scsid)
{
        chain3.personal.unlockAccount(baseaddr,basepsd,0);
        sendtx(baseaddr, proto, num,'0x4420e486000000000000000000000000' + scsid.substr(2, 100));
}

function protocolregisterAll(num){
	for( var i = 0;i<scs.length;i++){
	protocolregister(proto,num,scs[i])
	}
}

function registerOpen()
{
        chain3.personal.unlockAccount(baseaddr,basepsd,0);
        sendtx(baseaddr, subchain, '0','0x5defc56c' );
}

function registerClose()
{
        chain3.personal.unlockAccount(baseaddr,basepsd,0);
        sendtx(baseaddr, subchain, '0','0x69f3576f' );
}

function addFund(subchainaddr,num){
	chain3.personal.unlockAccount(baseaddr,basepsd,0);
        sendtx(baseaddr, subchainaddr, num,'0xa2f09dfa' )
}

//function setToken(){
//        chain3.personal.unlockAccount(baseaddr,basepsd,0);
//        sendtx(baseaddr, subchain, '0','0x144fa6d7000000000000000000000000'+direct.substr(2,100) );
//}
//function updateOwner(){
//        chain3.personal.unlockAccount(baseaddr,basepsd,0);
//        sendtx(baseaddr,direct, '0','0x880cdc31000000000000000000000000'+subchain.substr(2,100) );
//}
function testclose(subchainaddr){
        chain3.personal.unlockAccount(baseaddr,basepsd,0);
        sendtx(baseaddr, subchainaddr, '0','0x43d726d6' );
}

function registerAdd(subchain)
{
        chain3.personal.unlockAccount(baseaddr,basepsd,0);
        sendtx(baseaddr, subchain, '0','0xbe93f1b30000000000000000000000000000000000000000000000000000000000000009');
}


function sendshardingflagtx(baseaddr,basename,subchainaddr,amount,code,sf,n)
{       
        chain3.personal.unlockAccount(baseaddr,basename,0);
        //vias=['0xd344716b819fc0e8bb5935756e6ed8da6b3077b9','0xd344716b819fc0e8bb5935756e6ed8da6b3077b9']
        chain3.mc.sendTransaction(
                {       
                        from: baseaddr,
                  //      value:amount,
                        value:chain3.toSha(amount,'mc'),
                        to: subchainaddr,
                        gas: '0',//'200000',
                        gasPrice: '0',//chain3.mc.gasPrice,
                        ShardingFlag: sf,
                        data: code,
                        nonce: n,
                        via:via,
                });
                
        console.log('sending from:' + baseaddr + ' to:' + subchainaddr  + ' with nonce:' + n);
}

function subchaindeploycode(subchainaddr,code,nonce)
{
//        sendshardingflagtx(baseaddr,basepsd,subchainaddr,1000000000000000000000000,code,nonce)
	sendshardingflagtx(baseaddr,basepsd,subchainaddr,100000000,code,nonce)
}

function transferToken(recv, amount, subchainaddr, nonce)
{
        var data=deChatInstance.transferToken.getData(recv, amount)
        console.log(data)
        sendshardingflagtx(baseaddr,basename,subchainaddr,amount,data,nonce)
}
//createTopic(10, 10, '今年moac300刀吗？', subchainaddr1,1)
//data:0xd1ad7e35...
//改进：(1)一个账号连续投票；(2)lastProcBlk需要改进，不能每次从头开始应超过一定块号扣除基本费用自动关闭退回钱
//(3)各大参数用uint精度不够
function createTopic(amount, expblk, desc, subchainaddr, nonce)
{
        var award=chain3.toSha(amount,'mc')
        var data=deChatInstance.createTopic.getData(award, expblk, desc)
        console.log(data)
        sendshardingflagtx(baseaddr,basename,subchainaddr,'10',data,nonce)//transfer Token to dappa
}
//var topHash='0x' + 'c456527f086a32e01426623d164d03febc5461daf51495d688411d0891a3d863'
//creatSubTopic('是的', subchainaddr1,topHash,2)
function creatSubTopic(desc, subchainaddr,topHash, nonce)
{
        var data=deChatInstance.creatSubTopic.getData(topHash, desc)
        //var data ='0x957bceff' + '000000000000000000000000000000000000000000000000000000003b9aca01'
        console.log(data)
        sendshardingflagtx(baseaddr,basename,subchainaddr,'3',data,nonce)
}

//var subHash='0x' + '17068363937b53167d8e30e540b72d61bc6d35eb0c672d658e50910ad3b092f4'
//voteOnTopic(mc.accounts[1],'123',subchainaddr1,subHash, 0)
//voteOnTopic(mc.accounts[2],'123',subchainaddr1,subHash, 0)
function voteOnTopic(vote, basepsd, subchainaddr,subHash, nonce)
{
        var data=deChatInstance.voteOnTopic.getData(subHash)
        console.log(data)
        sendshardingflagtx(vote,basepsd,subchainaddr,'0',data,nonce)
}
//autoCheck(subchainaddr1, 3)
function autoCheck(subchainaddr, nonce)
{
        var data=deChatInstance.autoCheck.getData()
        console.log(data)
        sendshardingflagtx(baseaddr,basename,subchainaddr,'0',data,nonce)
}
//testRetures(subchainaddr1, nonce)
function testRetures(subchainaddr, nonce)
{
        var data=deChatInstance.testRetures.getData()
        console.log(data)
        sendshardingflagtx(baseaddr,basename,subchainaddr,'0',data,nonce)
}
// start ============== DeChat sol end =====================================================================

//setTopicStatus(subchainaddr1, topHash, 1, nonce)
function setTopicStatus(baseaddr,basename,subchainaddr, topHash, state, nonce)
{
        var data=deChatInstance.setTopicStatus.getData(topHash, state)
        console.log(data)
        sendshardingflagtx(baseaddr,basename,subchainaddr,'0',data,nonce)
}

//setSubTopicStatus(subchainaddr1, subHash, 1, nonce)
function setSubTopicStatus(subchainaddr, subHash, state, nonce)
{
        var data=deChatInstance.setSubTopicStatus.getData(subHash, state)
        console.log(data)
        sendshardingflagtx(baseaddr,basename,subchainaddr,'0',data,nonce)
}
//vnoderegister
var vnodeabi='[{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"vnodeList","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"randness","type":"uint256"}],"name":"pickRandomVnode","outputs":[{"name":"target","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdrawRequest","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"vnodeCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"vnode","type":"address"},{"name":"via","type":"address"},{"name":"link","type":"string"},{"name":"rpclink","type":"string"}],"name":"register","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"PEDNING_BLOCK_DELAY","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"outageReportList","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"level","type":"uint256"},{"name":"startpos","type":"uint256"},{"name":"count","type":"uint256"}],"name":"sweepOutage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"bondMin","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"isPerforming","outputs":[{"name":"res","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"vnodeStore","outputs":[{"name":"from","type":"address"},{"name":"bond","type":"uint256"},{"name":"state","type":"uint256"},{"name":"registerBlock","type":"uint256"},{"name":"withdrawBlock","type":"uint256"},{"name":"rpclink","type":"string"},{"name":"via","type":"address"},{"name":"link","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"vnode","type":"address"}],"name":"reportOutage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"WITHDRAW_BLOCK_DELAY","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"bmin","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}]'
var vnodebase=chain3.mc.contract(JSON.parse(vnodeabi)).at(vnodecontractaddr);
//
function vnoderegister(vnode,num,ip,rpcip){
        var xContract=chain3.mc.contract(JSON.parse(vnodeabi));
        var xInstance=xContract.at(vnodecontractaddr);
        var data=xInstance.register.getData(vnode, via,ip,rpcip)

        console.log(data)
        chain3.personal.unlockAccount(baseaddr,basename,0);
        sendtx(baseaddr,vnodecontractaddr,num,data)

}
//subchainabi
var subchainabi='[{"constant":false,"inputs":[{"name":"newVssBase","type":"address"}],"name":"setVssBase","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"maxMember","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"maxFlushInRound","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"blockReward","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"per_upload_redeemdata_num","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"pendingFlushIndex","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"index","type":"uint256"}],"name":"removeSyncNode","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"vssSlash","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"indexInlist","type":"uint256"},{"name":"hashlist","type":"bytes32[]"},{"name":"blocknum","type":"uint256[]"},{"name":"distAmount","type":"uint256[]"},{"name":"badactors","type":"uint256[]"},{"name":"viaNodeAddress","type":"address"},{"name":"preRedeemNum","type":"uint256"}],"name":"createProposal","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"BALANCE","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"nodeList","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMonitorInfo","outputs":[{"name":"","type":"address[]"},{"name":"","type":"string[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"nodeToReleaseCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"scsBeneficiary","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minMember","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"funcCode","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"senderType","type":"uint256"},{"name":"index","type":"uint256"}],"name":"requestReleaseImmediate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"senderType","type":"uint256"},{"name":"index","type":"uint256"}],"name":"requestRelease","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"consensusFlag","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"index","type":"uint256"}],"name":"BackupUpToDate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"proposals","outputs":[{"name":"proposedBy","type":"address"},{"name":"lastApproved","type":"bytes32"},{"name":"hash","type":"bytes32"},{"name":"start","type":"uint256"},{"name":"end","type":"uint256"},{"name":"flag","type":"uint256"},{"name":"startingBlock","type":"uint256"},{"name":"votecount","type":"uint256"},{"name":"viaNodeAddress","type":"address"},{"name":"preRedeemNum","type":"uint256"},{"name":"distributeFlag","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"num","type":"uint256"}],"name":"updatePerUploadRedeemNum","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"nodesToDispel","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getVnodeInfo","outputs":[{"components":[{"name":"protocol","type":"address"},{"name":"members","type":"uint256[]"},{"name":"rewards","type":"uint256[]"},{"name":"proposalExpiration","type":"uint256"},{"name":"VnodeProtocolBaseAddr","type":"address"},{"name":"penaltyBond","type":"uint256"},{"name":"subchainstatus","type":"uint256"},{"name":"owner","type":"address"},{"name":"BALANCE","type":"uint256"},{"name":"redeems","type":"uint256[]"},{"name":"nodeList","type":"address[]"},{"name":"nodesToJoin","type":"address[]"}],"name":"","type":"tuple"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"setOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getBlockNumber","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"close","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"monitors","outputs":[{"name":"from","type":"address"},{"name":"bond","type":"uint256"},{"name":"link","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"txReward","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"monitor","type":"address"},{"name":"link","type":"string"}],"name":"registerAsMonitor","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"scs","type":"address"}],"name":"getSCSRole","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"indexInlist","type":"uint256"},{"name":"hash","type":"bytes32"},{"name":"redeem","type":"bool"}],"name":"voteOnProposal","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"nodesWatching","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"registerOpen","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getVssBase","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"max_redeemdata_num","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"rebuildFromLastFlushPoint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"num","type":"uint256"}],"name":"updatePerRedeemNum","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"registerClose","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"currentRefundGas","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"buyMintToken","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"num","type":"uint256"}],"name":"updateRechargeCycle","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"nodeCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"address"},{"name":"link","type":"string"}],"name":"addSyncNode","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"beneficiary","type":"address"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"},{"name":"publickey","type":"bytes32"}],"name":"registerAsBackup","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"curFlushIndex","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"per_recharge_num","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"AUTO_RETIRE","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"penaltyBond","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getholdingPool","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"beneficiary","type":"address"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"},{"name":"publickey","type":"bytes32"}],"name":"registerAsSCS","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"protocol","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MONITOR_JOIN_FEE","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalBond","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastFlushBlk","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"recharge_cycle","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"addFund","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"per_redeemdata_num","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"vssbase","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"contractNeedFund","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"nodesToJoin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"nodePerformance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"num","type":"uint256"}],"name":"updatePerRechargeNum","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getFlushStatus","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"viaReward","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"userAddr","type":"address"},{"name":"holdingPoolPos","type":"uint256"}],"name":"getEnteringAmount","outputs":[{"name":"enteringAddr","type":"address[]"},{"name":"enteringAmt","type":"uint256[]"},{"name":"enteringtime","type":"uint256[]"},{"name":"rechargeParam","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalExchange","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"userAddr","type":"address"}],"name":"getRedeemRecords","outputs":[{"components":[{"name":"redeemAmount","type":"uint256[]"},{"name":"redeemtime","type":"uint256[]"}],"name":"","type":"tuple"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"},{"name":"index1","type":"uint8"},{"name":"index2","type":"uint8"}],"name":"matchSelTarget","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"priceOneGInMOAC","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"nodeToAdd","type":"uint256"}],"name":"registerAdd","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"MAX_DELETE_NUM","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"syncNodes","outputs":[{"name":"nodeId","type":"address"},{"name":"link","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getFlushInfo","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getEstFlushBlock","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"syncReward","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"hash","type":"bytes32"}],"name":"checkProposalStatus","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"types","type":"uint256"}],"name":"getProposal","outputs":[{"components":[{"name":"proposedBy","type":"address"},{"name":"lastApproved","type":"bytes32"},{"name":"hash","type":"bytes32"},{"name":"start","type":"uint256"},{"name":"end","type":"uint256"},{"name":"distributionAmount","type":"uint256[]"},{"name":"flag","type":"uint256"},{"name":"startingBlock","type":"uint256"},{"name":"voters","type":"uint256[]"},{"name":"votecount","type":"uint256"},{"name":"badActors","type":"uint256[]"},{"name":"viaNodeAddress","type":"address"},{"name":"preRedeemNum","type":"uint256"},{"name":"redeemAddr","type":"address[]"},{"name":"redeemAmt","type":"uint256[]"},{"name":"minerAddr","type":"address[]"},{"name":"distributeFlag","type":"uint256"},{"name":"redeemAgreeList","type":"address[]"}],"name":"","type":"tuple"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"proposalHashInProgress","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"hash","type":"bytes32"}],"name":"requestEnterAndRedeemAction","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"nodesToRelease","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"randIndex","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"indexInlist","type":"uint256"},{"name":"hash","type":"bytes32"}],"name":"requestProposalAction","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"isMemberValid","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"joinCntNow","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"AUTO_RETIRE_COUNT","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"initialFlushInRound","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"selTarget","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"reset","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"proposalHashApprovedLast","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"NODE_INIT_PERFORMANCE","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"VnodeProtocolBaseAddr","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"redeemAddr","type":"address[]"},{"name":"redeemAmt","type":"uint256[]"}],"name":"UploadRedeemData","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"monitor","type":"address"}],"name":"removeMonitorInfo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"MAX_GAS_PRICE","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"joinCntMax","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"dappRedeemPos","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"proposalExpiration","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"DEFLATOR_VALUE","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MONITOR_MIN_FEE","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"recv","type":"address"},{"name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"txNumInFlush","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalOperation","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"flushInRound","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"proto","type":"address"},{"name":"vnodeProtocolBaseAddr","type":"address"},{"name":"min","type":"uint256"},{"name":"max","type":"uint256"},{"name":"thousandth","type":"uint256"},{"name":"flushRound","type":"uint256"},{"name":"tokensupply","type":"uint256"},{"name":"exchangerate","type":"uint256"},{"name":"vssbaseAddr","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"message","type":"string"}],"name":"ReportStatus","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"TransferAmount","type":"event"}]'

var subchainbase=chain3.mc.contract(JSON.parse(subchainabi)).at(subchain)

function scsMonitor(scsid,subchainaddr,ip)
{
        var xContract=chain3.mc.contract(JSON.parse(subchainabi));
        var xInstance=xContract.at(subchainaddr);
        var data=xInstance.registerAsMonitor.getData(scsid,ip)

        console.log(data)
        chain3.personal.unlockAccount(baseaddr,basepsd,0);
        sendtx(baseaddr,subchainaddr,'1',data)


}

function registerAdd1(num)
{
        chain3.personal.unlockAccount(baseaddr,basepsd,0);
        var data=subchainbase.registerAdd.getData(num);
        console.log(data)
        sendtx(baseaddr,subchain,'0',data)

}


function removeMonitorInfo(subchainaddr,monitorid){
        var xContract=chain3.mc.contract(JSON.parse(subchainabi));
        var xInstance=xContract.at(subchainaddr);
        var data=xInstance.removeMonitorInfo.getData(monitorid)
        console.log(data)
        chain3.personal.unlockAccount(baseaddr,basename,0);
        sendtx(baseaddr,subchainaddr,'0',data)
}
function buyMintToken(sender,amount){
        var xContract=chain3.mc.contract(JSON.parse(subchainabi));
        var xInstance=xContract.at(subchain);
        var data=xInstance.buyMintToken.getData()
        console.log(data)
        chain3.personal.unlockAccount(sender,basepsd,0);
        sendtx(sender,subchain,amount,data)
}


protoabi='[{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"approvalAddresses","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"scs","type":"address"},{"name":"amount","type":"uint256"}],"name":"releaseFromSubchain","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"setSubchainActiveBlock","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"withdrawRequest","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"approvalAmounts","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"scs","type":"address"}],"name":"register","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"scs","type":"address"},{"name":"amount","type":"uint256"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"}],"name":"approveBond","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"scs","type":"address"},{"name":"amount","type":"uint256"}],"name":"forfeitBond","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"subChainLastActiveBlock","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"scsCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"scsApprovalList","outputs":[{"name":"bondApproved","type":"uint256"},{"name":"bondedCount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"PENDING_BLOCK_DELAY","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"scs","type":"address"},{"name":"subchain","type":"address"}],"name":"releaseRequest","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"scsArray","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"blk","type":"uint256"}],"name":"setSubchainExpireBlock","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"protocolType","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"subChainExpireBlock","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"scsList","outputs":[{"name":"from","type":"address"},{"name":"bond","type":"uint256"},{"name":"state","type":"uint256"},{"name":"registerBlock","type":"uint256"},{"name":"withdrawBlock","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bondMin","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"isPerforming","outputs":[{"name":"res","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"thousandth","type":"uint256"},{"name":"minnum","type":"uint256"}],"name":"getSelectionTarget","outputs":[{"name":"target","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"targetnum","type":"uint256"}],"name":"getSelectionTargetByCount","outputs":[{"name":"target","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"subChainProtocol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"WITHDRAW_BLOCK_DELAY","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"protocol","type":"string"},{"name":"bmin","type":"uint256"},{"name":"_protocolType","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"scs","type":"address"}],"name":"Registered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"}],"name":"UnRegistered","type":"event"}]'

var protobase=chain3.mc.contract(JSON.parse(protoabi)).at(proto);


function deploydappbase(subchainaddr,nonce){
var code="0x606060405260068054600160a060020a03191633600160a060020a03161790556111368061002e6000396000f3006060604052600436106100985763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166310ba0499811461009d57806312df94121461010b57806331a06771146101e1578063442e95b11461023057806357058a33146103305780635b1222b4146103965780635b15270c146103c857806389739c5b14610480578063f2096c3b14610488575b600080fd5b34156100a857600080fd5b6100f7600460248135818101908301358060208181020160405190810160405280939291908181526020018383602002808284375094965050509235600160a060020a031692506104ad915050565b604051901515815260200160405180910390f35b341561011657600080fd5b6101df60048035906044602480359081019083013580602081810201604051908101604052809392919081815260200183836020028082843782019150505050505091908035906020019082018035906020019080806020026020016040519081016040528093929190818152602001838360200280828437820191505050505050919080359060200190820180359060200190808060200260200160405190810160405280939291908181526020018383602002808284375094965061050695505050505050565b005b34156101ec57600080fd5b6101df60046024813581810190830135806020818102016040519081016040528093929190818152602001838360200280828437509496506108ec95505050505050565b341561023b57600080fd5b610252600160a060020a0360043516602435610ad1565b60405180806020018060200180602001848103845287818151815260200191508051906020019060200280838360005b8381101561029a578082015183820152602001610282565b50505050905001848103835286818151815260200191508051906020019060200280838360005b838110156102d95780820151838201526020016102c1565b50505050905001848103825285818151815260200191508051906020019060200280838360005b83811015610318578082015183820152602001610300565b50505050905001965050505050505060405180910390f35b341561033b57600080fd5b610343610d6d565b60405160208082528190810183818151815260200191508051906020019060200280838360005b8381101561038257808201518382015260200161036a565b505050509050019250505060405180910390f35b34156103a157600080fd5b6103ac600435610dd6565b604051600160a060020a03909116815260200160405180910390f35b34156103d357600080fd5b6103e7600160a060020a0360043516610dfe565b604051808060200180602001838103835285818151815260200191508051906020019060200280838360005b8381101561042b578082015183820152602001610413565b50505050905001838103825284818151815260200191508051906020019060200280838360005b8381101561046a578082015183820152602001610452565b5050505090500194505050505060405180910390f35b6101df610f83565b341561049357600080fd5b61049b61100a565b60405190815260200160405180910390f35b6000805b83518110156104fa5782600160a060020a03168482815181106104d057fe5b90602001906020020151600160a060020a031614156104f257600191506104ff565b6001016104b1565b600091505b5092915050565b60008061056d600380548060200260200160405190810160405280929190818152602001828054801561056257602002820191906000526020600020905b8154600160a060020a03168152600190910190602001808311610544575b5050505050336104ad565b151561057857600080fd5b835185511461058657600080fd5b600b54861461059457600080fd5b8585858560405180858152602001848051906020019060200280838360005b838110156105cb5780820151838201526020016105b3565b50505050905001838051906020019060200280838360005b838110156105fb5780820151838201526020016105e3565b50505050905001828051906020019060200280838360005b8381101561062b578082015183820152602001610613565b5050505090500194505050505060405190819003902060008181526004602052604090206002015490925060ff1615610663576108e4565b6106e160046000846000191660001916815260200190815260200160002060010180548060200260200160405190810160405280929190818152602001828054801561056257602002820191906000526020600020908154600160a060020a03168152600190910190602001808311610544575050505050336104ad565b15156108e4576000828152600460205260409020600190810180549091810161070a8382611010565b506000918252602090912001805473ffffffffffffffffffffffffffffffffffffffff191633600160a060020a03161790556003546002906000848152600460205260409020600101549190049011156108e457506000818152600460205260408120600201805460ff191660011790555b84518110156108d85760078054600181016107978382611010565b916000526020600020900160008784815181106107b057fe5b906020019060200201518254600160a060020a039182166101009390930a92830291909202199091161790555060088054600181016107ef8382611010565b9160005260206000209001600086848151811061080857fe5b90602001906020020151909155505060098054600181016108298382611010565b506000918252602090912042910155600a80546001810161084a8382611010565b9160005260206000209001600085848151811061086357fe5b9060200190602002015190915550859050818151811061087f57fe5b90602001906020020151600160a060020a03166108fc8583815181106108a157fe5b906020019060200201519081150290604051600060405180830381858888f1935050505015156108d057600080fd5b60010161077c565b8451600b805490910190555b505050505050565b6006546000908190819033600160a060020a039081169116141561091f57600384805161091d929160200190611039565b505b8360405180828051906020019060200280838360005b8381101561094d578082015183820152602001610935565b5050505090500191505060405180910390209250600360405180828054801561099f57602002820191906000526020600020905b8154600160a060020a03168152600190910190602001808311610981575b50509150506040519081900390209150828214156109bc57610acb565b610a3760056000856000191660001916815260200190815260200160002080548060200260200160405190810160405280929190818152602001828054801561056257602002820191906000526020600020908154600160a060020a03168152600190910190602001808311610544575050505050336104ad565b9050801515610acb576000838152600560205260409020805460018101610a5e8382611010565b506000918252602090912001805473ffffffffffffffffffffffffffffffffffffffff191633600160a060020a031617905560028451811515610a9d57fe5b600085815260056020526040902054919004901115610acb576003848051610ac9929160200190611039565b505b50505050565b610ad96110ad565b610ae16110ad565b610ae96110ad565b600080610af46110ad565b610afc6110ad565b610b046110ad565b60009450849350600160a060020a038a1615610b74578893505b600054841015610b6f5760008054600160a060020a038c16919086908110610b4257fe5b600091825260209091200154600160a060020a03161415610b64576001909401935b600190930192610b1e565b610b80565b60005489900394909401935b84604051805910610b8e5750595b9080825280602002602001820160405250925084604051805910610baf5750595b9080825280602002602001820160405250915084604051805910610bd05750595b90808252806020026020018201604052509050600094508893505b600054841015610d5d57600160a060020a038a1615610ca55760008054600160a060020a038c16919086908110610c1e57fe5b600091825260209091200154600160a060020a03161415610ca0576001805485908110610c4757fe5b906000526020600020900154828681518110610c5f57fe5b602090810290910101526002805485908110610c7757fe5b906000526020600020900154818681518110610c8f57fe5b602090810290910101526001909401935b610d52565b6000805485908110610cb357fe5b600091825260209091200154600160a060020a0316838681518110610cd457fe5b600160a060020a039092166020928302909101909101526001805485908110610cf957fe5b906000526020600020900154828681518110610d1157fe5b602090810290910101526002805485908110610d2957fe5b906000526020600020900154818681518110610d4157fe5b602090810290910101526001909401935b600190930192610beb565b9199909850909650945050505050565b610d756110ad565b6003805480602002602001604051908101604052809291908181526020018280548015610dcb57602002820191906000526020600020905b8154600160a060020a03168152600190910190602001808311610dad575b505050505090505b90565b6003805482908110610de457fe5b600091825260209091200154600160a060020a0316905081565b610e066110ad565b610e0e6110ad565b600080610e196110ad565b610e216110ad565b60009250600093505b600b54841015610e7b5760078054600160a060020a038916919086908110610e4e57fe5b600091825260209091200154600160a060020a03161415610e70576001909201915b600190930192610e2a565b82604051805910610e895750595b9080825280602002602001820160405250915082604051805910610eaa5750595b9080825280602002602001820160405250905060009250600093505b600b54841015610f775760078054600160a060020a038916919086908110610eea57fe5b600091825260209091200154600160a060020a03161415610f6c576008805485908110610f1357fe5b906000526020600020900154828481518110610f2b57fe5b602090810290910101526009805485908110610f4357fe5b906000526020600020900154818481518110610f5b57fe5b602090810290910101526001909201915b600190930192610ec6565b90969095509350505050565b6000805460018101610f958382611010565b506000918252602090912001805473ffffffffffffffffffffffffffffffffffffffff191633600160a060020a031617905560018054808201610fd88382611010565b5060009182526020909120349101556002805460018101610ff98382611010565b506000918252602090912042910155565b600b5481565b815481835581811511611034576000838152602090206110349181019083016110bf565b505050565b82805482825590600052602060002090810192821561109d579160200282015b8281111561109d578251825473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a039190911617825560209290920191600190910190611059565b506110a99291506110d9565b5090565b60206040519081016040526000815290565b610dd391905b808211156110a957600081556001016110c5565b610dd391905b808211156110a957805473ffffffffffffffffffffffffffffffffffffffff191681556001016110df5600a165627a7a7230582080204de5c86ad5f7a7ff60a40ee609308104cef33209c881c4f162330fd1481b0029"

sendshardingflagtx(baseaddr,basepsd,subchainaddr,100000000,code,nonce)
//subchaindeploycode(subchainaddr,code,nonce)
}


//dappfunc
//dappdeploy(baseaddr,basepsd,subchain,0)
function dappdeploy(baseaddr,basename,subchainaddr,nonce)
{
var code=""
sendshardingflagtx(baseaddr,basename,subchainaddr,100000000,code,'0x3',nonce)

}
//subchaintansfer(send,basepsd,subchain,amount,recive,n)
function subchaintansfer(baseaddr,basename,subchain,amount,code,n)
{
sendshardingflagtx(baseaddr,basename,subchain,amount,code,'0x2',n)
}


//dechat1


var dappBaseAddr=""
var dappBaseABI = '[{\"constant\":true,\"inputs\":[{\"name\":\"addrs\",\"type\":\"address[]\"},{\"name\":\"addr\",\"type\":\"address\"}],\"name\":\"have\",\"outputs\":[{\"name\":\"\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"pos\",\"type\":\"uint256\"},{\"name\":\"tosend\",\"type\":\"address[]\"},{\"name\":\"amount\",\"type\":\"uint256[]\"},{\"name\":\"times\",\"type\":\"uint256[]\"}],\"name\":\"postFlush\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"dappAddr\",\"type\":\"address\"}],\"name\":\"getDappABI\",\"outputs\":[{\"name\":\"\",\"type\":\"string\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"dappAddr\",\"type\":\"address\"},{\"name\":\"dappOwner\",\"type\":\"address\"},{\"name\":\"dappABI\",\"type\":\"string\"},{\"name\":\"state\",\"type\":\"uint256\"}],\"name\":\"updateDapp\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"newlist\",\"type\":\"address[]\"}],\"name\":\"updateNodeList\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"userAddr\",\"type\":\"address\"},{\"name\":\"pos\",\"type\":\"uint256\"}],\"name\":\"getRedeemMapping\",\"outputs\":[{\"name\":\"redeemingAddr\",\"type\":\"address[]\"},{\"name\":\"redeemingAmt\",\"type\":\"uint256[]\"},{\"name\":\"redeemingtime\",\"type\":\"uint256[]\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"getCurNodeList\",\"outputs\":[{\"name\":\"nodeList\",\"type\":\"address[]\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"curNodeList\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"userAddr\",\"type\":\"address\"}],\"name\":\"getEnterRecords\",\"outputs\":[{\"name\":\"enterAmt\",\"type\":\"uint256[]\"},{\"name\":\"entertime\",\"type\":\"uint256[]\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"dappAddr\",\"type\":\"address\"}],\"name\":\"removeDapp\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"getDappList\",\"outputs\":[{\"components\":[{\"name\":\"dappAddr\",\"type\":\"address\"},{\"name\":\"owner\",\"type\":\"address\"},{\"name\":\"dappABI\",\"type\":\"string\"},{\"name\":\"state\",\"type\":\"uint256\"}],\"name\":\"\",\"type\":\"tuple[]\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"\",\"type\":\"address\"}],\"name\":\"dappRecord\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"dappAddr\",\"type\":\"address\"}],\"name\":\"getDappState\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"dappList\",\"outputs\":[{\"name\":\"dappAddr\",\"type\":\"address\"},{\"name\":\"owner\",\"type\":\"address\"},{\"name\":\"dappABI\",\"type\":\"string\"},{\"name\":\"state\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[],\"name\":\"redeemFromMicroChain\",\"outputs\":[],\"payable\":true,\"stateMutability\":\"payable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"dappAddr\",\"type\":\"address\"},{\"name\":\"dappOwner\",\"type\":\"address\"},{\"name\":\"dappABI\",\"type\":\"string\"}],\"name\":\"registerDapp\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"enterPos\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"payable\":true,\"stateMutability\":\"payable\",\"type\":\"constructor\"}]'

var dappBaseContract=chain3.mc.contract(JSON.parse(dappBaseABI));
var dappBaseInstance=dappBaseContract.at(dappBaseAddr);

var ercaddr=""
var ercabi="[{\"constant\":true,\"inputs\":[],\"name\":\"name\",\"outputs\":[{\"name\":\"\",\"type\":\"string\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_spender\",\"type\":\"address\"},{\"name\":\"_value\",\"type\":\"uint256\"}],\"name\":\"approve\",\"outputs\":[{\"name\":\"\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"totalSupply\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_from\",\"type\":\"address\"},{\"name\":\"_to\",\"type\":\"address\"},{\"name\":\"_value\",\"type\":\"uint256\"}],\"name\":\"transferFrom\",\"outputs\":[{\"name\":\"\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"INITIAL_SUPPLY\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"decimals\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[],\"name\":\"unpause\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"paused\",\"outputs\":[{\"name\":\"\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_spender\",\"type\":\"address\"},{\"name\":\"_subtractedValue\",\"type\":\"uint256\"}],\"name\":\"decreaseApproval\",\"outputs\":[{\"name\":\"success\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"_owner\",\"type\":\"address\"}],\"name\":\"balanceOf\",\"outputs\":[{\"name\":\"balance\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[],\"name\":\"pause\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"symbol\",\"outputs\":[{\"name\":\"\",\"type\":\"string\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_to\",\"type\":\"address\"},{\"name\":\"_value\",\"type\":\"uint256\"}],\"name\":\"transfer\",\"outputs\":[{\"name\":\"\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_spender\",\"type\":\"address\"},{\"name\":\"_addedValue\",\"type\":\"uint256\"}],\"name\":\"increaseApproval\",\"outputs\":[{\"name\":\"success\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"_owner\",\"type\":\"address\"},{\"name\":\"_spender\",\"type\":\"address\"}],\"name\":\"allowance\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"transferOwnership\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"a\",\"type\":\"address\"},{\"name\":\"b\",\"type\":\"uint256\"}],\"name\":\"withdraw\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[],\"name\":\"Pause\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[],\"name\":\"Unpause\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"name\":\"previousOwner\",\"type\":\"address\"},{\"indexed\":true,\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"OwnershipTransferred\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"name\":\"owner\",\"type\":\"address\"},{\"indexed\":true,\"name\":\"spender\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"Approval\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"name\":\"from\",\"type\":\"address\"},{\"indexed\":true,\"name\":\"to\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"Transfer\",\"type\":\"event\"}]"
var ercContract=chain3.mc.contract(JSON.parse(ercabi));
var ercInstance=ercContract.at(ercaddr);
function erctransfer(subchainaddr,address,amount,nonce)
{
        var data=ercInstance.transfer.getData(address,amount)
        var input = ercaddr + data.substr(2, data.length-2)
        console.log(input)
        sendshardingflagtx(baseaddr,basepsd,subchainaddr,'0',input,'0x1',nonce)//transfer Token to dappa
}





//registerDapp(subchain,addr,abi,nonce)
function registerDapp(subchainaddr,dappaddress,dappabi,nonce)
{
        var data=dappBaseInstance.registerDapp.getData(dappaddress, baseaddr, dappabi)
        var input = dappBaseAddr + data.substr(2, data.length-2)
        console.log(input)
        sendshardingflagtx(baseaddr,basepsd,subchainaddr,'0',input,'0x1',nonce)//transfer Token to dappa
}
function redeemFromMicroChain(subchain,amount,nonce)
{
        var data=dappBaseInstance.redeemFromMicroChain.getData()
        var input = dappBaseAddr + data.substr(2, data.length-2)
        console.log(input)
        sendshardingflagtx(baseaddr,basepsd,subchain,amount,input,'0x1',nonce)//transfer Token to dappa


}
function removeDapp(dappaddr,nonce)
{       
        var data=dappBaseInstance.removeDapp.getData(dappaddr)
        var input = dappBaseAddr + data.substr(2, data.length-2)
        console.log(input)
        sendshardingflagtx(baseaddr,basepsd,subchain,'0',input,'0x1',nonce)
}


function moredechatdeploy(subchain,nonce)
{

}

// VSS Contract

var vssabi='[{"constant":true,"inputs":[],"name":"getActiveVSSMemberCount","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"revealed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"resetVSSGroup","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"int256"}],"name":"slashed","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"nodes","type":"address[]"}],"name":"getVSSNodesPubkey","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastSender","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"violator","type":"address"},{"name":"pubShare","type":"bytes"},{"name":"pubSig","type":"bytes"},{"name":"priShare","type":"bytes"},{"name":"priSig","type":"bytes"},{"name":"revealedPri","type":"bytes"}],"name":"reveal","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"nodes","type":"address[]"}],"name":"getVSSNodesIndexs","outputs":[{"name":"","type":"int256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"lastConfigUpload","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"int256"}],"name":"revealedReporter","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"int256"},{"name":"","type":"address"}],"name":"slashingVoters","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"configVersion","type":"int256"}],"name":"vote","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"slowNodeThreshold","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getBlockNumber","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"scs","type":"address"}],"name":"getSCSRole","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastNodeChangeConfigVersion","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"int256"}],"name":"revealedViolator","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"index","type":"int256"},{"name":"slash","type":"bool"}],"name":"slashing","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"revealedSigMapping","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"int256"}],"name":"slashingRejects","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"int256"}],"name":"slowNodeVotes","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"lastSlashingVoted","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"int256"}],"name":"reveals","outputs":[{"name":"PubShare","type":"bytes"},{"name":"PubSig","type":"bytes"},{"name":"PriShare","type":"bytes"},{"name":"PriSig","type":"bytes"},{"name":"Revealed","type":"bytes"},{"name":"Violator","type":"address"},{"name":"Whistleblower","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"violator","type":"address"}],"name":"reportSlowNode","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"lastNodeChangeBlock","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"getLastSlashVoted","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"node","type":"address"}],"name":"getPublicShares","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"index","type":"int256"}],"name":"getRevealedShare","outputs":[{"components":[{"name":"PubShare","type":"bytes"},{"name":"PubSig","type":"bytes"},{"name":"PriShare","type":"bytes"},{"name":"PriSig","type":"bytes"},{"name":"Revealed","type":"bytes"},{"name":"Violator","type":"address"},{"name":"Whistleblower","type":"address"}],"name":"","type":"tuple"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"configVersion","type":"int256"}],"name":"isConfigReady","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"node","type":"address"}],"name":"getPrivateShares","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"int256"}],"name":"slashingVotes","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"vssThreshold","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"vssNodeMemberships","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"revealIndex","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"int256"},{"name":"","type":"address"}],"name":"voters","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"configVersion","type":"int256"}],"name":"isSlashed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"GetLastSender","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"lastConfigUploadByBlock","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"vssConfigVersion","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"callerAddr","type":"address"}],"name":"setCaller","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"publicShares","type":"bytes"},{"name":"privateShares","type":"bytes"}],"name":"uploadVSSConfig","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"vssNodeCount","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"int256"}],"name":"votes","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"GetCaller","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"int256"},{"name":"","type":"address"}],"name":"slowNodeVoted","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"sender","type":"address"}],"name":"deactivateVSS","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"sender","type":"address"}],"name":"activateVSS","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getActiveVSSMemberList","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"sender","type":"address"},{"name":"publickey","type":"bytes32"}],"name":"registerVSS","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newThreshold","type":"int256"}],"name":"setThreshold","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"sender","type":"address"}],"name":"unregisterVSS","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"scs","type":"address"}],"name":"getVSSNodeIndex","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"caller","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"threshold","type":"int256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]'
var vssbasea=chain3.mc.contract(JSON.parse(vssabi)).at(vssaddr);
//setCaller(subchain)
function setCaller(addr){
        var data=vssbasea.setCaller.getData(addr)
        console.log(data)
	sendtx(baseaddr,vssaddr,'0',data)
}
function resetVSSGroup()
{
	var data=vssbasea.resetVSSGroup.getData()
	console.log(data)
        sendtx(baseaddr,vssaddr,'0',data)

}

function incBlockThreshold(addr,nonce){


code=dappBaseAddr+"5ddc1bf30000000000000000000000000000000000000000000000000000000000002710"
sendshardingflagtx(addr,basepsd,subchain,'0',code,'0x1',nonce)
//code="0x143f274849A01b757323e8d502504eb33F3B49DB5ddc1bf30000000000000000000000000000000000000000000000000000000000000064"
}

