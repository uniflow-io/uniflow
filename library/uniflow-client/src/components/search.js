import React, { Component } from "react"
import { Select } from "../components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDotCircle } from "@fortawesome/free-regular-svg-icons"

export default class Search extends Component {
  state = {
    search: "@uniflow-io/uniflow-flow-javascript",
  }

  onSubmit = (event) => {
    event.preventDefault()

    if (this.props.onPush) {
      this.props.onPush(this.state.search)
    }
  }

  onChange = (value) => {
    this.setState({ search: value })
  }

  render() {
    const { userFlows } = this.props
    const { search } = this.state

    return (
      <form className="form-sm-horizontal" onSubmit={this.onSubmit}>
        <div className="form-group row">
          <label htmlFor="search{{ _uid }}" className="col-sm-2 col-form-label">
            Flow
          </label>
          <div className="col-sm-10">
            <div className="input-group">
              <div className="custom-select">
                <Select
                  value={search}
                  onChange={this.onChange}
                  className="form-control pull-right"
                  id="search{{ _uid }}"
                  options={userFlows.map((flow) => {
                    return { value: flow.key, label: flow.label }
                  })}
                />
              </div>
              <div className="input-group-append">
                <button type="submit" className="input-group-text">
                  <FontAwesomeIcon icon={faDotCircle} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    )
  }
}
