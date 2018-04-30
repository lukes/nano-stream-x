
# nano-stream-core

This library is a tiny and lightweight node server that streams block data from a [nano currency](https://nano.org/) node. It works by receiving blocks processed by the node via the [RPC callback](https://github.com/nanocurrency/raiblocks/wiki/RPC-protocol#rpc-callback), and streams that data to a socket that other processes can listen to.

This package is intended to support other npm packages rather than to be run on its own.

See:

* [nano-stream-ws](https://github.com/lukes/nano-stream-ws) - Stream to websockets
* nano-stream-mqtt - Stream to mqtt (TODO)
* nano-stream-ampq - Stream to ampq (TODO)

Also read `How to write your own nano-stream plugin` (TODO)

## Installation

    npm install --global nano-stream-core

## Usage

### Start the streaming web server

    node app

The server will default to running on `http://127.0.0.1:3000`.

Override these defaults by passing in `host` or `port` arguments:

    node app host=http://ipv6-localhost port=3001


## TODO

Edit the RPC config.
