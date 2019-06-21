import {createStore} from 'redux';
import sessionReducer from './reducers/session';

const store = createStore(sessionReducer,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;