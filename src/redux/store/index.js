// import devTools from 'remote-redux-devtools';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
// import { persistStore } from 'redux-persist';
import reducer from '../reducers';

export default createStore(reducer, undefined, applyMiddleware(thunk));
