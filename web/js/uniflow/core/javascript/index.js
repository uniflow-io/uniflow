import React, { Component } from 'react'

type Props = {
    bus: Object
}

export default class CoreJavascript extends Component<Props> {
    state = {
        code: null
    }

    onDelete = (event) => {
        event.preventDefault()
    }

    render() {
        return (
            <div className="box box-info">
                <form className="form-horizontal">
                    <div className="box-header with-border">
                        <h3 className="box-title">Javascript</h3>
                        <div className="box-tools pull-right">
                            <a className="btn btn-box-tool" onClick={this.onDelte}><i className="fa fa-times" /></a>
                        </div>
                    </div>
                    <div className="box-body">
                        <div className="form-group">
                            <label for="code{{ _uid }}" className="col-sm-2 control-label">Code</label>

                            <div className="col-sm-10">
                                <ace className="form-control" id="code{{ _uid }}" v-model="code" placeholder="Code" height="200" mode="javascript"></ace>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}
