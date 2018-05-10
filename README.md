
# nano-stream-x

A tiny and performant server that streams blocks as they are processed by a [Nano currency](https://nano.org/) node to a socket for other processes to receive.

This package isn't intended to be used by itself, but instead is the base library for other `nano-stream` npm packages which receive the stream and turn it into something else.

See:

* [nano-stream-ws](https://github.com/lukes/nano-stream-ws) - Stream to websockets
* [nano-stream-amqp](https://github.com/lukes/nano-stream-amqp) - Stream to AMQP (like RabbitMQ)
* [nano-stream-mqtt](https://github.com/lukes/nano-stream-mqtt) - Stream to MQTT (like Mosquitto)

## Installation

    npm install --global nano-stream-x

## Usage

### Start the streaming web server

    nano-stream-x

The server will default to running on `http://127.0.0.1:3000`.

Override these defaults by passing in `host` or `port` arguments:

    nano-stream-x host=ip6-localhost port=3001

### Configure your Nano node to send data to the server

See the [wiki article](https://github.com/lukes/nano-stream-x/wiki/Configure-your-Nano-node-to-send-data-to-the-nano-stream-x).

## Data

The data is sent as stringified JSON. An example of the data that is sent to the socket:

```json
{
   "account":"xrb_1m5cfk468k9cwfdp8zsiktc3dghxh6qabef7mno5odos9h91nn5wzs58g7st",
   "hash":"B5678177F615A890C28F6716FBD81E1068ADAC27C85E00EDCCC21832CFF1C413",
   "block":{
      "type":"send",
      "previous":"F91264792342F6B99CC9B3C946726537EFA5F7C925CCCAB49C32B5B423CCB07B",
      "destination":"xrb_39ymww61tksoddjh1e43mprw5r8uu1318it9z3agm7e6f96kg4ndqg9tuds4",
      "balance":"000000015D47BE1FF551BFBBE1000000",
      "work":"f57ec8eab4e3d760",
      "signature":"DBD8ECA13CCDEC87FAE0E7B2AAA2460492249410A18E9C06AD454862260038D8B55ACD130F9C402C24ED3E97C579E33C82B93368156B8E0E4183CF7B45205B0A"
   },
   "amount":"1099000000000000000000000000000000"
}
```

After 1s of uptime the data will include a `tps` property, with a value representing the current transactions per second. TPS is based on the last 60s of activity and is updated every second.

After 60s of uptime the data will include a `tpm` property, with a value representing the current transactions per minute. TPM is based on the last 60s of activity and is updated every second.
