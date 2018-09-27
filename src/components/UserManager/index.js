import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchComponents, fetchSettings} from '../../reducers/user/actions'
import routes, {pathTo} from "../../routes";
import {withRouter, matchPath} from 'react-router'
import {getHistoryBySlug, fetchHistory, setCurrentHistory} from "../../reducers/history/actions";

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
            const { user, historyState } = this.props

            const match = matchPath(location.pathname, {
                path: routes.flow.path,
                exact: true
            })
            if (match) {
                let historyObj = getHistoryBySlug(historyState, match.params.slug)
                if(historyObj) {
                    this.props.dispatch(setCurrentHistory(historyObj.id))
                }

                if(user.username) {
                    history.push(pathTo('userFlow', {username: user.username, slug: match.params.slug}))
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
                const { user, historyState } = this.props
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
                    let historyObj = getHistoryBySlug(historyState, flowMatch.params.slug)
                    if(historyObj) {
                        this.props.dispatch(setCurrentHistory(historyObj.id))
                    }

                    if(user.username) {
                        history.push(pathTo('userFlow', {username: user.username, slug: flowMatch.params.slug}))
                    }
                } else if (userFlowMatch) {
                    let historyObj = getHistoryBySlug(historyState, userFlowMatch.params.slug)
                    if(historyObj) {
                        this.props.dispatch(setCurrentHistory(historyObj.id))
                    }
                } else if (dashboardMatch) {
                    let keys = Object.keys(historyState.items)

                    keys.sort((keyA, keyB) => {
                        let itemA = historyState.items[keyA],
                            itemB = historyState.items[keyB]

                        return itemB.updated.diff(itemA.updated)
                    })

                    if (keys.length > 0) {
                        let item = historyState.items[keys[0]]
                        let historyObj = getHistoryBySlug(historyState, dashboardMatch.params.slug)
                        if(historyObj) {
                            this.props.dispatch(setCurrentHistory(historyObj.id))
                                .then(() => {
                                    if(user.username) {
                                        history.push(pathTo('userFlow', {username: user.username, slug: item.slug}))
                                    } else {
                                        history.push(pathTo('flow', {slug: item.slug}))
                                    }
                                })
                        }
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
        historyState: state.history
    }
})(withRouter(UserManager))
