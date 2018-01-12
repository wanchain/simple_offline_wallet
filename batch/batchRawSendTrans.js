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
    process.exit();
}
transLoop.run();
