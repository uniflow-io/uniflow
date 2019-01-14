import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchComponents, fetchSettings } from '../../reducers/user/actions'
import routes, { pathTo, matchRoute } from '../../routes'
import { withRouter } from 'react-router'
import { fetchHistory, getHistoryBySlug, setCurrentHistory, commitSetCurrentPathHistory, setUsernameHistory } from '../../reducers/history/actions'

class UserManagerComponent extends Component<Props> {
  componentDidMount () {
    const { auth, history } = this.props

    this.historyUnlisten = history.listen(this.onLocation)

    if (auth.isAuthenticated) {
      this.onFetchUser(auth.token)
    } else {
      this.onLocation(history.location)
    }
  }

  componentWillReceiveProps (nextProps) {
    const oldProps = this.props

    if (nextProps.auth.token !== oldProps.auth.token && nextProps.auth.isAuthenticated) {
      this.onFetchUser(nextProps.auth.token)
    }
  }

  componentWillUnmount () {
    this.historyUnlisten()
  }

    onLocation = (location) => {
      const { user, history, historyState } = this.props

      const match = matchRoute(location.pathname)

      if (match) {
        if (match.route === 'dashboard') {
          this.onFetchHistory('me')
        } else if (match.route === 'flow') {
          this.onFetchHistory('me', match.match.params.slug1, match.match.params.slug2, match.match.params.slug3)
          if (user.username) {
            history.push(pathTo('userFlow', { username: user.username, slug1: match.match.params.slug1, slug2: match.match.params.slug2, slug3: match.match.params.slug3 }))
          }
        } else if (match.route === 'userDashboard') {
          this.onFetchHistory(match.match.params.username)
        } else if (match.route === 'userFlow') {
          this.onFetchHistory(match.match.params.username, match.match.params.slug1, match.match.params.slug2, match.match.params.slug3)
        }
      }
    }

    onFetchUser = (token) => {
      Promise.all([
        this.props.dispatch(fetchComponents(token)),
        this.props.dispatch(fetchSettings(token))
      ]).then(() => {
        const { history } = this.props

        this.onLocation(history.location)
      })
    }

    onFetchHistory = (username = 'me', slug1 = null, slug2 = null, slug3 = null) => {
      const { auth, historyState } = this.props

      Promise.resolve()
        .then(() => {
          let path = []
          return this.props.dispatch(commitSetCurrentPathHistory(path))
        })
        .then(() => {
          if (historyState.username === username) {
            return
          }

          return this.props.dispatch(setUsernameHistory(username))
            .then(() => {
              const token = auth.isAuthenticated ? auth.token : null
              return this.props.dispatch(fetchHistory(username, token))
            })
        })
        .then(() => {
          const { historyState } = this.props

          let historyObj = getHistoryBySlug(historyState, slug1, slug2, slug3)
          if (historyObj) {
            this.props.dispatch(setCurrentHistory({type: 'history', id: historyObj.id}))
          } else {
            let keys = Object.keys(historyState.items)

            keys.sort((keyA, keyB) => {
              let itemA = historyState.items[keyA]

              let itemB = historyState.items[keyB]

              return itemB.updated.diff(itemA.updated)
            })

            if (keys.length > 0) {
              let item = historyState.items[keys[0]]
              this.props.dispatch(setCurrentHistory({type: 'history', id: historyState.items[keys[0]].id}))
            }
          }
        })
    }

    render () {
      return (<div />)
    }
}

export default connect(state => {
  return {
    auth: state.auth,
    user: state.user,
    historyState: state.history
  }
})(withRouter(UserManagerComponent))
