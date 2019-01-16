import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchComponents, fetchSettings} from '../../reducers/user/actions'
import routes, {pathTo, matchRoute} from '../../routes'
import {withRouter} from 'react-router'
import {
  fetchHistory,
  getHistoryBySlug,
  setCurrentHistory,
  commitSetCurrentPath,
  setUsernameHistory
} from '../../reducers/history/actions'

class UserManagerComponent extends Component<Props> {
  componentDidMount() {
    const {auth, history} = this.props

    this.historyUnlisten = history.listen(this.onLocation)

    if (auth.isAuthenticated) {
      this.onFetchUser(auth.token)
    } else {
      this.onLocation(history.location)
    }
  }

  componentWillReceiveProps(nextProps) {
    const oldProps = this.props

    if (nextProps.auth.token !== oldProps.auth.token && nextProps.auth.isAuthenticated) {
      this.onFetchUser(nextProps.auth.token)
    }
  }

  componentWillUnmount() {
    this.historyUnlisten()
  }

  onLocation = (location) => {
    const {user, history, historyState} = this.props

    const match = matchRoute(location.pathname)

    if (match) {
      let params = match.match.params
      if (match.route === 'dashboard') {
        this.onFetchHistory('me')
      } else if (match.route === 'flow') {
        this.onFetchHistory('me', params.slug1, params.slug2, params.slug3, params.slug4, params.slug5)
        if (user.username) {
          history.push(pathTo('userFlow', {
            username: user.username,
            slug1: params.slug1,
            slug2: params.slug2,
            slug3: params.slug3,
            slug4: params.slug4,
            slug5: params.slug5
          }))
        }
      } else if (match.route === 'userDashboard') {
        this.onFetchHistory(params.username)
      } else if (match.route === 'userFlow') {
        this.onFetchHistory(params.username, params.slug1, params.slug2, params.slug3, params.slug4, params.slug5)
      }
    }
  }

  onFetchUser = (token) => {
    Promise.all([
      this.props.dispatch(fetchComponents(token)),
      this.props.dispatch(fetchSettings(token))
    ]).then(() => {
      const {history} = this.props

      this.onLocation(history.location)
    })
  }

  onFetchHistory = (username = 'me', slug1 = null, slug2 = null, slug3 = null, slug4 = null, slug5 = null) => {
    const {auth, historyState} = this.props

    Promise.resolve()
      .then(() => {
        let path = [slug1, slug2, slug3, slug4, slug5].reduce((path, slug) => {
          if (slug) {
            path.push(slug)
          }
          return path
        }, [])
        return this.props.dispatch(commitSetCurrentPath(path)).then(() => {
          return path
        })
      })
      .then((path) => {
        if (historyState.username === username) {
          return path
        }

        return this.props.dispatch(setUsernameHistory(username))
          .then(() => {
            const token = auth.isAuthenticated ? auth.token : null
            return this.props.dispatch(fetchHistory(username, path, token))
          }).then(() => {
            return path
          })
      })
      .then((path) => {
        const {historyState} = this.props

        let slug = path.length > 0 ? path[path.length - 1] : null

        let historyObj = getHistoryBySlug(historyState, slug)
        if (historyObj) {
          this.props.dispatch(setCurrentHistory({type: historyObj.constructor.name, id: historyObj.id}))
        } else {
          let items = Object.keys(historyState.items)
            .filter((key) => {
              return historyState.items[key].constructor.name === 'History'
            })
            .reduce((res, key) => (res[key] = historyState.items[key], res), {})
          let keys  = Object.keys(items)

          keys.sort((keyA, keyB) => {
            let itemA = items[keyA]
            let itemB = items[keyB]

            return itemB.updated.diff(itemA.updated)
          })

          if (keys.length > 0) {
            let item = items[keys[0]]
            this.props.dispatch(setCurrentHistory({type: item.constructor.name, id: item.id}))
          }
        }
      })
  }

  render() {
    return (<div/>)
  }
}

export default connect(state => {
  return {
    auth: state.auth,
    user: state.user,
    historyState: state.history
  }
})(withRouter(UserManagerComponent))
