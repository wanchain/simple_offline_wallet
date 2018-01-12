let TokenSend = require("../interface/transaction.js").TokenSend;
let refundOTAContract = require("../interface/contract.js").refundOTAContract;
let ownOTAAddress = require("../interface/OTAAddress.js").ownOTAAddress;
class refundOTASend extends TokenSend
{
    constructor(from,privateKey,OTAaddress,CoinAmount,OTAset,nonce)
    {
        super(from,null,nonce);
        if(!this.trans.checkWAddress(OTAaddress))
        {
            console.log('OTAaddress is error: ' + OTAaddress);
            return;
        }
        this.Contract = new refundOTAContract();
        this.trans.setTo(this.Contract.tokenAddress);
        this.trans.setGas(600000);
        let otaAddress = new ownOTAAddress(OTAaddress);
        let RingData = otaAddress.getRingSignData(from,privateKey,OTAset)
        this.trans.setData(this.Contract.getData(RingData,CoinAmount));
    }
}
module.exports = refundOTASend;