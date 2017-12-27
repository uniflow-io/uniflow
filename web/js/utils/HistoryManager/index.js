import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchHistory, setCurrentHistory} from 'uniflow/reducers/history/actions'
import { withRouter, matchPath } from 'react-router'
import routes from 'uniflow/routes'

type Props = {
    children: React.Node
}

class HistoryManager extends Component<Props> {
    componentDidMount() {
        const { location, history } = this.props

        this.historyUnlisten = history.listen((location, action) => {
            const match = matchPath(location.pathname, {
                path: routes.homeDetail.path,
                exact: true
            })
            if (match) {
                this.props.dispatch(setCurrentHistory(parseInt(match.params.id)))
            }
        })

        this.props.dispatch(fetchHistory()).then(() => {
            const match = matchPath(location.pathname, {
                path: routes.homeDetail.path,
                exact: true
            })
            if (match) {
                this.props.dispatch(setCurrentHistory(parseInt(match.params.id)))
            } else {
                let keys = Object.keys(this.props.items)

                keys.sort((keyA, keyB) => {
                    let itemA = this.props.items[keyA],
                        itemB = this.props.items[keyB]

                    return itemB.updated.diff(itemA.updated)
                })

                if (keys.length > 0) {
                    let item = this.props.items[keys[0]]
                    this.props.dispatch(setCurrentHistory(item.id))
                }
            }
        })
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
        items: state.history.items,
        current: state.history.current
    }
})(withRouter(HistoryManager))