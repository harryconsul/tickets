import {createStore,compose,applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import sessionReducer from './reducers/session';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(sessionReducer,
    composeEnhancers(applyMiddleware(thunk))
);


export default store;

/*
    redux-thunk: middle ware en medio de dispatch y 
    reducer. dispatch -> action -> thunk -> reducer. NO PURE FUNCTIONS
*/