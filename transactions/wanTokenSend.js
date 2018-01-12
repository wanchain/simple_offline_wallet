let TokenSend = require("../interface/transaction.js").TokenSend;
let wanContract = require("../interface/contract.js").wanContract;
let ownCreateOTAAddress = require("../interface/OTAAddress.js").ownCreateOTAAddress;
class wanTokenSend extends TokenSend
{
    constructor(from,to,tokenAddress,CoinAmount,nonce)
    {
        super(from,tokenAddress,nonce);
        this.Contract = new wanContract(tokenAddress);
        this.trans.setData(this.Contract.getData(to,CoinAmount));
    }
}
module.exports = wanTokenSend;