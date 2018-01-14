const fs = require('fs');
let web3 = require('../web3/initweb3.js');
let ASyncLoopStack = require('./ASyncLoopStack.js');
let transArray = JSON.parse(
    fs.readFileSync('./signTx.json'));
let transLoop = new ASyncLoopStack(1);
transLoop.Array = transArray;
let tranHashArray = [];
transLoop.EachFunc = function (param,item,index) {
    web3.eth.sendRawTransaction(item,function (err,result) {
        if(!err)
        {
            console.log(result);
            tranHashArray.push(result);
            transLoop.stepNext();
        }
        else
        {
            console.log(err.message);
            tranHashArray.push('');
            transLoop.stepNext();
        }
    })
}
transLoop.EndFunc = function () {
    console.log("send Transaction complete!");
    fs.writeFileSync('./transHash.json',JSON.stringify(tranHashArray,null,2),"utf8");
    console.log('transHash transaction data has been written in file ./transHash.json');
    process.exit();
}
transLoop.run();
