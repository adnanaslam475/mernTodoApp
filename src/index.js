import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom'
import thunk from 'redux-thunk';
import { applyMiddleware, combineReducers, createStore, compose } from 'redux';
import { Provider } from 'react-redux';
import todoReducer from './reducers/todoReducer'
import authReducer from './reducers/authReducer'
import errorReducer from './reducers/errorReducer'

const middleware = [thunk]
const rootReducer = combineReducers({
    todo: todoReducer,
    auth: authReducer,
    error: errorReducer
})

const store = createStore(
    rootReducer,
    compose(applyMiddleware(...middleware))
)

const app = (
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
)
ReactDOM.render(app, document.getElementById('root'));
serviceWorker.unregister();