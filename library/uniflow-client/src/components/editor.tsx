import React, { Component } from 'react';
import ReactPrismEditor from 'react-prism-editor';
import { connect } from 'react-redux';

class Editor extends Component {
  render() {
    const { value, language, app, readonly, width, height } = this.props;

    let theme = 'default';
    if (app.theme === 'dark') {
      theme = 'tomorrow';
    } else if (app.theme === 'sepia') {
      theme = 'solarizedlight';
    }

    return (
      <ReactPrismEditor
        ref={(container) => (this.container = container)}
        style={{
          height: height ? height + 'px' : '100%',
          width: width ? width + 'px' : '100%',
        }}
        language={language ?? 'html'}
        theme={theme}
        code={value}
        lineNumber={readonly !== true && language && language !== 'html'}
        readOnly={readonly === true}
        clipboard={false}
        changeCode={(value) => {
          if (this.props.onChange) {
            this.props.onChange(value);
          }
        }}
      />
    );
  }
}

export default connect((state) => ({
  app: state.app,
}))(Editor);
