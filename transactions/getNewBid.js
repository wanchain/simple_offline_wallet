const { CoinAmount } = require('../interface/Amount');
const { TokenSend } = require("../interface/transaction");
const wnsContract = require("../interface/wnsContract");

class getNewBid extends TokenSend {
    constructor(name, value, bidValue, from, tokenAddr, nonce) {
        super(from, tokenAddr, nonce);
        if(value - bidValue < 0) {
            console.log('The value(amount) you want to deposit with the bid must be at least as much as the value of your bid(bidValue)!')
            process.exit(0);
        }
        this.Contract = new wnsContract(tokenAddr);
        let sealedBid = this.Contract.bidFile(name, from, new CoinAmount(bidValue).getWei());
        this.trans.setValue(new CoinAmount(value).getWei());
        this.trans.setData(this.Contract.getNewBid(sealedBid, {from:from, value: new CoinAmount(value).getWei()}));
    }
}

module.exports = getNewBid;