import React, { Component } from 'react'
import { Select2 } from 'uniflow/components/index'
import {connect} from 'react-redux'

class Search extends Component {
    state = {
        search: 'core-javascript'
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
        const { optionGroups } = this.props
        const { search } = this.state

        return (
            <form className="form-horizontal" onSubmit={this.onSubmit}>
                <div className="form-group">
                    <label htmlFor="search{{ _uid }}" className="col-sm-2 control-label">Component</label>

                    <div className="col-sm-9">
                        <Select2 value={search} onChange={this.onChange} className="form-control" id="search{{ _uid }}" style={{width: '100%'}}>
                            {Object.keys(optionGroups).map((group) => (
                                <optgroup key={group} label={group}>
                                    {optionGroups[group].map((option) => (
                                        <option key={option.id} value={option.id}>{ option.text }</option>
                                    ))}
                                </optgroup>
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

const getOptionGroups = (components) => {
    let optionGroups = {}

    for(let i = 0; i < components.length; i++) {
        let key = components[i]
        let [group, label] = key.split('-');

        if(!optionGroups[group]) {
            optionGroups[group] = [];
        }

        optionGroups[group].push({
            id: key, text: label
        });
    }

    return optionGroups
}

export default connect(state => {
    return {
        optionGroups: getOptionGroups(state.user.components),
    }
})(Search)