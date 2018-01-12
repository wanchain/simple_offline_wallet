let BigNumber = require('bignumber.js');
class IAmount{
    constructor(amount,exp)
    {
        this.amount = amount;
        this.exp = exp;
    }
    getWei()
    {
        let amount = new BigNumber(this.amount);
        let exp = new BigNumber(10);
        let count = '0x' + amount.times(exp.pow(this.exp)).toString(16);
        return count;
    }
    getAmount()
    {
        return this.amount;
    }
}
class GWeiAmount extends IAmount{
    constructor(amount){
        super(amount,9);
    }
}
class CoinAmount extends IAmount{
    constructor(amount){
        super(amount,18)
    }
}
exports.GWeiAmount = GWeiAmount;
exports.CoinAmount = CoinAmount;