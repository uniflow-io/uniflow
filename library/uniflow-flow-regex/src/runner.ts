import SRL from 'srl'

const onCode = function() {
  if (!this.state.variable) {
    return ''
  }

  let value = JSON.stringify('')
  try {
    let builder = new SRL(this.state.expression)
    value = builder.get()
  } catch (e) {}

  return this.state.variable + ' = ' + value
}

const onExecute = function(runner) {
  if (this.state.variable) {
    return runner.run(onCode.bind(this)('uniflow'))
  }
}

export { onCode, onExecute }
