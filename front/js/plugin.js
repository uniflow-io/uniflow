import Interpreter from '../dist/js/JS-Interpreter/interpreter'

(() => {
    let interpreter     = new Interpreter('');

    /*let runner = {
        eval: function (code) {
            if (code === undefined) return;

            interpreter.appendCode(code);

            return interpreter.run();
        },
        getReturn: function () {
            return interpreter.value;
        }
    };

    runner.eval('var i = "toto coco"; i')
    let value = runner.getReturn()

    */
    let code = 'var i = "toto coco"; i'
    interpreter.appendCode(code)
    interpreter.run()

    javaObj.onExecute(interpreter.value)
})()
