import React, { Component } from 'react'
import { Select2 } from '../../components/index'
import {connect} from 'react-redux'
import components from '../../uniflow/components';

class ComponentSearch extends Component {
    state = {
        search: 'javascript'
    }

    onSubmit = (event) => {
        event.preventDefault()

        if (this.props.onPush) {
            this.props.onPush(this.state.search);
        }
    }

    onChange = (value) => {
        this.setState({search: value})
    }

    render() {
        const { componentLabels } = this.props
        const { search } = this.state

        return (
            <div className="box box-info">
                <form className="form-horizontal" onSubmit={this.onSubmit}>
                    <div className="box-header with-border">
                        <h3 className="box-title pull-left" style={{'paddingTop': '8px'}}>Component</h3>
                        <div className="col-sm-10 pull-right" style={{'paddingRight': '0px'}}>
                            <div className="input-group">
                                <Select2 value={search} onChange={this.onChange} className="form-control pull-right" id="search{{ _uid }}" style={{width: '100%'}}>
                                    {componentLabels.map((component) => (
                                        <option key={component.key} value={component.key}>{ component.label }</option>
                                    ))}
                                </Select2>
                                <span className="input-group-btn">
                                    <button type="submit" className="btn btn-info pull-right">OK</button>
                                </span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

const getComponentLabels = (userComponents) => {
    let componentLabels = []

    for(let i = 0; i < userComponents.length; i++) {
        let key = userComponents[i]

        componentLabels.push({
            key: key,
            label: components[key].tags().join(' - ') + ' : ' + key
        })
    }

    componentLabels.sort(function(component1, component2) {
        let x = component1.label;
        let y = component2.label;
        return x < y ? -1 : x > y ? 1 : 0;
    })

    return componentLabels
}

export default connect(state => {
    return {
        componentLabels: getComponentLabels(state.user.components),
    }
})(ComponentSearch)