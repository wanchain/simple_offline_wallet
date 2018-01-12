let TokenSend = require("../interface/transaction.js").TokenSend;
let PrivacyContract = require("../interface/contract.js").PrivacyContract;
let CreateOTAAddress = require("../interface/OTAAddress.js").CreateOTAAddress;
class PrivacySend extends TokenSend
{
    constructor(from,toWaddress,CoinAmount,nonce)
    {
        super(from,null,nonce);
        if(!this.trans.checkWAddress(toWaddress))
        {
            console.log('waddress is error: ' + toWaddress);
            return;
        }
        this.trans.setValue(CoinAmount.getWei());
        this.Contract = new PrivacyContract();
        this.trans.setTo(this.Contract.tokenAddress);
        let otaAddress = new CreateOTAAddress(toWaddress);
        console.log("send privacy wancoin value :" + CoinAmount.getAmount() + " for  ota address:" + otaAddress.waddress);
        this.trans.setData(this.Contract.getData(otaAddress.waddress,CoinAmount));
        this.trans.setGas(600000);
    }
}
module.exports = PrivacySend;