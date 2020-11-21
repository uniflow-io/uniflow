import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchSettings } from '../reducers/user/actions'
import { matchRoute } from '../routes'
import { fetchFeed, setSlugFeed } from '../reducers/feed/actions'

class UserManager extends Component {
  state = {
    fetching: false,
  }

  componentDidMount() {
    const { auth, location } = this.props

    if (auth.isAuthenticated) {
      this.onFetchUser(auth.uid, auth.token)
    }

    this.onLocation(location)
  }

  componentDidUpdate(prevProps) {
    const { auth, location } = this.props

    if (auth.isAuthenticated && auth.token !== prevProps.auth.token) {
      this.onFetchUser(auth.uid, auth.token)
    }

    if (location.href !== prevProps.location.href) {
      this.onLocation(location)
    }
  }

  onLocation = location => {
    const { auth } = this.props
    const match = matchRoute(location.pathname)

    if (match) {
      let params = match.match.params
      if (match.route === 'feed' && auth.isAuthenticated) {
        this.onFetchItem(auth.uid, [
          params.slug1,
          params.slug2,
          params.slug3,
          params.slug4,
          params.slug5
        ])
      } else if (match.route === 'userFeed') {
        this.onFetchItem(params.uid, [
          params.slug1,
          params.slug2,
          params.slug3,
          params.slug4,
          params.slug5
        ])
      }
    }
  }

  onFetchUser = (uid, token) => {
    Promise.all([
      this.props.dispatch(fetchSettings(uid, token)),
    ]).then(() => {
      const { location } = this.props

      this.onLocation(location)
    })
  }

  onFetchItem = (uid, paths = []) => {
    const { fetching } = this.state
    const { auth, feed } = this.props

    if (fetching) {
      return
    }

    Promise.resolve()
      .then(async () => {
        return new Promise(resolve => {
          this.setState({ fetching: true }, resolve)
        })
      })
      .then(async () => {
        paths = paths.filter((path) => !!path)

        /*const isSameFolder = 
          (paths.length == 0 && !feed.parentFolder) ||
          (paths.length >= 2 && feed.parentFolder && `${feed.parentFolder.path}${feed.parentFolder.slug}` === `/${paths.slice(0, -1).join('/')}`)
        if (feed.uid === uid && isSameFolder) {
          const slug = paths.length > 0 ? paths[paths.length - 1] : null
          return this.props.dispatch(setSlugFeed(slug))
        }*/

        const token = auth.isAuthenticated ? auth.token : null
        return this.props.dispatch(fetchFeed(uid, paths, token))
      })
      .then(async () => {
        return new Promise(resolve => {
          this.setState({ fetching: false }, resolve)
        })
      })
  }

  render() {
    return <></>
  }
}

export default connect(state => {
  return {
    auth: state.auth,
    user: state.user,
    feed: state.feed,
  }
})(UserManager)
