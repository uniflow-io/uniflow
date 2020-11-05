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
    const { auth } = this.props

    this.props.dispatch(fetchConfig(auth.token, auth.uid)).then(response => {
      this.setState({
        config: Object.assign({}, this.state.config, response.data),
      })
    })
  }

  onUpdate = event => {
    const { auth } = this.props

    if (event) {
      event.preventDefault()
    }

    this.setState({ isSaving: true }, () => {
      this.props
        .dispatch(updateConfig(this.state.config, auth.token, auth.uid))
        .then(() => {
          this.setState({ isSaving: false })
        })
    })
  }

  render() {
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
