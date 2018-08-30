const WebSocket = require('ws');
const fs = require('fs');

const opusPackets = './raw_opus/';
let packets = [],
    source = [],
    interval = 0,
    count = 0,
    wss;

fs.readdir(opusPackets, (err, files) => {
    files = files.filter(file => file.indexOf('.txt') !== -1);
    files = files.map(file => parseInt(file));
    files.sort((a, b) => a - b);
    files.forEach(function(file) {
        fs.readFile(opusPackets + file + '.txt', (err, data) => {
            if (err) throw err;
            source.push(data);
            count++;
            if (files.length == count) {
                packets = source.slice();
                openSocket();
            }
        });
    });
});


function openSocket() {
  wss = new WebSocket.Server({ port: 8080 });
  console.log('Server ready...');
  wss.on('connection', function connection(ws) {
        console.log('Socket connected. sending data...');
        if (interval) {
            clearInterval(interval);
        }
        interval = setInterval(function() {
          sendPacket();
        }, 10);
  });
}

function sendPacket() {
    let packet;
    if (packets.length == 0 && interval){
       clearInterval(interval);
       packets = source.slice();
       return;
    }
    
    packet = packets.shift();
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
          client.send(packet);
          if (packets.length % 100 == 0){
              console.log(`Remainging packets ${packets.length}`);
          }
      }
    });
}