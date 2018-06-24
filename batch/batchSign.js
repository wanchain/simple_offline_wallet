const fs = require('fs');
const privateKey = require('../Accounts/privateKey.js');
const PrivacySend = require('../transactions/privacyTrans.js');
const refundOTASend = require('../transactions/refundOTASend.js');
const StartAuction = require('../transactions/startAuction.js');
const getNewBid = require('../transactions/getNewBid.js');
const unsealBid = require('../transactions/unsealBid.js');
const finalizeAuction = require('../transactions/finalizeAuction.js');

const keyBidPath = require('../config').keyBidPath;
const CoinAmount = require('../interface/Amount.js').CoinAmount;
const normalTrans = require('../interface/transaction.js').NormalSend;

const sendList = JSON.parse(fs.readFileSync('./output/sendListWithNonce.json'));

let nonce = sendList.nonce;
let dataArray = [];
let OTAArray = [];
let password = '111111'
let fromKey = new privateKey(sendList.from, password);

if (fromKey.AKey) {
    if (sendList.normal && sendList.normal.length) {
        for (let i = 0; i < sendList.normal.length; i++, nonce++) {
            let item = sendList.normal[i];
            let newSend = new normalTrans(sendList.from, item.to, new CoinAmount(item.amount), nonce);
            let data = newSend.sign(fromKey.AKey);
            dataArray.push(data);
        }
    }

    if (sendList.ChargePrivacyCoin && sendList.ChargePrivacyCoin.length) {
        for (let i = 0; i < sendList.ChargePrivacyCoin.length; i++, nonce++) {
            let item = sendList.ChargePrivacyCoin[i];
            let privacy = new PrivacySend(sendList.from, item.to, new CoinAmount(item.facevalue), nonce);
            let data = privacy.sign(fromKey.AKey);
            dataArray.push(data);
            OTAArray.push(privacy.OTAinfo);
        }
    }

    if (sendList.refund && sendList.refund.length) {
        for (let i = 0; i < sendList.refund.length; i++, nonce++) {
            let item = sendList.refund[i];
            let refundOTA = new refundOTASend(sendList.from, fromKey, item.OTA, new CoinAmount(item.amount), item.OTAset, nonce);
            let data = refundOTA.sign(fromKey.AKey);
            dataArray.push(data);
        }
    }

    if (sendList.start && sendList.start.length) {
        for (let i = 0; i < sendList.start.length; i++, nonce++) {
            let item = sendList.start[i];
            let newSend = new StartAuction(item.name, sendList.from, item.to, nonce);
            let data = newSend.sign(fromKey.AKey);
            dataArray.push(data);
        }
    }

    if (sendList.newbid && sendList.newbid.length) {
        for (let i = 0; i < sendList.newbid.length; i++, nonce++) {
            let item = sendList.newbid[i];
            let newSend = new getNewBid(item.name, item.amount, item.bidValue, sendList.from, item.to, nonce);
            let data = newSend.sign(fromKey.AKey);
            dataArray.push(data);
        }
    }

    if (sendList.unsealBid && sendList.unsealBid.length) {
        for (let i = 0; i < sendList.unsealBid.length; i++, nonce++) {
            let item = sendList.unsealBid[i];
            let key = JSON.parse(fs.readFileSync(`${keyBidPath}${item.name}_${sendList.from}.json`)).key;
            let newSend = new unsealBid(item.name, item.unsealBidValue, sendList.from, item.to, key, nonce);
            let data = newSend.sign(fromKey.AKey);
            dataArray.push(data);
        }
    }

    if (sendList.finalizeAuction && sendList.finalizeAuction.length) {
        for (let i = 0; i < sendList.finalizeAuction.length; i++, nonce++) {
            let item = sendList.finalizeAuction[i];
            let newSend = new finalizeAuction(item.name, sendList.from, item.to, nonce);
            let data = newSend.sign(fromKey.AKey);
            dataArray.push(data);
        }
    }

} else {
    console.log('password is error or something wrong!');
}


/*
let filePath = __filename;
var nPos = filePath.lastIndexOf('/');
if(nPos>0)
{
    filePath = filePath.slice(0,nPos+1);
}
*/
fs.writeFileSync('./output/signTx.json', JSON.stringify(dataArray, null, 2), "utf8");
console.log('Signed transaction data has been written in file ./output/signTx.json');

const m = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Spt", "Oct", "Nov", "Dec")

function formatHMS(cur) {
    var h = cur.getUTCHours();
    var m = cur.getMinutes();
    var s = cur.getSeconds();
    if (h < 10) {
        return '0' + h + '-' + m + '-' + s;
    } else {
        return h + '-' + m + '-' + s;
    }
}

function getUTC() {
    var current = new Date();
    var mon = m[current.getUTCMonth()];
    var date = current.getUTCDate();
    var year = current.getUTCFullYear();
    var hms = formatHMS(current);
    return `${mon}-${date}-${year}-${hms}`;
}

if (OTAArray.length) {
    let fileName = './ota_trans/' + getUTC() + '_OTABalance.json';
    fs.writeFileSync(fileName, JSON.stringify(OTAArray, null, 2), "utf8");
    console.log('Signed transaction data has been written in file ' + fileName);
}
process.exit();