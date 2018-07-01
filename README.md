
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
    "account": "xrb_3jwrszth46kk1mu7rmb4rhm54us8yg1gw3ipodftqtikf5yqdyr7471nsg1k",
    "amount": 0.5,
    "amount_raw": 5e+29,
    "balance": 16.677787630327758,
    "balance_raw": 1.6677787630327757e+31,
    "hash": "4A8372BC200C68D71663E61C0C2D021550BBCEB0C811A24771E600C0E4732D21",
    "is_send": true,
    "link": "F637A0883D5667413B7753CB6625DA8AEF403E384C5693F1A2B184C4DD12DCAD",
    "link_as_account": "xrb_3ajqn465tom9a1xqgnyderkxo4qha1z5im4pkhrt7ee6rmgj7q7fmwqoohtn",
    "type": "state",
    "previous": "86A36FC1361843D5EA4F2FF69967D1EFC0AAE85C741E022A721305581332226F",
    "representative": "xrb_3jwsszth46rk1mu7rmb4rhm54us8yg1gw3ipodftqtikf5yqdyr7471nsg1k",
    "signature": "826A46B08F00007C4B807CB2065EE797B918E38EBD1F3855ABE14D2DF151FC551F37480DBDD1C8DA787E6AF9352853FA6F57E6BB64E58E5353699B9748F0120C",
    "tpm": 6,
    "tps": 0.1,
    "work": "26ad0a6313b8189e"
}
```

`tps` is a value representing the current transactions per second. TPS is based on the last 60s of activity and is updated every second, and will be `null` until 1s of uptime.

`tpm` is a value representing the current transactions per minute. TPM is based on the last 60s of activity and is updated every second, and will be `null` until 60s of uptime.
