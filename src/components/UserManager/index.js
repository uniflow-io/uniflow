import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchComponents, fetchSettings} from '../../reducers/user/actions'
import routes, {pathTo} from "../../routes";
import {withRouter, matchPath} from 'react-router'
import {fetchHistory, setCurrentHistory} from "../../reducers/history/actions";

class UserManager extends Component<Props> {
    componentWillReceiveProps(nextProps) {
        const oldProps = this.props;

        if (nextProps.auth.token !== oldProps.auth.token && nextProps.auth.isAuthenticated) {
            this.onFetchUser(nextProps.auth.token);
        }
    }

    componentDidMount() {
        const {history, auth} = this.props

        if(auth.isAuthenticated) {
            this.onFetchUser(auth.token);
        }

        this.historyUnlisten = history.listen((location) => {
            const user = this.props.user

            const match = matchPath(location.pathname, {
                path: routes.flow.path,
                exact: true
            })
            if (match) {
                const current = parseInt(match.params.id)
                this.props.dispatch(setCurrentHistory(current))

                if(user.username) {
                    history.push(pathTo('userFlow', {username: user.username, id: item.id}))
                }
            }
        })
    }

    componentWillUnmount() {
        this.historyUnlisten()
    }

    onFetchUser = (token) => {
        const {history} = this.props

        Promise.all([
            this.props.dispatch(fetchComponents(token)),
            this.props.dispatch(fetchSettings(token))
        ]).then(() => {
            this.props.dispatch(fetchHistory(token)).then(() => {
                const user = this.props.user
                const flowMatch = matchPath(location.pathname, {
                    path: routes.flow.path,
                    exact: true
                })
                const dashboardMatch = matchPath(location.pathname, {
                    path: routes.dashboard.path,
                    exact: true
                })

                let userFlowMatch = false
                if(user.username) {
                    userFlowMatch = matchPath(location.pathname, {
                        path: routes.userFlow.path,
                        exact: true
                    })
                }

                if (flowMatch) {
                    const current = parseInt(flowMatch.params.id)
                    this.props.dispatch(setCurrentHistory(current))

                    if(user.username) {
                        history.push(pathTo('userFlow', {username: user.username, id: item.id}))
                    }
                } else if (userFlowMatch) {
                    const current = parseInt(userFlowMatch.params.id)
                    this.props.dispatch(setCurrentHistory(current))
                } else if (dashboardMatch) {
                    let keys = Object.keys(this.props.items)

                    keys.sort((keyA, keyB) => {
                        let itemA = this.props.items[keyA],
                            itemB = this.props.items[keyB]

                        return itemB.updated.diff(itemA.updated)
                    })

                    if (keys.length > 0) {
                        let item = this.props.items[keys[0]]
                        this.props.dispatch(setCurrentHistory(item.id))
                            .then(() => {
                                if(user.username) {
                                    history.push(pathTo('userFlow', {username: user.username, id: item.id}))
                                } else {
                                    history.push(pathTo('flow', {id: item.id}))
                                }
                            })
                    } else if(user.username) {
                        history.push(pathTo('userDashboard', {username: user.username}))
                    }
                }
            })
        })
    }

    render() {
        return (<div/>)
    }
}

export default connect(state => {
    return {
        auth: state.auth,
        user: state.user,
        items: state.history.items
    }
})(withRouter(UserManager))
