const fs = require('fs');
const web3 = require('../web3/initweb3.js');
const ASyncLoopStack = require('./ASyncLoopStack.js');

const tranHashArray = [];
const transLoop = new ASyncLoopStack(1);

transLoop.Array = JSON.parse(fs.readFileSync('./output/signTx.json'));

transLoop.EachFunc = function (param, item, index) {
    web3.eth.sendRawTransaction(item, function (err, result) {
        if (!err) {
            console.log(result);
            tranHashArray.push(result);
            transLoop.stepNext();
        } else {
            console.log(err.message);
            tranHashArray.push('');
            transLoop.stepNext();
        }
    })
}
transLoop.EndFunc = function () {
    console.log("send Transaction complete!");
    fs.writeFileSync('./output/transHash.json', JSON.stringify(tranHashArray, null, 2), "utf8");
    console.log('transHash transaction data has been written in file ./output/transHash.json');
    process.exit();
}
transLoop.run();
