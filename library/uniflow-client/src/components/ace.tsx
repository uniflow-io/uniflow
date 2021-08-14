import React, { Component } from 'react';
import ace from 'brace';
import 'brace/mode/javascript';
import 'brace/mode/batchfile';
import 'brace/mode/jsx';
import 'brace/theme/solarized_dark';
import 'brace/theme/solarized_light';
import { connect } from 'react-redux';

/**
 * Component adapted from https://github.com/securingsincity/react-ace/blob/master/src/ace.tsx
 */
class Ace extends Component {
  componentDidMount() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'value' does not exist on type 'Readonly<... Remove this comment to see the full error message
    const { value, mode, app, layout } = this.props;

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'silent' does not exist on type 'Ace'.
    this.silent = false;

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'config' does not exist on type 'typeof A... Remove this comment to see the full error message
    ace.config.set('basePath', '/jspm_packages/github/ajaxorg/ace-builds@1.3.3');
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'editor' does not exist on type 'Ace'.
    this.editor = ace.edit(this.container);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'editor' does not exist on type 'Ace'.
    this.editor.$blockScrolling = Infinity;
    if (value) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'editor' does not exist on type 'Ace'.
      this.editor.setValue(value, 1);
    }
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'editor' does not exist on type 'Ace'.
    this.editor.on('change', (event) => {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'onChange' does not exist on type 'Readon... Remove this comment to see the full error message
      if (this.props.onChange && !this.silent) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'editor' does not exist on type 'Ace'.
        const value = this.editor.getValue();
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'onChange' does not exist on type 'Readon... Remove this comment to see the full error message
        this.props.onChange(value, event);
      }
    });

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'editor' does not exist on type 'Ace'.
    const session = this.editor.getSession();
    session.setUseSoftTabs(true);
    session.setTabSize(2);

    if (mode) {
      session.setMode('ace/mode/' + mode);
    }

    if (app.theme === 'dark') {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'editor' does not exist on type 'Ace'.
      this.editor.setTheme('ace/theme/solarized_dark');
    } else if (app.theme === 'sepia') {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'editor' does not exist on type 'Ace'.
      this.editor.setTheme('ace/theme/solarized_light');
    }

    if (layout === 'text') {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'editor' does not exist on type 'Ace'.
      this.editor.setOptions({
        maxLines: Infinity,
      });
    }
  }

  componentWillUnmount() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'editor' does not exist on type 'Ace'.
    this.editor.destroy();
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'editor' does not exist on type 'Ace'.
    this.editor = null;
  }

  componentDidUpdate(prevProps) {
    const nextProps = this.props;

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'editor' does not exist on type 'Ace'.
    if (this.editor && this.editor.getValue() !== nextProps.value) {
      // editor.setValue is a synchronous function call, change event is emitted before setValue return.
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'silent' does not exist on type 'Ace'.
      this.silent = true;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'editor' does not exist on type 'Ace'.
      const pos = this.editor.session.selection.toJSON();
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'editor' does not exist on type 'Ace'.
      this.editor.setValue(nextProps.value || '', 1);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'editor' does not exist on type 'Ace'.
      this.editor.session.selection.fromJSON(pos);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'silent' does not exist on type 'Ace'.
      this.silent = false;
    }
  }

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'width' does not exist on type 'Readonly<... Remove this comment to see the full error message
    const { width, height, layout } = this.props;

    return (
      <div
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'container' does not exist on type 'Ace'.
        ref={(container) => (this.container = container)}
        style={{
          height: height || layout !== 'text' ? height + 'px' : '100%',
          width: width ? width + 'px' : '100%',
        }}
      />
    );
  }
}

export default connect((state) => ({
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'app' does not exist on type 'DefaultRoot... Remove this comment to see the full error message
  app: state.app,
}))(Ace);
