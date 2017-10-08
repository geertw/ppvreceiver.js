var zlib = require('zlib');
var config = require('config');
var redis = require("redis");
var zmq = require('zeromq');

// Parse config:
var sourceHost = config.get("source.server");
var envelopes = config.get("source.envelopes");
var queues = {};


// Create Redis client:
var redisClient = redis.createClient({
    url: config.get("redis.url")
});

// Create ZeroMQ socket
var sock = zmq.socket('sub');
sock.connect(sourceHost);
console.log("Listening on " + sourceHost);

for (var queue in envelopes) {
    if (envelopes.hasOwnProperty(queue)) {
        var envelope = envelopes[queue];
        console.log("Subscribing for queue '" + queue + "' to " + envelope);
        sock.subscribe(envelope);

        queues[envelope] = queue;
    }
}

sock.on('message', function (topic, message) {
    try {
        message = zlib.unzipSync(message).toString('utf8');
    }
    catch (error) {
        console.log('Could not decompress message');
        return;
    }

    // Find correct queue:
    var envelope = topic.toString();

    if (!queues.hasOwnProperty(envelope)) {
        console.warn("No queue found for envelope " + envelope + ", message discarded");
        return;
    }

    var queue = queues[envelope];

    redisClient.lpush(queue, message);

    console.log("Message pushed to " + queue);
});
