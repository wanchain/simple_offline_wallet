const errMsg = require("./ErrorMessage.js");
let GWeiAmount = require("./Amount.js").GWeiAmount;
let keyStore = require("../Accounts/keyStore.js");
let wanUtil = require('wanchain-util');
var Tx = wanUtil.wanchainTx;
let gasPrice = new GWeiAmount(180);
class ITrans {
    constructor()
    {
        this.Txtype = '0x01';
        this.from = null;
        this.to = null;
        this.value = 0;
        this.gasPrice = gasPrice.getWei();
        this.gas = 21000;
        this.data = null;
        this.nonce = 0;
    }
    setTxtype(type)
    {
        this.Txtype = type;
    }
    setFrom(from)
    {
        if(this.checkAddress(from))
        {
            this.from = from;
        }
        else
        {
            console.log(errMsg.Err_Address + ": " + from);
        }
    }
    setTo(to)
    {
        if(this.checkAddress(to))
        {
            this.to = to;
        }
        else
        {
            console.log(errMsg.Err_Address + ": " + to);
        }

    }
    setValue(value)
    {
        this.value = value;
    }
    setData(data)
    {
        this.data = data;
    }
    checkAddress(address)
    {
        if(address)
        {
            if(/^0x[0-9a-f]{40}$/.test(address))
                return true;
            if(/^0x[0-9A-F]{40}$/.test(address))
                return true;
            return wanUtil.toChecksumAddress(address) == address;
        }
        else
        {
            return true;
        }
    }
    checkWAddress(waddress)
    {
        if(waddress)
        {
            return /^(0x)?[0-9a-fA-F]{132}$/.test(waddress);
        }
        else
        {
            return true;
        }
    }
};
class IRawTransaction
{
    constructor()
    {
        this.trans = new ITrans();
    }
    sign(privateKey)
    {
        const tx = new Tx(this.trans);
        tx.sign(privateKey);
        const serializedTx = tx.serialize();
        return "0x"+serializedTx.toString('hex');
    }
    signFromKeystore(password)
    {
        let privateKey = keyStore.getPrivateKey(this.trans.from,password);
        if(privateKey)
        {
            return this.sign(privateKey[0]);
        }
        else
        {
            return null;
        }
    }
};
//normal transaction
class NormalSend extends IRawTransaction
{
    constructor(from,to,IAmount,nonce)
    {
        super();
        this.trans.setFrom(from);
        this.trans.setTo(to);
        this.trans.setValue(IAmount.getWei());
        this.trans.nonce = nonce;
    }
};
class TokenSend extends IRawTransaction
{
    constructor(from,to,nonce)
    {
        super();
        this.trans.setFrom(from);
        this.trans.setTo(to);
        this.trans.setValue(0);
        this.trans.nonce = nonce;
    }
};
exports.NormalSend = NormalSend;
exports.TokenSend = TokenSend;
