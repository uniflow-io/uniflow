const robot = require('robotjs');

module.exports = function(socket) {
    socket.on('robot.keyboard.setDelay', function (ms, callback) {
        robot.setKeyboardDelay(ms)

        callback()
    })

    socket.on('robot.keyboard.keyTap', function (key, modifier, callback) {
        robot.keyTap(key, modifier)

        callback()
    })

    socket.on('robot.keyboard.keyToggle', function (key, down, modifier, callback) {
        robot.keyToggle(key, down, modifier)

        callback()
    })

    socket.on('robot.keyboard.typeString', function (string, callback) {
        robot.typeString(string)

        callback()
    })

    socket.on('robot.keyboard.typeStringDelayed', function (string, cpm, callback) {
        robot.typeStringDelayed(string, cpm)

        callback()
    })

    socket.on('robot.mouse.setDelay', function (ms, callback) {
        robot.setMouseDelay(ms)

        callback()
    })

    socket.on('robot.mouse.move', function (x, y, callback) {
        robot.moveMouse(x, y)

        callback()
    })

    socket.on('robot.mouse.moveSmooth', function (x, y, callback) {
        robot.moveMouseSmooth(x, y)

        callback()
    })

    socket.on('robot.mouse.click', function (button = 'left', double = false, callback) {
        robot.mouseClick(button, double)

        callback()
    })

    socket.on('robot.mouse.toggle', function (down = 'down', button = 'left', callback) {
        robot.mouseToggle(down, button)

        callback()
    })

    socket.on('robot.mouse.drag', function (x, y, callback) {
        robot.dragMouse(x, y)

        callback()
    })

    socket.on('robot.mouse.getPos', function (callback) {
        let mouse = robot.getMousePos()

        callback(mouse)
    })

    socket.on('robot.mouse.scroll', function (x, y, callback) {
        robot.scrollMouse(x, y)

        callback()
    })

    socket.on('robot.screen.getPixelColor', function (x, y, callback) {
        robot.scrollMouse(x, y)

        callback()
    })

    socket.on('robot.screen.getScreenSize', function (callback) {
        let data = robot.getScreenSize()

        callback(data)
    })

    socket.on('robot.screen.capture', function (x, y, width, height, callback) {
        let img = robot.robot.screen.capture(x, y, width, height)

        callback(img)
    })
}