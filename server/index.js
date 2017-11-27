const Server = require('socket.io');
const io = new Server();
const fs = require('fs');

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    socket.on('read', function(path, callback){
        fs.readFile(path, 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            }
            callback(data)
        });
    });
});

io.listen(3128);
