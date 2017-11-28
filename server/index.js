const fs      = require('fs-extra')
const https   = require('https')
const express = require('express')
const IO      = require('socket.io');

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

    socket.on('list', function (path, recursive, callback) {
        let walk = function (dir) {
            let files    = fs.readdirSync(dir),
                filelist = [];
            files.forEach(function (file) {
                if (recursive && fs.statSync(dir + file).isDirectory()) {
                    filelist = filelist.concat(walk(dir + file + '/'));
                } else {
                    filelist.push(dir + file);
                }
            });

            return filelist;
        };

        callback(walk(path))
    });
});

server.listen(serverPort, function () {
    console.log('server up and running at %s port', serverPort);
});
