# Wanchain simple offline wallet

## Dependencies
   node > v8.x
   npm  > v5.x
## Prepare
    
    $ npm install
## How to create keyStore
    
 ### Use WanWalletGui
 
   - Download and install WanWalletGui.
   - Open WanWalletGui and create account.
   - Click menu File->Backup->Accounts to get the keystore directory.
 ### Use WanWalletCli
   
   - Download WanWalletCli
   - Open WanWalletCli and run `node createKeystore.js`
   - Run `node keyStorePath.js`  to get the keystore directory.
   
 ### Use gwan console client
 
   - Download gwan
   - Run gwan node and open gwan console client
   - Run personal.newAccount to create a keyStore.
   - The keystore directory is in gwan datadir.
## How to set config.js

   - keyStorePath:  Set your local keyStore path
   - ipcPath : Set your gwan.ipc path
   - gasPrice : Set your transactions' gasPrice
   - RingSignMixNum : Set the OTA adresses Mix number fore RingSign.
       
## How to batch signed transaction data and send

        $ cd batch
   ### First: prepare sendList.json, sendList_charge.json and sendList_refund.json
   
   ####sendList.json [necessary]
   
   - from : The transaction from adress.
   - normal: Normal wan coin transaction list.
   - For example:
   
           {
             "from": "0x49bd323ddd6fa686bd0a9acb2b8bf051e6534df2",
             "normal": [
               {
                 "to": "0x5d02B782497c951aF163F188208D969a4b6A9bdA",
                 "amount": 100
               }
             ]
           }
       
   #### sendList_charge.json [optional]
   
   - ChargePrivacyCoin : privacy wan coin transaction list
   - For example:
   
           {
             "ChargePrivacyCoin": [
               {
                 "to": "0x02f6436055b35dd2bd3df31ab9a563bbe7bc3068b0cbeae64f513d748923569df0035c4f0ba507c26b6aec4dc643a19d071f21e83058e819fa78a21fcb4cc36c40ad",
                 "facevalue": 10
               }
               ]
           }
           
   #### sendList_refund.json [optional]
   
   - refund : fefund OTA balance transaction list
   - For example:
   
           {
              "refund": [
                {
                  "OTA": "0x0203c1bd673e8e75228b408fe88f44715ae3f8304e937f5e7af7a7bde9c4b85395020007061a311c3c7519d9daf3156ad1aa8debc672835aa032c3ff1606f895b255",
                  "amount": 10
                }
                ]
           }
           
   ###second: Connect web3 and run `node initSendList.js`
       
   - Set the truth nonce.
   - Set the OTAset for ringSign.
   - The result file is "sendListWithNonce.json"
    
   ###third: run `node batchSign.js` 
   
   - Set from address password in 'batchSign.js'
   
            let password = 'wanglu';
            
   - Sign the transactions list.
   - The result file is 'signTx.json'
   
   ### finally: Connect web3 and run `node batchRawSendTrans.js`
   
   - Send the signed transactions list.
   - The transaction hash result file is 'transHash.json'
        

### Preset coin face value

10 WAN
20 WAN
50 WAN
100 WAN
200 WAN
500 WAN
1000 WAN
5000 WAN
50000 WAN
