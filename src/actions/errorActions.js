import * as actionTypes from './actionTypes'

//clear error
// export const clearErrors = () => {
//     return {
//         type: actionTypes.CLEAR_ERRORS,
//     };
// };

export const returnErrors = (msg, status, id = null) => {
    return { //authaction se yhn a kr set ho rha h
        type: actionTypes.GET_ERRORS,
        payload: { msg, status, id }
    };
}