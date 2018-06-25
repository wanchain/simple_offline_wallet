const fs = require('fs');
const wanUtil = require('wanchain-util');

const config = require('../config.js');
const web3 = require('../web3/initweb3.js');
const ASyncLoopStack = require('./ASyncLoopStack.js');
const sendList = JSON.parse(fs.readFileSync('./sendList.json'));

if (fs.existsSync('./sendList_charge.json')) {
    let sendList_charge = JSON.parse(fs.readFileSync('./sendList_charge.json'));
    if (sendList_charge && sendList_charge.ChargePrivacyCoin) {
        sendList.ChargePrivacyCoin = sendList_charge.ChargePrivacyCoin;
    }
}

if (fs.existsSync('./sendList_refund.json')) {
    let sendList_refund = JSON.parse(fs.readFileSync('./sendList_refund.json'));
    if (sendList_refund && sendList_refund.refund) {
        sendList.refund = sendList_refund.refund;
    }
}

if (fs.existsSync('./wns/startAuction.json')) {
    let sendList_startAuction = JSON.parse(fs.readFileSync('./wns/startAuction.json'));
    if (sendList_startAuction && sendList_startAuction.start) {
        sendList.start = sendList_startAuction.start;
    }
}

if (fs.existsSync('./wns/newBid.json')) {
    let sendList_newbid = JSON.parse(fs.readFileSync('./wns/newBid.json'));
    if (sendList_newbid && sendList_newbid.newbid) {
        sendList.newbid = sendList_newbid.newbid;
    }
}

if (fs.existsSync('./wns/unsealBid.json')) {
    let sendList_unsealBid = JSON.parse(fs.readFileSync('./wns/unsealBid.json'));
    if (sendList_unsealBid && sendList_unsealBid.unsealBid) {
        sendList.unsealBid = sendList_unsealBid.unsealBid;
    }
}

if (fs.existsSync('./wns/finalizeAuction.json')) {
    let sendList_finalizeAuction = JSON.parse(fs.readFileSync('./wns/finalizeAuction.json'));
    if (sendList_finalizeAuction && sendList_finalizeAuction.finalizeAuction) {
        sendList.finalizeAuction = sendList_finalizeAuction.finalizeAuction;
    }
}

web3.wan = new wanUtil.web3Wan(web3);
web3.eth.getTransactionCount(sendList.from, function (err, result) {
    if (!err) {
        console.log(result);
        sendList.nonce = result;
        let OTALoop = new ASyncLoopStack(1);
        if (sendList.refund != null) {
            OTALoop.Array = sendList.refund;
            OTALoop.EachFunc = function (param, item, index) {
                web3.wan.getOTAMixSet(item.OTA, config.RingSignMixNum, function (err, result) {
                    if (!err) {
                        item.OTAset = result;
                    } else {
                        console.log(err.message);
                    }
                    OTALoop.stepNext();
                })
            }
        }
        OTALoop.EndFunc = function () {
            fs.writeFileSync('./output/sendListWithNonce.json', JSON.stringify(sendList, null, 4), "utf8");
            process.exit();
        }
        OTALoop.run();
    } else {
        console.log(err.message);
        process.exit();
    }
})