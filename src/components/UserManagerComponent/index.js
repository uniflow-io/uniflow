import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchComponents, fetchSettings } from '../../reducers/user/actions'
import { matchRoute } from '../../routes'
import {
  fetchFeed,
  getProgramBySlug,
  setCurrentFeed,
  setCurrentUsername,
  getCurrentProgram,
  getCurrentPath,
  feedPathTo,
} from '../../reducers/feed/actions'
import { navigate } from 'gatsby'
import moment from 'moment'

class UserManagerComponent extends Component {
  state = {
    fetching: false,
  }

  componentDidMount() {
    const { auth, location } = this.props

    if (auth.isAuthenticated) {
      this.onFetchUser(auth.token)
    }

    this.onLocation(location)
  }

  componentWillReceiveProps(nextProps) {
    const oldProps = this.props

    if (
      nextProps.auth.token !== oldProps.auth.token &&
      nextProps.auth.isAuthenticated
    ) {
      this.onFetchUser(nextProps.auth.token)
    }

    this.onLocation(nextProps.location)
  }

  onLocation = location => {
    const match = matchRoute(location.pathname)

    if (match) {
      let params = match.match.params
      if (match.route === 'feed') {
        this.onFetchProgram(
          'me',
          params.slug1,
          params.slug2,
          params.slug3,
          params.slug4,
          params.slug5
        )
      } else if (match.route === 'userFeed') {
        this.onFetchProgram(
          params.username,
          params.slug1,
          params.slug2,
          params.slug3,
          params.slug4,
          params.slug5
        )
      }
    }
  }

  onFetchUser = token => {
    Promise.all([
      this.props.dispatch(fetchComponents(token)),
      this.props.dispatch(fetchSettings(token)),
    ]).then(() => {
      const { location } = this.props

      this.onLocation(location)
    })
  }

  onFetchProgram = (
    username = 'me',
    slug1 = null,
    slug2 = null,
    slug3 = null,
    slug4 = null,
    slug5 = null
  ) => {
    const { fetching } = this.state
    const { feed } = this.props

    if (fetching) {
      return
    }

    Promise.resolve()
      .then(resolve => {
        this.setState({ fetching: true }, resolve)
      })
      .then(() => {
        let path = [slug1, slug2, slug3, slug4, slug5].reduce((path, slug) => {
          if (slug) {
            path.push(slug)
          }
          return path
        }, [])
        let currentPath = getCurrentPath(feed)

        let item = getCurrentProgram(feed)
        if (item) {
          currentPath.push(item.slug)
        }
        if (
          feed.username === username &&
          path.join('/') === currentPath.join('/')
        ) {
          return Promise.resolve()
        }

        return Promise.resolve()
          .then(() => {
            const { auth, feed } = this.props

            let slug = path.length > 0 ? path[path.length - 1] : null
            let sameDirectory =
              path.slice(0, -1).join('/') === getCurrentPath(feed).join('/')
            let isProgram =
              sameDirectory &&
              Object.keys(feed.items).filter(key => {
                return (
                  feed.items[key].type === 'program' &&
                  feed.items[key].slug === slug
                )
              }).length > 0
            if (feed.username === username && sameDirectory && isProgram) {
              return path
            }

            return this.props
              .dispatch(setCurrentUsername(username))
              .then(() => {
                const token = auth.isAuthenticated ? auth.token : null
                return this.props.dispatch(fetchFeed(username, path, token))
              })
          })
          .then(() => {
            const { feed } = this.props

            let slug = path.length > 0 ? path[path.length - 1] : null

            let program = getProgramBySlug(feed, slug)
            if (program) {
              this.props.dispatch(
                setCurrentFeed({ type: program.type, id: program.id })
              )
            } else if (feed.folder) {
              this.props.dispatch(setCurrentFeed(null))
            } else {
              let items = Object.keys(feed.items)
                .filter(key => {
                  return feed.items[key].type === 'program'
                })
                .reduce((res, key) => {
                  res[key] = feed.items[key]
                  return res
                }, {})
              let keys = Object.keys(items)

              keys.sort((keyA, keyB) => {
                let itemA = items[keyA]
                let itemB = items[keyB]

                return moment(itemB.updated).diff(moment(itemA.updated))
              })

              if (keys.length > 0) {
                let item = items[keys[0]]
                this.props.dispatch(
                  setCurrentFeed({ type: item.type, id: item.id })
                )
              } else {
                this.props.dispatch(setCurrentFeed(null))
              }
            }
          })
          .then(() => {
            const { user, feed } = this.props
            const isCurrentUser =
              feed.username && feed.username === user.username

            let currentPath = getCurrentPath(feed)

            let item = getCurrentProgram(feed)
            if (item) {
              currentPath.push(item.slug)
            }
            navigate(
              feedPathTo(
                currentPath,
                (item && item.public) || isCurrentUser ? feed.username : null
              )
            )
          })
      })
      .then(resolve => {
        this.setState({ fetching: false }, resolve)
      })
  }

  render() {
    return <div />
  }
}

export default connect(state => {
  return {
    auth: state.auth,
    user: state.user,
    feed: state.feed,
  }
})(UserManagerComponent)
