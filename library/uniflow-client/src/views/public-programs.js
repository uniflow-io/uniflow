import React, { Component } from 'react'
import { Link } from 'gatsby'
import { connect } from 'react-redux'
import { getPublicPrograms, feedPathTo } from '../reducers/feed/actions'

class PublicPrograms extends Component {
  state = {
    programs: [],
  }

  componentDidMount() {
    this.onFetchFlowData()
  }

  onFetchFlowData = () => {
    this.props.dispatch(getPublicPrograms()).then(programs => {
      this.setState({ programs })
    })
  }

  render() {
    const { programs } = this.state
    const { user } = this.props

    return (
      <section className="section container-fluid">
        <div className="row">
          <div className="col-md-12">
            <h3>Public Flows</h3>
            <dl className="row">
              {programs.map((program, i) => [
                <dt className="col-md-2 text-md-right font-weight-normal" key={i * 2}>
                  <Link to={feedPathTo(program, user)}>{program.name}</Link>
                </dt>,
                <dd className="col-md-10" key={i * 2 + 1}>
                  {program.description}
                </dd>,
              ])}
            </dl>
          </div>
        </div>
      </section>
    )
  }
}

export default connect(state => {
  return {
    user: state.user,
  }
})(PublicPrograms)
