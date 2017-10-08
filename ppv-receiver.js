var zlib = require('zlib');
var config = require('config');
var zmq = require('zeromq');

// Parse config:
var host = config.get("source.server");
var envelopes = config.get("source.envelopes");

var sock = zmq.socket('sub');
sock.connect(host);
console.log("Listening on " + host);

for (var queue in envelopes) {
    if (envelopes.hasOwnProperty(queue)) {
        var envelope = envelopes[queue];
        console.log("Subscribing for queue '" + queue + "' to " + envelope);
        sock.subscribe(envelope);
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

    console.log(topic.toString());
    console.log(message.substring(0, 45) + "...");
});
