import React, { Component } from 'react'
import { fetchConfig, updateConfig } from '../reducers/config/actions'
import { connect } from 'react-redux'

class Admin extends Component {
  state = {
    config: {
    },
    isSaving: false,
  }

  componentDidMount() {
    this.props.dispatch(fetchConfig(this.props.auth.token)).then(response => {
      this.setState({
        config: Object.assign({}, this.state.config, response.data),
      })
    })
  }

  onUpdate = event => {
    if (event) {
      event.preventDefault()
    }

    this.setState({ isSaving: true }, () => {
      this.props
        .dispatch(updateConfig(this.state.config, this.props.auth.token))
        .then(() => {
          this.setState({ isSaving: false })
        })
    })
  }

  render() {
    const { env } = this.props
    const { config } = this.state

    return (
      <>
        <section className="section container-fluid">
          <h3 className="box-title">Admin</h3>
          <form className="form-sm-horizontal">
          </form>
        </section>
      </>
    )
  }
}

export default connect(state => {
  return {
    auth: state.auth,
    env: state.env,
    user: state.user,
  }
})(Admin)
