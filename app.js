#!/usr/bin/env node

const http = require('http');
const ipc = require('node-ipc');
const BigNumber = require('bignumber.js');

// ipc configuration
ipc.config.id = 'nanoStream';
ipc.config.retry = 1500;
ipc.config.logger = () => {}; // Make ipc logger a no-op

const args = {};
// Collect all args passed in
process.argv.slice(2).forEach((arg) => {
  const [key, value] = arg.split('=');
  args[key] = value;
});

// Port and host of the webserver that receives callbacks from the Nano RPC
const port = args.port || 3000;
const host = args.host || '127.0.0.1';

// Establish new ipc socket server
const ipcPath = ipc.config.socketRoot + ipc.config.appspace + ipc.config.id;
ipc.serve(ipcPath);
ipc.server.start();
ipc.server.on('connect', () => console.info('nano-stream client connected'));
ipc.server.on('socket.disconnected', () => console.info('nano-stream client disconnected'));

let transactionCount = 0; // cleared every second
// Transaction record is an array containing counts of the last 60s of transactions,
// each element will represent the total per second
let transactionRecord = Array(60).fill(undefined);

// Returns the current transactions per second.
// Will return undefined until 1s of data has been collected
const tps = () => {
  const recorded = transactionRecord.filter(d => d !== undefined);
  if (recorded.length == 0) return undefined;
  const total = recorded.reduce((total, num) => total + num);
  return total / recorded.length;
};

// Returns the current transactions per minute.
// Will return undefined until 60s of data has been collected
const tpm = () => {
  if (transactionRecord.find(d => d == undefined)) return undefined;
  return transactionRecord.reduce((total, num) => total + num);
};

// Every second move the transactionCount into the transactionRecord array and reset it
setInterval(() => {
  const i = Math.floor(new Date().getSeconds());
  transactionRecord[i] = transactionCount;
  transactionCount = 0;
}, 1000);

// Webserver request handler
const requestHandler = (request, response) => {
  console.debug(request.method, request.url);

  // Handle any POST request
  if (request.method === 'POST') {
    transactionCount += 1;

    let body = '';

    request.on('data', chunk => body += chunk.toString());

    // TODO make this a proper stream
    request.on('end', () => {

      // Construct a payload
      let payload = JSON.parse(body);

      // Parse block
      let block = JSON.parse(payload.block);
      delete payload.block;

      // Convert amounts to ints as raw, and add in amounts in NANO
      if (block.balance) {
        Object.assign(block, {
          balance_raw: parseInt(block.balance),
          balance: parseFloat(new BigNumber(block.balance).shiftedBy(-30).toFixed(15, 1))
        });
      }

      if (payload.amount) {
        Object.assign(payload, {
          amount_raw: parseInt(payload.amount),
          amount: parseFloat(new BigNumber(payload.amount).shiftedBy(-30).toFixed(15, 1))
        });
      }

      // Merge block data into top level object, and add tps and tpm
      Object.assign(payload, block);

      // Add in tps and tpm, and make is_send a boolean
      Object.assign(payload, {
        is_send: payload.is_send === 'true',
        seen: (new Date()).getTime() / 1000,
        tps: tps(),
        tpm: tpm()
      });

      payload = JSON.stringify(payload);

      // Broadcast payload to all connected clients
      if (ipc.server.sockets.length > 0) {
        ipc.server.broadcast('payload', payload);
      } else {
        console.info(`No connected clients. Payload was: ${payload}`);
      }

      response.end('ok');
    });
  }

};

const webServer = http.createServer(requestHandler);

webServer.listen({port: port, host: host}, (err) => {
  if (err) {
    return console.error('Something bad happened', err);
  }

  console.info(`Web server is listening on ${host}:${port}`);
});
