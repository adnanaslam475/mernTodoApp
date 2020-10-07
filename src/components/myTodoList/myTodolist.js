import React, { Component } from 'react';
import { itemsLoading, deleteTodo, getMyTodos } from '../../actions/itemActions';
import { connect } from 'react-redux'
import Spinner from '../spinner/Spinner'
import './mytodoList.module.css'
import Todo from '../todo/todo'


class MyTodoList extends Component {
    state = {
        searchValue: ''
    }
    componentDidMount() {
        this.props.onGetMyTodos()
    }

    render() {
        const { todos } = this.props.todo
        const { token } = this.props
        const filteredItems = todos.filter(item => item.todo_responsible.toLowerCase().match(this.state.searchedValue) ||
            item.todo_responsible.toUpperCase().match(this.state.searchedValue))
        let todoItems = (<div>
            {todos.length === 0 ? <h3>You have not any todo yet</h3> :
                <div>
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
                                <th>Edit</th>
                                <th>Delete</th>
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
                </div>
            }
        </div>)
        if (this.props.loading) {
            todoItems = <Spinner />
        }
        return (
            <div className="container">
                {todoItems}
            </div>
        );
    }
}


const mapStateToProps = state => ({
    todo: state.todo,
    loading: state.todo.loading,
    token: state.auth.token,
    // avatar: state.user.avatar
})

const mapDispatchToProps = dispatch => {
    return {
        onTodoLoading: () => dispatch(itemsLoading()),
        onDeleteClick: id => dispatch(deleteTodo(id)),
        onGetMyTodos: todos => dispatch(getMyTodos(todos))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyTodoList)