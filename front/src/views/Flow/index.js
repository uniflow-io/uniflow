import React, {Component} from 'react'
import History from './History/index'
import Show from './Show/index'
import {fetchHistory, getCurrentHistory, setCurrentHistory} from '../../reducers/history/actions'
import {connect} from 'react-redux'
import routes, {pathTo} from "../../routes";
import {withRouter, matchPath} from 'react-router'

class Flow extends Component<Props> {
    componentDidMount() {
        const {location, history} = this.props

        this.props.dispatch(fetchHistory()).then(() => {
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
    }

    render() {
        return (
            <div id="flow" className="content-wrapper">
                {/* Content Header (Page header) */}
                <section className="content-header">
                    <h1>
                        Dashboard
                        <small>Control panel</small>
                    </h1>
                    <ol className="breadcrumb">
                        <li><a href="#"><i className="fa fa-dashboard"/> Dashboard</a></li>
                        <li className="active">Flow</li>
                    </ol>
                </section>

                <section className="content">
                    <div className="row">
                        <div className="col-sm-2">

                            <History/>

                        </div>
                        <div className="col-sm-10">

                            {this.props.currentHistory && (
                                <Show/>
                            )}

                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

export default connect(state => {
    return {
        currentHistory: getCurrentHistory(state.history)
    }
})(withRouter(Flow))
