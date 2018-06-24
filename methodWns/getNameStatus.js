const { web3, namehash, ABIWNSRegistry, ABIAuctionRegistrar, ABIDeed } = require('./index');

if (process.argv[2] === undefined) {
    console.log('Please enter a vaild domain name');
    process.exit(0);
}

const name = process.argv[2];

// 0x9c1a5a0bd9fdd85847608e694f3e6e0768a6db59, JIAN
// 0xe85cfdf43a0db4aa0ec054a57451af7c73d4625b, YING
var wnsContract = web3.eth.contract(ABIWNSRegistry);
var wns = wnsContract.at('0x9c1a5a0bd9fdd85847608e694f3e6e0768a6db59');

var auctionRegistrarContract = web3.eth.contract(ABIAuctionRegistrar);
var contractInstance = auctionRegistrarContract.at(wns.owner(namehash('wan')));

var deedContract = web3.eth.contract(ABIDeed);

let arrInfo = [
    'Name is available and the auction hasn\'t started',
    'Name is available and the auction has been started, the end time of the auction is ' + new Date(contractInstance.entries(web3.sha3(name))[2].toNumber() * 1000),
    'Name is taken and currently owned by someone',
    'Name is forbidden',
    'Name is currently in the \'reveal\' stage of the auction \n' 
    + 'The current winning bidder is: ' 
    + deedContract.at(contractInstance.entries(web3.sha3(name))[1]).owner()
    + '\nthe current winning bid is: '
    + web3.fromWei(contractInstance.entries(web3.sha3(name))[4]) + ' WAN'
    + '\nthe end time of the auction is ' + new Date(contractInstance.entries(web3.sha3(name))[2].toNumber() * 1000),
    'Name is not yet available due to the \'soft launch\' of names, it will be available for auction after ' + new Date(contractInstance.getAllowedTime(web3.sha3(name)) * 1000)
];

const status = contractInstance.entries(web3.sha3(name))[0].toString();

console.log(arrInfo[status]);

process.exit(0);