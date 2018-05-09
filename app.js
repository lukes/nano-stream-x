#!/usr/bin/env node

const http = require('http');
const ipc = require('node-ipc');

// ipc configuration
// TODO expose more ipc.config https://www.npmjs.com/package/node-ipc
ipc.config.id = 'nanoStream';


// Port and host of the webserver that receives callbacks from the Nano RPC
const CONF = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || '127.0.0.1'
};

// Establish new ipc socket server
ipc.serve();
ipc.server.start();


// Webserver request handler
const requestHandler = (request, response) => {
  console.log(request.method, request.url);

  // Handle any POST request
  if (request.method === 'POST') {
    let body = '';

    request.on('data', chunk => body += chunk.toString());

    // TODO make this a proper stream
    request.on('end', () => {
      const payload = JSON.stringify(JSON.parse(body));

      // Broadcast payload to all connected clients
      if (ipc.server.sockets.length > 0) {
        ipc.server.broadcast('payload', payload);
      } else {
        console.log(`No connected clients. Payload was: ${payload}`);
      }

      response.end('ok');
    });
  }

};

const webServer = http.createServer(requestHandler);

webServer.listen(CONF, (err) => {
  if (err) {
    return console.error('Something bad happened', err);
  }

  console.log(`Web server is listening on ${CONF.host}:${CONF.port}`);
});
