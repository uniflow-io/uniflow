import React, { Component } from 'react'
import ace from 'ace'

type Props = {
    value: string,
    width?: number,
    height?: number,
    mode?: string
}

export default class Ace extends Component<Props> {
    componentDidMount() {
        const {
            value,
            mode
        } = this.props;

        this.silent = false;

        ace.config.set('basePath', '/jspm_packages/github/ajaxorg/ace-builds@1.2.9')
        this.editor = ace.edit(this.container);
        this.editor.$blockScrolling = Infinity;
        if(value) {
            this.editor.setValue(value, 1);
        }
        this.editor.on('change', (event) => {
            if (this.props.onChange && !this.silent) {
                const value = this.editor.getValue();
                this.props.onChange(value, event);
            }
        });

        let session = this.editor.getSession();
        session.setUseSoftTabs(true);
        session.setTabSize(2);

        if(mode) {
            session.setMode('ace/mode/' + mode);
        }
    }

    componentWillUnmount() {
        this.editor.destroy();
        this.editor = null;
    }

    componentWillReceiveProps(nextProps) {
        const oldProps = this.props;

        if (this.editor && this.editor.getValue() !== nextProps.value) {
            // editor.setValue is a synchronous function call, change event is emitted before setValue return.
            this.silent = true;
            const pos = this.editor.session.selection.toJSON();
            this.editor.setValue(nextProps.value, 1);
            this.editor.session.selection.fromJSON(pos);
            this.silent = false;
        }
    }

    render() {
        const { width, height } = this.props

        return (
            <div ref={container => (this.container = container)}
                 style={{
                height: height ? height + 'px' : '100%',
                width: width ? width + 'px' : '100%'
            }} />
        )
    }
}
