import React, { Component } from 'react'
import ace from 'brace'
import 'brace/mode/javascript'
import 'brace/mode/batchfile'
import 'brace/mode/jsx'
import 'brace/theme/solarized_dark'
import 'brace/theme/solarized_light'
import { connect } from 'react-redux'

/**
 * Component adapted from https://github.com/securingsincity/react-ace/blob/master/src/ace.tsx
 */
class Ace extends Component {
  componentDidMount() {
    const { value, mode, app, layout } = this.props

    this.silent = false

    ace.config.set('basePath', '/jspm_packages/github/ajaxorg/ace-builds@1.3.3')
    this.editor = ace.edit(this.container)
    this.editor.$blockScrolling = Infinity
    if (value) {
      this.editor.setValue(value, 1)
    }
    this.editor.on('change', event => {
      if (this.props.onChange && !this.silent) {
        const value = this.editor.getValue()
        this.props.onChange(value, event)
      }
    })

    let session = this.editor.getSession()
    session.setUseSoftTabs(true)
    session.setTabSize(2)

    if (mode) {
      session.setMode('ace/mode/' + mode)
    }

    if (app.theme === 'dark') {
      this.editor.setTheme('ace/theme/solarized_dark')
    } else if (app.theme === 'sepia') {
      this.editor.setTheme('ace/theme/solarized_light')
    }

    if(layout === 'text') {
      this.editor.setOptions({
        maxLines: Infinity
      });
    }
  }

  componentWillUnmount() {
    this.editor.destroy()
    this.editor = null
  }

  componentDidUpdate(prevProps) {
    const nextProps = this.props

    if (this.editor && this.editor.getValue() !== nextProps.value) {
      // editor.setValue is a synchronous function call, change event is emitted before setValue return.
      this.silent = true
      const pos = this.editor.session.selection.toJSON()
      this.editor.setValue(nextProps.value || '', 1)
      this.editor.session.selection.fromJSON(pos)
      this.silent = false
    }
  }

  render() {
    const { width, height, layout } = this.props

    return (
      <div
        ref={container => (this.container = container)}
        style={{
          height:  height || layout !== 'text' ? height + 'px' : '100%',
          width: width ? width + 'px' : '100%',
        }}
      />
    )
  }
}

export default connect(state => ({
  app: state.app,
}))(Ace)
