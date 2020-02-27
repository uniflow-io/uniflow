import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faTimes } from '@fortawesome/free-solid-svg-icons'

class Header extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-4 col-sm-2">
          <h4>{this.props.title ? this.props.title : 'Flow'}</h4>
        </div>
        <div className="col">
          <div className="btn-toolbar" role="toolbar" aria-label="flow actions">
            <div className="btn-group-sm" role="group">
              {this.props.clients.indexOf('uniflow') !== -1 &&
                this.props.isRunning === false && (
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={this.props.onRun}
                  >
                    <FontAwesomeIcon icon={faPlay} />
                  </button>
                )}
              {this.props.clients.indexOf('uniflow') !== -1 &&
                this.props.isRunning === true && (
                  <button type="button" className="btn">
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    />
                  </button>
                )}
            </div>
          </div>
        </div>
        <div className="d-block col-auto">
          <div className="btn-toolbar" role="toolbar" aria-label="flow actions">
            <div className="btn-group-sm" role="group">
              {this.props.onDelete && (
                <button
                  type="button"
                  className="btn"
                  onClick={this.props.onDelete}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Header
