var zlib = require('zlib');
var config = require('config');
var zmq = require('zeromq');

// Parse config:
var host = config.get("source.server");
var envelopes = config.get("source.envelopes");
var queues = {};

var sock = zmq.socket('sub');
sock.connect(host);
console.log("Listening on " + host);

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

    console.log("Queue: " + queue);
    console.log(message.substring(0, 45) + "...");
});
