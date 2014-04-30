#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

function on_connect(err, conn) {
  var q = 'hello';

  if (err !== null) return console.error(err);

  process.once('SIGINT', function() { conn.close(); });
  
  function on_channel_open(err, ch) {
    ch.assertQueue(q, {durable: false}, function(err, ok) {
      if (err !== null) return console.error(err);
      ch.consume(q, function(msg) { // message callback
        console.log(" [x] Received '%s'", msg.content.toString());
      }, {noAck: true}, function(_consumeOk) { // consume callback
        console.log(' [*] Waiting for messages. To exit press CTRL+C');
      });
    });
  }

  conn.createChannel(on_channel_open);
}

amqp.connect(on_connect);