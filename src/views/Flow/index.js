import React, {Component} from 'react'
import History from './History/index'
import Show from './Show/index'
import {getCurrentHistory} from '../../reducers/history/actions'
import {connect} from 'react-redux'

class Flow extends Component<Props> {
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
        currentHistory: getCurrentHistory(state.history),
    }
})(Flow)
