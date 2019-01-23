import React, {Component} from 'react'
import {connect} from 'react-redux'

class Home extends Component {
    render() {
        return (
            <div>Hello Home ! {this.props.env.facebookAppId} </div>
        )
    }
}

Home = connect(state => {
    return {
        env: state.env
    }
})(Home)

export default () => (
    <Home />
)
