const { exec } = require('child_process');

module.exports = function(socket) {
    socket.on('childProcess.exec', function (command, callback) {
        exec(command, (error, stdout, stderr) => {
            callback({
                error: error,
                stdout: stdout,
                stderr: stderr,
            })
        });
    });
}