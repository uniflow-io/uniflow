const fs = require('fs-extra')
const Server = require('socket.io');
const io = new Server();

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

io.listen(3128);
