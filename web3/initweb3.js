let Web3 = require('web3');
const net = require('net');
let ipcPath = "/home/cranelv/.wanchain/gwan.ipc"
module.exports = new Web3(new Web3.providers.IpcProvider(ipcPath, net));