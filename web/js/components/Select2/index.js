import React, { Component } from 'react'
import $ from 'jquery'
import 'select2'

type Props = {
    value: string,
    options?: [],
    style?: {},
    children: ({}) => React.Component
}

export default class Select2 extends Component<Props> {
    componentDidMount() {
        const {
            value,
            options
        } = this.props;

        this.silent = false;

        $(this.container)
            .val(value)
            .select2({ data: options })
            .on('change', (event) => {
                if (this.props.onChange && !this.silent) {
                    const value = $(event.currentTarget).val();
                    this.props.onChange(value, event);
                }
            })
    }

    componentWillUnmount() {
        $(this.container).off().select2('destroy')
    }

    componentWillReceiveProps(nextProps) {
        const oldProps = this.props;

        if(nextProps.value !== oldProps.value) {
            this.silent = true;

            $(this.container).val(nextProps.value);
            $(this.container).trigger('change.select2');

            this.silent = false;
        }

        if(nextProps.options !== oldProps.options) {
            $(this.container).select2({ data: nextProps.options })
        }
    }

    render() {
        const { children, style } = this.props

        return (
            <select ref={container => (this.container = container)} style={style}>{ children }</select>
        )
    }
}
