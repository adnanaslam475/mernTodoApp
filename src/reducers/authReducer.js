import * as actionTypes from '../actions/actionTypes'

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    user: null,
    status: null,
    errors: {}
}
const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOGIN_START:
            return {
                ...state
            }
        case actionTypes.LOGIN:
        case actionTypes.REGISTER:
            localStorage.setItem('token', action.payload.token)
            return {
                ...state,
                ...action.payload,
                user: action.payload,
                errors: {},
                isAuthenticated: true
            }
        case actionTypes.MY_ERRORS:
            return {
                ...state,
                errors: action.payload
            }
        case actionTypes.UPDATE_USER:
            return {
                ...state
            }
        case actionTypes.CLEAR_ERROR:
            return {
                ...state,
                errors: null
            }
        case actionTypes.GET_GOOGLEUSER:
            return {
                ...state,
                ...action.payload,
                user: action.payload,
                isAuthenticated: true
            }
        case actionTypes.DELETE_USER:
            localStorage.clear()
            return {
                ...state,
                status: action.payload,
                errors: {},
                user: null
            }
        case actionTypes.USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload
            }
        case actionTypes.AUTH_ERROR:
        case actionTypes.LOGIN_FAIL:
        case actionTypes.LOGOUT:
        case actionTypes.REGISTER_FAIL:
            localStorage.clear()
            return {
                ...state,
                user: null,
                isAuthenticated: false
            }
        default:
            return state
    }
}
export default authReducer