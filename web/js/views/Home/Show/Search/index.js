import React, { Component } from 'react'
import { Select2 } from 'uniflow/components/index'
import {connect} from 'react-redux'
import components from 'uniflow/uniflow/components';

class Search extends Component {
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
            <form className="form-horizontal" onSubmit={this.onSubmit}>
                <div className="form-group">
                    <label htmlFor="search{{ _uid }}" className="col-sm-2 control-label">Component</label>

                    <div className="col-sm-9">
                        <Select2 value={search} onChange={this.onChange} className="form-control" id="search{{ _uid }}" style={{width: '100%'}}>
                            {componentLabels.map((component) => (
                                <option key={component.key} value={component.key}>{ component.label }</option>
                            ))}
                        </Select2>
                    </div>
                    <div className="col-sm-1">
                        <button type="submit" className="btn btn-info pull-right">OK</button>
                    </div>
                </div>
            </form>
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
})(Search)