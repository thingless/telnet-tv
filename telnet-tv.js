#!/usr/bin/env node
var program = require('commander');
var telnet = require('wez-telnet');

program
  .version('0.0.1')
  .option('--port <n>', 'port to run server on (default 8080)', parseInt)
  .parse(process.argv);

var clients = new Set();
function writeToClients(chunk){
    Array.from(clients.values()).forEach((client)=>{
        try {
            client.write(chunk);
        } catch (err) {
            clients.remove(client);
        }
    })
}

process.stdin.on('data', function(chunk) {
    writeToClients(chunk);
});

var s = new telnet.Server(function(client) {
    // I am the connection callback
    clients.add(client);
    console.log("connected term=%s %dx%d", client.term, client.windowSize[0], client.windowSize[1]);

    client.write('[7l[2J[0;0H');

    client.on('data', function (buf) {
      console.log("Connection data:", buf.toString('ascii'));
    });
    client.on('resize', function (width, height) {
      console.log("Connection resized to %dx%d", width, height);
    });
    //client.on('interrupt', function(){});
    client.on('close', function () {
      clients.delete(client);
      console.log("Connection Closed");
    });
 });
 s.listen(program.port||8080);
