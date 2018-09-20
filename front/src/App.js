import React, {Component} from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from 'react-router-dom'
import {Provider, connect} from 'react-redux'
import routes, {pathTo} from './routes'
import reducers from './reducers/index'
import { UserManager } from './components/index'
import createStore from './utils/createStore'
import {getNewLogs,commitReadLog} from './reducers/log/actions'
import {commitLoginUserSuccess, commitLogoutUser} from './reducers/auth/actions'
//import createBrowserHistory from 'history/createBrowserHistory'

//const history = createBrowserHistory()
let store = createStore(reducers)
let token = localStorage.getItem('token');
if (token !== null) {
    store.dispatch(commitLoginUserSuccess(token));
}

class Alerts extends Component {
    onClose = (event, id) => {
        event.preventDefault()

        this.props.dispatch(commitReadLog(id))
    }

    render() {
        const {logs} = this.props

        return (
            <div>
                {Object.keys(logs).map((key, index) => (
                    <div key={index} className="alert alert-danger" style={{marginBottom: '0px'}}>
                        <button type="button" className="close" aria-hidden="true" onClick={(event) => this.onClose(event, logs[key].id)}>×</button>
                        <h4><i className="icon fa fa-ban" /> {logs[key].message}</h4>
                    </div>
                ))}
            </div>
        )
    }
}

const DisplayAlerts = connect(state => ({
    logs: getNewLogs(state.logs)
}))(Alerts)

class Header extends Component {
    onLogout = (e) => {
        e.preventDefault()

        this.props.dispatch(commitLogoutUser())
    }

    render() {
        const { auth } = this.props

        return (
            <header className="main-header">
                <nav className="navbar navbar-static-top">
                    <div className="navbar-custom-menu">
                        <ul className="nav navbar-nav">
                            <li>
                                <Link to={pathTo('home')}>Home</Link>
                            </li>
                            {auth.isAuthenticated && (
                            <li>
                                <Link to={pathTo('dashboard')}>Dashboard</Link>
                            </li>
                            )}
                            <li>
                                <Link to={pathTo('faq')}>FAQ</Link>
                            </li>
                            <li>
                                <Link to={pathTo('logs')}>Logs</Link>
                            </li>
                            {auth.isAuthenticated && (
                            <li>
                                <Link to={pathTo('settings')}>Settings</Link>
                            </li>
                            )}
                            {!auth.isAuthenticated && (
                            <li>
                                <Link to={pathTo('login')}>Login</Link>
                            </li>
                            )}
                            {auth.isAuthenticated && (
                                <li>
                                    <a onClick={this.onLogout}><span className="glyphicon glyphicon-off logout" aria-hidden="true"/></a>
                                </li>
                            )}
                        </ul>
                    </div>
                </nav>
            </header>
        )
    }
}

const DisplayHeader = connect(state => ({
    auth: state.auth
}))(Header)

export default class App extends Component {
    render() {
        const auth = store.getState().auth;

        return (
            //<React.StrictMode>
                <Provider store={store}>
                    <Router>
                        <div>
                            <UserManager />

                            <div className="wrapper">

                                <DisplayAlerts />
                                <DisplayHeader />

                                <Switch>
                                    {Object.values(routes).map(route => (
                                        <Route key={route.path} {...route} />
                                    ))}
                                </Switch>

                                {/*footer className="main-footer">
                                        <div className="pull-right hidden-xs">
                                            <b>Version</b> 2.3.3
                                        </div>
                                        <strong>Copyright &copy; 2014-2015 <a href="http://almsaeedstudio.com">Almsaeed Studio</a>.</strong> All rights
                                        reserved.
                                    </footer*/}
                            </div>
                        </div>
                    </Router>
                </Provider>
            //</React.StrictMode>
        )
    }
}
