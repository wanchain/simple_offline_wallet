const { TokenSend } = require("../interface/transaction");
const wnsContract = require("../interface/wnsContract");

class startAuction extends TokenSend {
    constructor(name, from, tokenAddr, nonce) {
        super(from, tokenAddr, nonce);
        this.Contract = new wnsContract(tokenAddr);
        this.trans.setData(this.Contract.getStartAuction(name, { from: from }));
    }
}

module.exports = startAuction;