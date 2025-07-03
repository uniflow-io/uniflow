const filesystem = require('fs-extra')

filesystem.readUTF8File = (path: any, options: any, callback: any) => {
  return filesystem.readFile(path, 'utf8', callback)
}

filesystem.readFileUTF8Sync = (path: any) => {
  return filesystem.readFileSync(path, 'utf8')
}

filesystem.writeUTF8File = (path: any, data: any, options: any, callback: any) => {
  return filesystem.writeFile(path, data, 'utf8', callback)
}

filesystem.writeFileUTF8Sync = (path: any, data: any) => {
  return filesystem.writeFileSync(path, data, 'utf8')
}

filesystem.listSync = (path: any, recursive = false, showDirectory = false) => {
  let walk = function(dir: any) {
    let files = filesystem.readdirSync(dir)
    let fileList: any[] = []
    files.forEach(function(file: any) {
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

export default filesystem
