const fs = require('fs');
const {
    web3,
    namehash,
    ABIWNSRegistry,
    ABIAuctionRegistrar,
    ABIDeed
} = require('./index');

const wnsContract = web3.eth.contract(ABIWNSRegistry);
const wns = wnsContract.at('0xee8d418fd33e69782015ea4313dfd8eb7b1b91ce');

const auctionRegistrarContract = web3.eth.contract(ABIAuctionRegistrar);

const contractInstance = auctionRegistrarContract.at(wns.owner(namehash('wan')));

const deedContract = web3.eth.contract(ABIDeed);

let arrName = JSON.parse(fs.readFileSync('./domain.json'));

try {
    for (let i=0; i < arrName.length; i++) {
        let arrInfo = [
            'Name is available and the auction hasn\'t started',
            'Name is available and the auction has been started, the end time of the auction is ' + new Date(contractInstance.entries(web3.sha3(arrName[i]["WNS"]))[2].toNumber() * 1000),
            'Name is taken and currently owned by someone',
            'Name is forbidden',
            'Name is currently in the \'reveal\' stage of the auction \n' +
            'The current winning bidder is: ' +
            deedContract.at(contractInstance.entries(web3.sha3(arrName[i]["WNS"]))[1]).owner() +
            '\nthe current winning bid is: ' +
            web3.fromWei(contractInstance.entries(web3.sha3(arrName[i]["WNS"]))[4]) + ' WAN' +
            '\nthe end time of the auction is ' + new Date(contractInstance.entries(web3.sha3(arrName[i]["WNS"]))[2].toNumber() * 1000),
            'Name is not yet available due to the \'soft launch\' of names, it will be available for auction after ' + new Date(contractInstance.getAllowedTime(web3.sha3(arrName[i]["WNS"])) * 1000)
        ];

        let status = contractInstance.entries(web3.sha3(arrName[i]["WNS"]))[0].toString();
        console.log(arrName[i]["WNS"], arrInfo[status]);
        arrName[i].status = arrInfo[status];
    }

    console.log("正在写入文件...")
    fs.writeFileSync('./domain_result.json', JSON.stringify(arrName, null, 2), "utf8");
    console.log("文件写入完毕!")
} catch (err) {
    console.log(err)
}
