const filesystem = require('fs-extra')

filesystem.readUTF8File = (path, options, callback) => {
  return filesystem.readFile(path, 'utf8', callback)
}

filesystem.readFileUTF8Sync = path => {
  return filesystem.readFileSync(path, 'utf8')
}

filesystem.writeUTF8File = (path, data, options, callback) => {
  return filesystem.writeFile(path, data, 'utf8', callback)
}

filesystem.writeFileUTF8Sync = (path, data) => {
  return filesystem.writeFileSync(path, data, 'utf8')
}

filesystem.listSync = (path, recursive = false, showDirectory = false) => {
  let walk = function(dir) {
    let files = filesystem.readdirSync(dir)
    let fileList = []
    files.forEach(function(file) {
      if (filesystem.statSync(dir + '/' + file).isDirectory()) {
        if (showDirectory) {
          fileList.push(dir + '/' + file)
        }
        if (recursive) {
          fileList = fileList.concat(walk(dir + '/' + file))
        }
      } else {
        fileList.push(dir + '/' + file)
      }
    })

    return fileList
  }

  return walk(path)
}

module.exports = filesystem
