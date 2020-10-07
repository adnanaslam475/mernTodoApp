import React, { Component } from 'react';
import Todo from '../todo/todo'
import { getTodos, itemsLoading, deleteTodo, getMyTodos } from '../../actions/itemActions';
import { GetGoogleUser } from '../../actions/authActions';
import { connect } from 'react-redux'
import Spinner from '../spinner/Spinner'
import './todoList.module.css'

class TodoList extends Component {
    state = {
        searchValue: ''
    }
    componentDidMount() {
        this.props.onGetAllTodos();
    }


    render() {
        const { todos } = this.props.todo
        const { token } = this.props
        const filteredItems = todos.filter(item => item.todo_responsible.toLowerCase().match(this.state.searchedValue) ||
            item.todo_responsible.toUpperCase().match(this.state.searchedValue))
        let todoItems = (<div>
            {!token ? <h3>login to manage your todo item</h3> : null}
            <input className="form-control"
                type="text" autoFocus
                placeholder="search"
                onChange={e => this.setState({ searchedValue: e.target.value })}
                value={this.state.searchedValue || ''} />
            <table>
                <tbody>
                    <tr>
                        <th>Todo description</th>
                        <th>Todo responsible</th>
                        <th>Todo priority</th>
                        {token ? <th>Edit</th> : null}
                        {token ? <th>Delete</th> : null}
                    </tr>
                    {filteredItems.map(todo => (
                        <Todo key={todo._id}
                            _id={todo._id}
                            token={token}
                            todo_description={todo.todo_description}
                            todo_responsible={todo.todo_responsible}
                            todo_priority={todo.todo_priority}
                            clicked={() => this.props.onDeleteClick(todo._id)} />
                    ))}
                </tbody>
            </table>
        </div>)
        if (this.props.loading) {
            todoItems = <Spinner />
        }
        return (
            <div className="container">
                {todoItems}
            </div>
        )
    }
}


const mapStateToProps = state => ({
    todo: state.todo,
    loading: state.todo.loading,
    token: state.auth.token,
})

const mapDispatchToProps = dispatch => {
    return {
        onGetAllTodos: () => dispatch(getTodos()),
        onTodoLoading: () => dispatch(itemsLoading()),
        onDeleteClick: id => dispatch(deleteTodo(id)),
        onGetMyTodos: () => dispatch(getMyTodos()),
        onGetGoogleUser: () => dispatch(GetGoogleUser())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoList)