const fs = require('fs-extra')
const https = require('https')
const express = require('express')
const IO = require('socket.io');

var app = express();

var options = {
    key: fs.readFileSync(__dirname + '/file.key'),
    cert: fs.readFileSync(__dirname + '/file.crt')
};
var serverPort = 3128;
var server = https.createServer(options, app);
var io = IO(server);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    /*console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });*/

    socket.on('read', function (path, callback) {
        fs.readFile(path, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            callback(data)
        });
    });

    socket.on('write', function (path, content, callback) {
        fs.writeFile(path, content, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            callback(data)
        });
    });

    socket.on('copy', function (pathFrom, pathTo, callback) {
        fs.copy(pathFrom, pathTo, function (err) {
            if (err) {
                return console.log(err);
            }
            callback(true)
        })
    });
});

server.listen(serverPort, function() {
    console.log('server up and running at %s port', serverPort);
});
