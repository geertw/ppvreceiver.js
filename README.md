# RdT PPV Receiver.js

This tool receives PPV messages from a ZeroMQ source and stores them to Redis.
This allows other tools to process these messages.

## Functionality

Messages are received on the configured ZeroMQ binding. This tools subscribes to all
envelopes in the config file.

Received messages are stored to a Redis queue (LPUSH).
The key is the same key as for the envelope.
