const fs      = require('fs-extra');

module.exports = function(socket) {
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
                if (fs.statSync(dir + '/' + file).isDirectory()) {
                    if (showDirectory) {
                        filelist.push(dir + '/' + file);
                    }
                    if (recursive) {
                        filelist = filelist.concat(walk(dir + '/' + file));
                    }
                } else {
                    filelist.push(dir + '/' + file);
                }
            });

            return filelist;
        };

        callback(walk(path))
    });
}