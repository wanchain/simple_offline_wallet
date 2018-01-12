const fs = require('fs');
let sendList = JSON.parse(fs.readFileSync('./sendList.json'));
let password = '1111111111';
let normalTrans = require('../interface/transaction.js').NormalSend;
let privateKey = require('../Accounts/privateKey.js');
let PrivacySend = require('../transactions/privacyTrans.js');
let refundOTASend = require('../transactions/refundOTASend.js');
let CoinAmount = require('../interface/Amount.js').CoinAmount;
let nonce = sendList.nonce;
let dataArray = [];
let fromKey = new privateKey(sendList.from,password);
if(fromKey.AKey)
{
    for(var i=0;i<sendList.normal.length;i++,nonce++)
    {
        let item =sendList.normal[i];
        let newSend = new normalTrans(sendList.from,item.to,new CoinAmount(item.amount),nonce);
        let data = newSend.sign(fromKey.AKey);
        dataArray.push(data);
    }

    for(var i=0;i<sendList.privacy.length;i++,nonce++)
    {
        let item =sendList.privacy[i];
        let privacy = new PrivacySend(sendList.from,item.to,new CoinAmount(item.amount),nonce);
        let data = privacy.sign(fromKey.AKey);
        dataArray.push(data);
    }
    for(var i=0;i<sendList.refund.length;i++,nonce++) {
        let item = sendList.refund[i];
        let refundOTA = new refundOTASend(sendList.from, fromKey, item.OTA, new CoinAmount(item.amount), item.OTAset, nonce);
        let data = refundOTA.sign(fromKey.AKey);
        dataArray.push(data);
    }
}
else
{
    console.log('password is error!');
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
process.exit();