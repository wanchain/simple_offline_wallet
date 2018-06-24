const { TokenSend } = require("../interface/transaction");
const wnsContract = require("../interface/wnsContract");

class unsealBid extends TokenSend {
    constructor(name, value, from, tokenAddr, key, nonce) {
        super(from, tokenAddr, nonce);
        this.Contract = new wnsContract(tokenAddr);
        this.trans.setData(this.Contract.getUnsealBidData(name, value, key, { from: from }));
    }
}

module.exports = unsealBid;