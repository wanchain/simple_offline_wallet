# Wanchain local sign Transaction

## How to set config.js

   - keyStorePath:  set your local keyStore path
   
## Prepare
    
    $ npm install
## How to batch signed transaction data and send

        $ cd batch
   ### First: prepare sendList.json
       {
         "from": "0x49bd323ddd6fa686bd0a9acb2b8bf051e6534df2",
         "normal": [
           {
             "to": "0x5d02B782497c951aF163F188208D969a4b6A9bdA",
             "amount": 100
           }
         ],
         "privacy": [
           {
             "to": "03bfe1fc5f893f438943a3df80ad4a76f624c9b8d3b4ca6286869a1e22c7d7313d02cd0a8d7cfa6817a98d9bee72ac4f39d10de4ffb686fb8626e3bc20b69b2d4748",
             "amount": 100
           },
         ],
         "refund": [
           {
             "OTA": "0x02f3d2bd87e7c0c42769f00ee14b264589f92899552c77f4fede84a3e9a6b255af03903ba90ae54281d5d51abfbc681d328b67a7099753edc07821232e25bfd72858",
             "amount": 100,
             "OTAset": [
               "0x02c830b44a5423670bb37265e0f0b4e211c63bc1f77f6f9c27c61aa4709eb6353003e0432eafdf2a18a57f4c474a60b7072a51f5932ade2e3878e297d5fe9a8e80ad",
               "0x0372b0D9De56cc49Faedb96635C80dd8A9F922951d9B4BC2ae5bb9f3d3Fbf9f346024140AA09844a3a8115620a9761D35D05C6850AC8282D4330492cF3554F2285Db",
               "0x034fed238be290791e3ece215e89c33af3a23a535769394ff135f574c12aa26a9503d1446d829911f0bc5a44fea9a3587e2907017c32f5bf913b4e7dfc8b99d93dad",
               "0x022cdF581b896426889DBE4d57d0FFe62B56fa947D47dd8f19dB05171C76C0044B030E46D1018FBdad38269eA91c62399197558D1A7D6C6B93e610F213f20775b0A0"
             ]
           }
         ],
         "nonce": 0
       }
   ###second: Connect web3 and run `node initSendList.js`
       
       we will set the truth nonce.
   ###third: run `node batchSign.js` 
   
   ### finally: Connect web3 and run `node batchRawSendTrans.js`    
        
## How to get signed Transaction Data
   
  ###  Normal transaction data
  
      $ cd src 
      $ node send.js
    
  ### How to use send.js
  
  #### You can prepare from,to,password list in *.js first ,for example
  
      exports.fromaddress = {   account1:"0x49bd323ddd6fa686bd0a9acb2b8bf051e6534df2",
          account2:"0x5d02B782497c951aF163F188208D969a4b6A9bdA",
          account3:"0xDF903e7F79AcDDf4E39AD5ab8C07cddC95Be9b3a",
          account4:"0x538b77103eFDB51c0C2Be52e58f125E832CcbB90"};
      
      exports.toaddress = {   bob:"0x23e403828074F93EcEf6e56CDc70c030C81F698C",
                              lihua:"0x4c79278D317635EF14DC7C4342d4cabFF44D7439",
                              hantao:"0xDF903e7F79AcDDf4E39AD5ab8C07cddC95Be9b3a",
                              sunzhen:"0x538b77103eFDB51c0C2Be52e58f125E832CcbB90",
                              laojia:"0x60d54f76f070477e4b4E3c4B136c7c08258B149A",
                              fanghua:"0xc097d38a1B009c9d164595C8aeB2fc28803AAE55"};

  #### Require and use them 
      let from = require('../Accounts/address.js').fromaddress;
      let to = require('../Accounts/address.js').toaddress;
      let password = require('../Accounts/password.js').password;
      
  #### Use CoinAmount to get wei;
      let CoinAmount = require('../interface/Amount.js').CoinAmount;
      let sendAmount = new CoinAmount(200);
      
  #### You must get nonce first
      let nonce = 309;
  
  
  #### The last is Signed code
  
      let normalTrans = require('../interface/transaction.js').NormalSend;
      let newSend = new normalTrans(from.account1,to.fanghua,sendAmount.getWei(),nonce);
      let data = newSend.signFromKeystore(password.password1);
      console.log(data);
      
### Privacy transaction data

     $ node sendPrivacy.js

### How to use sendPrivacy.js

 #### Prepare as send.js
     let to = require('../Accounts/address.js').towaddress;
     let from = require('../Accounts/address.js').fromaddress;
     let password = require('../Accounts/password.js').password;
     let CoinAmount = require('../interface/Amount.js').CoinAmount;
     let sendAmount = new CoinAmount(200);
     let nonce = 310;
 
 #### The last is Signed code
     let PrivacySend = require('../transactions/privacyTrans.js');
     let privacy = new PrivacySend(from.account1,to.fanghua,sendAmount,nonce);
     let data = privacy.signFromKeystore(password.password1);
     console.log(data);
     
### Buy stamp transaction data

     $ node buyStamp.js

### Normal token transaction data

     $ node sendToken.js

