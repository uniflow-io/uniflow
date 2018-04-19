import React, {Component} from 'react'
import { Select2 } from 'uniflow/components/index'
import {Bus} from 'uniflow/models/index'
import {getOrderedHistory, getHistoryData} from 'uniflow/reducers/history/actions'
import {connect} from 'react-redux'

type Props = {
    bus: Bus
}

class ComponentInclude extends Component<Props> {
    state = {
        historyId: null
    }

    static tags() {
        return ['core']
    }

    getFlow = (historyId) => {
        let history = this.props.history.items[historyId]

        return Promise.resolve()
            .then(() => {

                return this.props.dispatch(getHistoryData(history));
            })
            .then((data) => {
                if(!data) return;

                history.data = data;

                return history.deserialiseFlowData()
            })
    }

    componentDidMount() {
        const {bus} = this.props

        bus.on('reset', this.deserialise);
        bus.on('compile', this.onCompile);
        bus.on('execute', this.onExecute);
    }

    componentWillUnmount() {
        const {bus} = this.props

        bus.off('reset', this.deserialise);
        bus.off('compile', this.onCompile);
        bus.off('execute', this.onExecute);
    }

    componentWillReceiveProps(nextProps) {
        const oldProps = this.props;

        if (nextProps.bus !== oldProps.bus) {
            oldProps.bus.off('reset', this.deserialise);
            oldProps.bus.off('compile', this.onCompile);
            oldProps.bus.off('execute', this.onExecute);

            nextProps.bus.on('reset', this.deserialise);
            nextProps.bus.on('compile', this.onCompile);
            nextProps.bus.on('execute', this.onExecute);
        }
    }

    serialise = () => {
        return [this.state.historyId];
    }

    deserialise = (data) => {
        let [historyId] = data ? data : [null];

        this.setState({historyId: historyId})
    }

    onChangeSelected = (historyId) => {
        this.setState({historyId: historyId}, this.onUpdate)
    }

    onUpdate = () => {
        this.props.onUpdate(this.serialise())
    }

    onDelete = (event) => {
        event.preventDefault()

        this.props.onPop()
    }

    onCompile = (interpreter, scope, asyncWrapper) => {
    }

    onExecute = (runner) => {
        this.getFlow(this.state.historyId)
            .then((flow) => {
                for(let i = 0; i < flow.length; i++) {
                    let item = flow[i]

                    if(item.component === 'javascript') {
                        runner.eval(item.data)
                    }
                }
        })
    }

    render() {
        const {historyId} = this.state

        return (
            <div className="box box-info">
                <form className="form-horizontal">
                    <div className="box-header with-border">
                        <h3 className="box-title">Include</h3>
                        <div className="box-tools pull-right">
                            <a className="btn btn-box-tool" onClick={this.onDelete}><i className="fa fa-times" /></a>
                        </div>
                    </div>
                    <div className="box-body">
                        <div className="form-group">
                            <label htmlFor="select{{ _uid }}" className="col-sm-2 control-label">Select</label>

                            <div className="col-sm-10">
                                <Select2 value={historyId} onChange={this.onChangeSelected} className="form-control" id="select{{ _uid }}" style={{width: '100%'}}>
                                    {getOrderedHistory(this.props.history).map((item, i) => (
                                        <option key={item.id} value={item.id}>{ item.title }</option>
                                    ))}
                                </Select2>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default connect(state => {
    return {
        history: state.history
    }
})(ComponentInclude)