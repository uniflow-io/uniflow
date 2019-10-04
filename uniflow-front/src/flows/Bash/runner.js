const onCode = function (client) {
  if (client === 'node') {
    let bash = this.bash
    bash = bash.replace(/\n/g, '\\n')
    bash = bash.replace(/\"/g, '\\"')
    bash = bash.replace(/\$/g, '\\$')

    return `Bash.exec("${bash}")`
  }
}

export {onCode}
