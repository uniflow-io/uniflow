const Server = require('socket.io');
const io = new Server();

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    socket.on('message', function(msg){
        io.emit('message', msg);
    });
});

io.listen(3128);
