
# nano-stream-x

A tiny and performant server that streams blocks as they are processed by a [Nano currency](https://nano.org/) node to a socket for other processes to receive.

This package is the base library for other `nano-stream` npm packages, which receive the stream and turn it into something else.

See:

* [nano-stream-ws](https://github.com/lukes/nano-stream-ws) - Stream to websockets

## Installation

    npm install --global nano-stream-x

## Usage

### Start the streaming web server

    node app

The server will default to running on `http://127.0.0.1:3000`.

Override these defaults by passing in `host` or `port` arguments:

    node app host=http://ipv6-localhost port=3001
