const robot = require('robotjs');

let applyArgs = function(args) {
    let realArgs = []

    for(let i = 0; i < args.length; i++) {
        let canApply = false
        for(let j = i; j < args.length; j++) {
            canApply = canApply || args[j] !== null
        }

        if(!canApply) {
            return realArgs;
        }

        realArgs.push(args[i])
    }

    return realArgs
}

module.exports = function(socket) {
    socket.on('robot.keyboard.setDelay', function (ms, callback) {
        robot.setKeyboardDelay.apply(robot, applyArgs([ms]))

        callback()
    })

    socket.on('robot.keyboard.keyTap', function (key, modifier, callback) {
        robot.keyTap.apply(robot, applyArgs([key, modifier]))

        callback()
    })

    socket.on('robot.keyboard.keyToggle', function (key, down, modifier, callback) {
        robot.keyToggle.apply(robot, applyArgs([key, down, modifier]))

        callback()
    })

    socket.on('robot.keyboard.typeString', function (string, callback) {
        robot.typeString.apply(robot, applyArgs([string]))

        callback()
    })

    socket.on('robot.keyboard.typeStringDelayed', function (string, cpm, callback) {
        robot.typeStringDelayed.apply(robot, applyArgs([string, cpm]))

        callback()
    })

    socket.on('robot.mouse.setDelay', function (ms, callback) {
        robot.setMouseDelay.apply(robot, applyArgs([ms]))

        callback()
    })

    socket.on('robot.mouse.move', function (x, y, callback) {
        robot.moveMouse.apply(robot, applyArgs([x, y]))

        callback()
    })

    socket.on('robot.mouse.moveSmooth', function (x, y, callback) {
        robot.moveMouseSmooth.apply(robot, applyArgs([x, y]))

        callback()
    })

    socket.on('robot.mouse.click', function (button = 'left', double = false, callback) {
        robot.mouseClick.apply(robot, applyArgs([button, double]))

        callback()
    })

    socket.on('robot.mouse.toggle', function (down = 'down', button = 'left', callback) {
        robot.mouseToggle.apply(robot, applyArgs([down, button]))

        callback()
    })

    socket.on('robot.mouse.drag', function (x, y, callback) {
        robot.dragMouse.apply(robot, applyArgs([x, y]))

        callback()
    })

    socket.on('robot.mouse.getPos', function (callback) {
        let mouse = robot.getMousePos.apply(robot, applyArgs([]))

        callback(mouse)
    })

    socket.on('robot.mouse.scroll', function (x, y, callback) {
        robot.scrollMouse.apply(robot, applyArgs([x, y]))

        callback()
    })

    socket.on('robot.screen.getPixelColor', function (x, y, callback) {
        robot.scrollMouse.apply(robot, applyArgs([x, y]))

        callback()
    })

    socket.on('robot.screen.getScreenSize', function (callback) {
        let data = robot.getScreenSize.apply(robot, applyArgs([]))

        callback(data)
    })

    socket.on('robot.screen.capture', function (x, y, width, height, callback) {
        let img = robot.robot.screen.capture.apply(robot, applyArgs([x, y, width, height]))

        callback(img)
    })
}