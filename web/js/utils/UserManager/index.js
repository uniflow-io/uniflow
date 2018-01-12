import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchComponents} from 'uniflow/reducers/user/actions'

type Props = {
    children: React.Node
}

class UserManager extends Component<Props> {
    componentDidMount() {
        this.props.dispatch(fetchComponents())
    }

    render() {
        return (<div/>)
    }
}

export default connect(state => {
    return {
        items: state.user.items
    }
})(UserManager)