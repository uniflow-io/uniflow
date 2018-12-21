import React, { Component } from 'react'
import { Select2Component } from '../../components'

export default class SearchComponent extends Component {
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
        const { components } = this.props
        const { search } = this.state

        return (
            <div className="box box-info">
                <form className="form-horizontal" onSubmit={this.onSubmit}>
                    <div className="box-header with-border">
                        <h3 className="box-title pull-left" style={{'paddingTop': '8px'}}>Component</h3>
                        <div className="col-sm-10 pull-right" style={{'paddingRight': '0px'}}>
                            <div className="input-group">
                                <Select2Component value={search} onChange={this.onChange} className="form-control pull-right" id="search{{ _uid }}" style={{width: '100%'}}>
                                    {components.map((component) => (
                                        <option key={component.key} value={component.key}>{ component.label }</option>
                                    ))}
                                </Select2Component>
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
