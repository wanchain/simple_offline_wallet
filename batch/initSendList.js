let web3 = require('../web3/initweb3.js');
const fs = require('fs');
let config = require('../config.js');
let ASyncLoopStack = require('./ASyncLoopStack.js');
let sendList = JSON.parse(fs.readFileSync('./sendList.json'));
let wanUtil = require('wanchain-util');
web3.wan = new wanUtil.web3Wan(web3);
web3.eth.getTransactionCount(sendList.from,function (err,result) {
    if(!err)
    {
        console.log(result);
        sendList.nonce = result;
        let OTALoop = new ASyncLoopStack(1);
        if (sendList.refund != null){
            OTALoop.Array = sendList.refund;
            OTALoop.EachFunc = function (param,item,index) {
                web3.wan.getOTAMixSet(item.OTA,config.RingSignMixNum,function (err,result) {
                    if(!err)
                    {
                        item.OTAset = result;
                    }
                    else
                    {
                        console.log(err.message);
                    }
                    OTALoop.stepNext();
                })
            }
        }
        OTALoop.EndFunc = function () {
            fs.writeFileSync('./sendListWithNonce.json',JSON.stringify(sendList,null,4),"utf8");
            process.exit();
        }
        OTALoop.run();
    }

})