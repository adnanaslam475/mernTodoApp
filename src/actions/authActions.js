import * as actionTypes from './actionTypes'
import axios from 'axios'
import { returnErrors } from './errorActions'


export const loginStart = () => {
    return {
        type: actionTypes.LOGIN_START
    }
}

export const GetGoogleUser = () => dispatch => {
    const expirationTime = new Date(new Date().getTime() + 1000 * 60 * 60)
    axios.get('/api/user')
        .then(res => dispatch({
            type: actionTypes.GET_GOOGLEUSER,
            payload: res.data
        },
            localStorage.setItem('Id', res.data._id),
            localStorage.setItem('token', res.data.token),
            localStorage.setItem('expirationTime', expirationTime)
        ))
        .catch(err => {
            console.log('error h google user ma')
        })
}

export const clearErrors = () => dispatch => {
    return setTimeout(() => {
        return {
            type: actionTypes.CLEAR_ERROR
        }
    },
        console.log('chalgya'),
        1000)
}

export const deleteUser = password => dispatch => {
    const config = {
        headers: {
            'x-auth-token': localStorage.getItem('token'),
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({ password: password })
    axios.post(`/api/auth/delete/${localStorage.getItem('Id')}`, body, config)
        .then(response => dispatch({
            type: actionTypes.DELETE_USER,
            payload: response.data
        }, console.log(response.data)))
        .catch(err => dispatch({
            type: actionTypes.MY_ERRORS,
            payload: err.response.data
        }))
}

export const updateUser = updateData => dispatch => {
    const config = {
        headers: {
            'x-auth-token': localStorage.getItem('token'),
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({ updateData })
    axios.post(`api/auth/update/${localStorage.getItem('Id')}`, body, config)
        .then(res => dispatch({
            type: actionTypes.UPDATE_USER,
            payload: res.data
        }, console.log(res.data)))
        .catch(err => dispatch({
            type: actionTypes.MY_ERRORS,
            payload: err.response.data
        }))
}


export const register = ({ email, password, data }) => dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    dispatch(loginStart())
    const expirationTime = new Date(new Date().getTime() + 1000 * 60 * 60)
    const body = JSON.stringify({ email, password, data })
    axios.post('/api/users', body, config)
        .then(res => dispatch({
            type: actionTypes.REGISTER,
            payload: res.data
        },
            localStorage.setItem('Id', res.data.user._id),
            localStorage.setItem('expirationTime', expirationTime)))
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, actionTypes.REGISTER_FAIL));
        })
}

export const login = ({ email, password }) => dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    dispatch(loginStart())
    const expirationTime = new Date(new Date().getTime() + 1000 * 60 * 60)
    const body = JSON.stringify({ email, password })
    axios.post('/api/auth', body, config)
        .then(res => dispatch({
            type: actionTypes.LOGIN,
            payload: res.data
        },
            localStorage.setItem('Id', res.data.user._id)),
            localStorage.setItem('expirationTime', expirationTime))
        .catch(err => dispatch({
            type: actionTypes.MY_ERRORS,
            payload: err.response.data
        })
        )
}

//mern se
export const loadUser = () => (dispatch, getState) => {
    //user loading
    axios.get('/api/auth/user', tokenConfig(getState))
        .then(res => dispatch({
            type: actionTypes.USER_LOADED,
            payload: res.data
        }))
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: actionTypes.AUTH_ERROR
            })
        })
}

export const logout = () => dispatch => {
    dispatch({ type: actionTypes.LOGOUT })
}

export const tokenConfig = getState => {
    const token = getState().auth.token;
    // header
    const config = {
        headers: {
            "Content-type": 'application/json'
        }
    }
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config
}

// export const getImage = () => dispatch => {
//     const config = {
//         headers: {
//             'x-auth-token': localStorage.getItem('token')
//         },
//         responseType: 'blob'
//     }
//     axios.get(`/api/users/${localStorage.getItem('Id')}/avatar`, config)
//         .then(response => dispatch({
//             type: actionTypes.GET_IMAGE,
//             payload: response.data,
//         })
//         )
//         .catch(err => {
//             console.log('err in image')
//         })
// }