let web3 = require('../web3/initweb3.js');
const fs = require('fs');

let sendList = JSON.parse(fs.readFileSync('./sendList.json'));
web3.eth.getTransactionCount(sendList.from,function (err,result) {
    if(!err)
    {
        console.log(result);
        sendList.nonce = result;
        fs.writeFileSync('./sendList.json',JSON.stringify(sendList,null,2),"utf8");
        process.exit();
    }

})