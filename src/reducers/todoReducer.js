import * as actionTypes from '../actions/actionTypes'

const initialState = {
    todos: [],
    loading: false,
    todo_description: '',
    todo_responsible: '',
    todo_priority: '',
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.TODOS_LOADING:
            return {
                ...state,
                loading: true
            }
        case actionTypes.ADD_TODO:
            return {
                ...state,
                todos: [action.payload, ...state.todos]
            }
        case actionTypes.GET_TODOS:
            return {
                ...state,
                todos: action.payload,
                loading: false
            }
        case actionTypes.GET_MYTODOS:
            return {
                ...state,
                todos: action.payload.filter(todo => todo.owner === localStorage.getItem('Id')),
                loading: false
            }
        case actionTypes.DELETE_TODO:
            return {
                ...state,
                todos: state.todos.filter(todo => todo._id !== action.payload),
            }
        case actionTypes.EDIT_TODO:
            return {
                ...state,
                loading: false,
                todo_description: action.payload.todo_description,
                todo_responsible: action.payload.todo_responsible,
                todo_priority: action.payload.todo_priority
            }
        default:
            return state
    }
}
export default reducer