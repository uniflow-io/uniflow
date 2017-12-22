import React, { Component } from 'react'

type Props = {
    value: string,
    width?: number,
    height?: number,
    mode?: string
}

export default class Ace extends Component<Props> {
    render() {
        const { width, height } = this.props

        return (
            <div style={{
                height: height ? height + 'px' : '100%',
                width: width ? width + 'px' : '100%'
            }} />
        )
    }
}
