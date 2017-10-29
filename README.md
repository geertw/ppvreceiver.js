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

## PPV?

PPV is an abbreviation for *Publicatieplatform vervoerders*, however, this tool works with all type
of ZeroMQ messages provided they are encoded with gzip.

A real-life application of this tool is for the Dutch website [Rijden de Treinen](https://www.rijdendetreinen.nl/):
all [train disruptions](https://www.rijdendetreinen.nl/en/disruptions) originate from the Dutch railways
and are delivered as a ZeroMQ pubsub message. This tools listens for various topics and stores the
uncompressed messages in a Redis queue. The website then processes all disruptions in the queue.
