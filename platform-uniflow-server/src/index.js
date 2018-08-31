const fs      = require('fs-extra');
const https   = require('https');
const express = require('express');

const IO    = require('socket.io');

let app = express();

let options    = {
    key: fs.readFileSync(__dirname + '/file.key'),
    cert: fs.readFileSync(__dirname + '/file.crt')
};
let serverPort = 3128;
let server     = https.createServer(options, app);
let io         = IO(server);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    /*console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });*/

    require('./components/browser')(socket)
    require('./components/childProcess')(socket)
    require('./components/filesystem')(socket)
    require('./components/http')(socket)
    require('./components/robot')(socket)
});

server.listen(serverPort, function () {
    console.log('server up and running at %s port', serverPort);
});
