import React, { Component } from 'react'
import { Link } from 'gatsby'
import { getLastPublicPrograms, feedPathTo } from '../reducers/feed/actions'
import { connect } from 'react-redux'

class Flows extends Component {
  state = {
    programs: [],
  }

  componentDidMount() {
    this.onFetchFlowData()
  }

  onFetchFlowData = () => {
    this.props.dispatch(getLastPublicPrograms()).then(programs => {
      this.setState({ programs: programs })
    })
  }

  itemPathTo = item => {
    let path = item.path.slice()
    path.push(item.slug)

    return feedPathTo(path, item.username)
  }

  render() {
    const { programs } = this.state

    return (
      <section className="section container-fluid">
        <div className="row">
          <div className="col-md-12">
            <h3>Public Flows</h3>
            <dl className="row">
              {programs.map((item, i) => [
                <dt
                  className="col-md-2 text-md-right font-weight-normal"
                  key={i * 2}
                >
                  <Link to={this.itemPathTo(item)}>{item.name}</Link>
                </dt>,
                <dd className="col-md-10" key={i * 2 + 1}>
                  {item.description}
                </dd>,
              ])}
            </dl>
          </div>
        </div>
      </section>
    )
  }
}

export default connect(() => {
  return {}
})(Flows)
