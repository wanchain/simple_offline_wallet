const fs = require('fs');
let sendList = JSON.parse(fs.readFileSync('./sendListWithNonce.json'));

let normalTrans = require('../interface/transaction.js').NormalSend;
let privateKey = require('../Accounts/privateKey.js');
let PrivacySend = require('../transactions/privacyTrans.js');
let refundOTASend = require('../transactions/refundOTASend.js');
let CoinAmount = require('../interface/Amount.js').CoinAmount;
let nonce = sendList.nonce;
let dataArray = [];
let OTAArray = [];
let password = '1111111111';
let fromKey = new privateKey(sendList.from,password);

if(fromKey.AKey)
{
    if(sendList.normal && sendList.normal.length)
    {
        for(var i=0;i<sendList.normal.length;i++,nonce++)
        {
            let item =sendList.normal[i];
            let newSend = new normalTrans(sendList.from,item.to,new CoinAmount(item.amount),nonce);
            let data = newSend.sign(fromKey.AKey);
            dataArray.push(data);
        }
    }

    if(sendList.ChargePrivacyCoin && sendList.ChargePrivacyCoin.length) {
        for (var i = 0; i < sendList.ChargePrivacyCoin.length; i++, nonce++) {
            let item = sendList.ChargePrivacyCoin[i];
            let privacy = new PrivacySend(sendList.from, item.to, new CoinAmount(item.facevalue), nonce);
            let data = privacy.sign(fromKey.AKey);
            dataArray.push(data);
            OTAArray.push(privacy.OTAinfo);
        }
    }
    if(sendList.refund && sendList.refund.length) {
        for (var i = 0; i < sendList.refund.length; i++, nonce++) {
            let item = sendList.refund[i];
            let refundOTA = new refundOTASend(sendList.from, fromKey, item.OTA, new CoinAmount(item.amount), item.OTAset, nonce);
            let data = refundOTA.sign(fromKey.AKey);
            dataArray.push(data);
        }
    }
}
else
{
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
fs.writeFileSync('./signTx.json',JSON.stringify(dataArray,null,2),"utf8");
console.log('Signed transaction data has been written in file ./signTx.json');
const m = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Spt", "Oct", "Nov", "Dec")
function getUTC() {
    var current = new Date();
    var mon = m[current.getUTCMonth()];
    var date = current.getUTCDate();
    var year = current.getUTCFullYear();
    var hms = formatHMS(current);
    return `${mon}-${date}-${year}-${hms}`;
}
function formatHMS(cur) {
    var h = cur.getUTCHours();
    var m = cur.getMinutes();
    var s = cur.getSeconds();
    if (h < 10) {
        return '0' + h + '-' + m + '-' + s;
    } else{
        return h + '-' + m + '-' + s;
    }
}

if(OTAArray.length)
{
    let fileName = './' + getUTC() + '_OTABalance.json';
    fs.writeFileSync(fileName,JSON.stringify(OTAArray,null,2),"utf8");
    console.log('Signed transaction data has been written in file ' + fileName);
}
process.exit();