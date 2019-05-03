const onCompile = function(interpreter, scope, asyncWrapper) {
    let obj = {},
        canvas = this.canvas

    let constructorWrapper = function (url) {
        let newCanvas = interpreter.createObjectProto(obj.CANVAS_PROTO)

        let wrapper

        wrapper = function () {
            return interpreter.nativeToPseudo(canvas.height)
        }
        interpreter.setProperty(newCanvas, 'height', interpreter.createNativeFunction(wrapper))

        wrapper = function () {
            return interpreter.nativeToPseudo(canvas.width)
        }
        interpreter.setProperty(newCanvas, 'width', interpreter.createNativeFunction(wrapper))

        wrapper = function (x, y, width, height) {
            let nativeX = interpreter.pseudoToNative(x)
            let nativeY = interpreter.pseudoToNative(y)
            let nativeWidth = interpreter.pseudoToNative(width)
            let nativeHeight = interpreter.pseudoToNative(height)

            canvas.getContext("2d").fillRect(nativeX, nativeY, nativeWidth, nativeHeight)
        }
        interpreter.setProperty(newCanvas, 'fillRect', interpreter.createNativeFunction(wrapper))

        return newCanvas
    }
    obj.CANVAS = interpreter.createNativeFunction(constructorWrapper, true)
    obj.CANVAS_PROTO = interpreter.getProperty(obj.CANVAS, 'prototype')
    interpreter.setProperty(scope, 'Canvas', obj.CANVAS)
}

const onExecute = function(runner) {
    return Promise
        .resolve()
        .then(() => {
            return new Promise(resolve => {
                this.setState({ running: true }, resolve)
            })
        }).then(() => {
            return runner.eval('var ' + this.state.variable + ' = new Canvas()')
        })
        .then(() => {
            return new Promise(resolve => {
                setTimeout(resolve, 500)
            })
        })
        .then(() => {
            return new Promise(resolve => {
                this.setState({ running: false }, resolve)
            })
        })
}



export { onCompile, onExecute }
