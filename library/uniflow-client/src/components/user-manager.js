import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchSettings } from '../reducers/user/actions'
import { matchRoute } from '../routes'
import {
  fetchFeed,
} from '../reducers/feed/actions'

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
    const { auth } = this.props

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

        const token = auth.isAuthenticated ? auth.token : null
        return this.props.dispatch(fetchFeed(uid, paths, token))
        /*if (feed.uid === uid && feed.path === path && feed.slug === slug) {
          return Promise.resolve()
        }*/

        /*return Promise.resolve()
          .then(() => {
            const { auth, feed } = this.props

            if (feed.uid === uid && feed.path === path) {
              return Promise.resolve()
            }

            const token = auth.isAuthenticated ? auth.token : null
            return this.props.dispatch(fetchFeed(uid, path, token))
              .then(() => {
                return this.props.dispatch(setUidFeed(uid))
              })
              .then(() => {
                return this.props.dispatch(setPathFeed(path))
              })
          })
          .then(() => {
            return this.props.dispatch(setSlugFeed(slug))
          })*/
          /*.then(() => {
            const { user, feed } = this.props
            const isCurrentUser =
              feed.uid && feed.uid === user.uid

            let currentPath = getPathFeed(feed)

            let item = getCurrentFeedItem(feed)
            if (item) {
              currentPath.push(item.slug)
            }
            const path = toFeedPath(
              currentPath,
              (item && item.public) || isCurrentUser ? feed.uid : null
            )
            if (typeof window !== `undefined` && window.location.pathname !== path) {
              navigate(path)
            }
          })*/
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
