import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchComponents, fetchProfile} from '../../reducers/user/actions'
import routes, {pathTo} from "../../routes";
import {withRouter, matchPath} from 'react-router'
import {fetchHistory, setCurrentHistory} from "../../reducers/history/actions";

type Props = {
    children: React.Node
}

class UserManager extends Component<Props> {
    componentDidMount() {
        const {location, history} = this.props

        this.historyUnlisten = history.listen((location) => {
            const match = matchPath(location.pathname, {
                path: routes.flow.path,
                exact: true
            })
            if (match) {
                const current = parseInt(match.params.id)
                this.props.dispatch(setCurrentHistory(current))
            }
        })

        /*this.props.dispatch(fetchHistory()).then(() => {
            const flowMatch = matchPath(location.pathname, {
                path: routes.flow.path,
                exact: true
            })
            const dashboardMatch = matchPath(location.pathname, {
                path: routes.dashboard.path,
                exact: true
            })

            if (flowMatch) {
                const current = parseInt(flowMatch.params.id)
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
                            history.push(pathTo('flow', {id: item.id}))
                        })
                }
            }
        })

        this.props.dispatch(fetchComponents())
            .then(() => {
                return this.props.dispatch(fetchProfile())
            })*/
    }

    componentWillUnmount() {
        this.historyUnlisten()
    }

    render() {
        return (<div/>)
    }
}

export default connect(state => {
    return {
        auth: state.auth,
        items: state.history.items
    }
})(withRouter(UserManager))
