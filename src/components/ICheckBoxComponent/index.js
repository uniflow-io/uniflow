import React, { Component } from 'react'
import $ from 'jquery'
require("imports-loader?window.jQuery=jquery!../../node_modules/icheck/icheck.min.js");
//import 'icheck'

type Props = {
    value: string
}

export default class ICheckBoxComponent extends Component<Props> {
    componentDidMount() {
        const {
            value
        } = this.props;

        this.silent = false;

        $(this.container)
            .iCheck({
                handle: 'checkbox',
                checkboxClass: 'icheckbox_square-blue'
            })
            .on('ifChecked', () => {
                if (this.props.onChange && !this.silent) {
                    this.props.onChange(true);
                }
            })
            .on('ifUnchecked', () => {
                if (this.props.onChange && !this.silent) {
                    this.props.onChange(false);
                }
            });
        this.setValue(value);
    }

    componentWillUnmount() {
        $(this.container).iCheck('destroy')
    }

    componentWillReceiveProps(nextProps) {
        const oldProps = this.props;

        if(nextProps.value !== oldProps.value) {
            this.setValue(nextProps.value)
        }
    }

    setValue = (value) => {
        this.silent = true;

        if(value) {
            $(this.container).iCheck('check', () => {
                this.silent = false;
            });
        } else {
            $(this.container).iCheck('uncheck', () => {
                this.silent = false;
            });
        }
    }

    render() {
        return (
            <input ref={container => (this.container = container)} type="checkbox" />
        )
    }
}
