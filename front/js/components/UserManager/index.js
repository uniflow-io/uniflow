import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchComponents, fetchProfile} from '../../reducers/user/actions'

type Props = {
    children: React.Node
}

class UserManager extends Component<Props> {
    componentDidMount() {
        this.props.dispatch(fetchComponents())
            .then(() => {
                return this.props.dispatch(fetchProfile())
            })
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