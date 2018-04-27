import {fetchHistory} from './reducers/history/actions'
import history from './reducers/history/index'
import createStore from './utils/createStore'

//const history = createBrowserHistory()
let store = createStore(history)


store.dispatch(fetchHistory()).then(() => {
    console.log(store.getState())
})