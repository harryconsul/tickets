import {createStore} from 'redux';
import sessionReducer from './reducers/session';

const store = createStore(sessionReducer);

export default store;