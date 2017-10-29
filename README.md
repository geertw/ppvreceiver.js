# RdT PPV Receiver.js

This tool receives gzip'ed messages from a ZeroMQ PUBSUB publisher and stores them to a Redis queue.
Other tools may then further process the queue.

## Functionality

Messages are received on the configured ZeroMQ binding. This tools subscribes to all
envelopes in the config file.

Received messages are stored to a Redis queue (LPUSH).

Messages are pushed to the key specified in the configuration, based on the message envelope (topic).

## Requirements

* Node.js 8 or higher
* Redis server
* ZeroMQ PUBSUB publisher
* NPM modules (run `npm install`):
  * config
  * redis
  * zeromq

## Getting started

1. Clone/download project
2. `npm install`
3. Copy `config/default.json.dist` to `config/default.json.dist`
4. Modify configuration (see below)
5. Run with `node ppv-receiver.js`

## Configuration

Example configuration:

```json
{
  "source": {
    "server": "tcp://127.0.0.1:12345",
    "envelopes": {
      "pil": "/RIG/InfoPlusPILInterface5",
      "vtbl": "/RIG/InfoPlusVTBLInterface5"
    }
  },
  "redis": {
    "url": "redis://127.0.0.1:6379?db=0"
  }
}
```

The configuration is in JSON format, and is divided in a part for the ZeroMQ source and the Redis destination.

### ZeroMQ configuration

The `source` object defines your ZeroMQ source.

* `server` is the connection string for your ZeroMQ PUBSUB server
* `envelopes` contains the redis keys which the server should push to (i.e. "pil" and "vtbl"), and the
  value contains the ZeroMQ envelopes (i.e. messages for envelope "/RIG/InfoPlusPILInterface5" are pushed to the "pil"
  key in Redis.)

### Redis configuration

The `redis` object defines your Redis destination.

* `url` is the connection string for Redis. See the
  [Node Redis documentation](https://github.com/NodeRedis/node_redis#rediscreateclient) for more information about the
  format for the connection URL.

## PPV?

PPV is an abbreviation for *Publicatieplatform vervoerders*, however, this tool works with all type
of ZeroMQ messages provided they are encoded with gzip.

A real-life application of this tool is for the Dutch website [Rijden de Treinen](https://www.rijdendetreinen.nl/):
all [train disruptions](https://www.rijdendetreinen.nl/en/disruptions) originate from the Dutch railways
and are delivered as a ZeroMQ pubsub message. This tools listens for various topics and stores the
uncompressed messages in a Redis queue. The website then processes all disruptions in the queue.

## License

MIT License, see the [LICENSE](LICENSE) file for more information.