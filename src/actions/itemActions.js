import * as actionTypes from './actionTypes'
import axios from 'axios'
import { returnErrors } from '../actions/errorActions'
import { tokenConfig } from './authActions'

export const itemsLoading = () => {
    return {
        type: actionTypes.TODOS_LOADING
    }
}

export const addTodo = todo => (dispatch, getState) => {
    axios.post('/api/todos/add', todo, tokenConfig(getState))
        .then(res => dispatch({
            type: actionTypes.ADD_TODO,
            payload: res.data,
        }))
        .catch(err =>
            dispatch(returnErrors(err.response.data, err.response.status))
        );
};


export const getTodos = () => dispatch => {
    dispatch(itemsLoading())
    axios.get('/api/todos')
        .then(res => {
            const fetchTodos = []
            for (let key in res.data) {
                fetchTodos.push({
                    ...res.data[key],
                    _id: key
                })
            }
            dispatch({
                type: actionTypes.GET_TODOS,
                payload: fetchTodos
            })
        })
        .catch(err => {
            console.log(err.response.data)
        })
}

export const getMyTodos = todos => {
    return dispatch => {
        dispatch(itemsLoading())
        axios.get('/api/todos')
            .then(res => dispatch({
                type: actionTypes.GET_MYTODOS,
                payload: res.data
            }),
            )
            .catch(
                err =>
                    dispatch(console.log('err'))
            );
    }
}

export const editTodo = _id => {
    return dispatch => {
        axios.get(`/api/todos${_id}`, _id)
            .then(res => dispatch({
                type: actionTypes.EDIT_TODO,
                payload: res.data
            }))
            .catch(err =>
                dispatch(console.log('cannot edit')
                ))
    }
}

export const deleteTodo = _id => (dispatch, getState) => {
    axios.delete(`/api/todos/${_id}`, tokenConfig(getState))
        .then(res => dispatch({
            type: actionTypes.DELETE_TODO,
            payload: _id
        }))
        .catch(
            err => {
                console.log('error to delete')
            }
        )
}