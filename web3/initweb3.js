let Web3 = require('web3');
const net = require('net');
let config = require('../config.js');
module.exports = new Web3(new Web3.providers.IpcProvider(config.ipcPath, net));
