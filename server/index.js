const fs      = require('fs-extra');
const https   = require('https');
const express = require('express');

const IO    = require('socket.io');
const robot = require('robotjs');

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

    socket.on('filesystem.read', function (path, callback) {
        fs.readFile(path, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            callback(data)
        });
    });

    socket.on('filesystem.write', function (path, content, callback) {
        fs.writeFile(path, content, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            callback(data)
        });
    });

    socket.on('filesystem.copy', function (pathFrom, pathTo, callback) {
        fs.copy(pathFrom, pathTo, function (err) {
            if (err) {
                return console.log(err);
            }
            callback(true)
        })
    });

    socket.on('filesystem.list', function (path, recursive = false, showDirectory = false, callback) {
        let walk = function (dir) {
            let files    = fs.readdirSync(dir),
                filelist = [];
            files.forEach(function (file) {
                if (fs.statSync(dir + file).isDirectory()) {
                    if (showDirectory) {
                        filelist.push(dir + file + '/');
                    }
                    if (recursive) {
                        filelist = filelist.concat(walk(dir + file + '/'));
                    }
                } else {
                    filelist.push(dir + file);
                }
            });

            return filelist;
        };

        callback(walk(path))
    });

    socket.on('mouse.move', function (x, y, callback) {
        robot.moveMouse(x, y)

        callback()
    })
});

server.listen(serverPort, function () {
    console.log('server up and running at %s port', serverPort);
});
