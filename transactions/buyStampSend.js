let TokenSend = require("../interface/transaction.js").TokenSend;
let stampContract = require("../interface/contract.js").stampContract;
let ownCreateOTAAddress = require("../interface/OTAAddress.js").ownCreateOTAAddress;
class buyStampSend extends TokenSend
{
    constructor(from,CoinAmount,nonce)
    {
        super(from,null,nonce);
        this.trans.setValue(CoinAmount.getWei());
        this.Contract = new stampContract();
        this.trans.setTo(this.Contract.tokenAddress);
        let otaAddress = new ownCreateOTAAddress(from);
        this.trans.setData(this.Contract.getData(otaAddress.waddress,CoinAmount));
    }
}
module.exports = buyStampSend;