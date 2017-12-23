import React, { Component } from 'react'
import { Select2 } from 'uniflow/components/index'
import components from 'uniflow/uniflow/components';

export default class Search extends Component {
    state = {
        search: 'core-javascript'
    }

    constructor(props, ...rest) {
        super(props, ...rest)

        this.optionGroups = {}

        for(let key in components) {
            if(components.hasOwnProperty(key)) {
                let [group, label] = key.split('-');

                if(!this.optionGroups[group]) {
                    this.optionGroups[group] = [];
                }

                this.optionGroups[group].push({
                    id: key, text: label
                });
            }
        }
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
        const { search } = this.state

        return (
            <div>search
            <form className="form-horizontal" onSubmit={this.onSubmit}>
                <div className="form-group">
                    <label htmlFor="search{{ _uid }}" className="col-sm-2 control-label">Component</label>

                    <div className="col-sm-9">
                        <Select2 value={search} onChange={this.onChange} className="form-control" id="search{{ _uid }}" style="width: 100%">
                            {/*<optgroup v-for="(options, group) in optionGroups" :label="group">
                                <option v-for="o in options" :value="o.id">{{ o.text }}</option>
                            </optgroup>*/}
                        </Select2>
                    </div>
                    <div className="col-sm-1">
                        <button type="submit" className="btn btn-info pull-right">OK</button>
                    </div>
                </div>
            </form>
            </div>
        )
    }
}
