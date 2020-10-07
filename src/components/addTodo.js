import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addTodo } from '../actions/itemActions'

class AddTodo extends Component {
    state = {
        todo_description: '',
        todo_responsible: '',
        todo_priority: '',
        loading: false
    }

    onSubmitHandler = e => {
        e.preventDefault()
        const newTodo = {
            todo_description: this.state.todo_description,
            todo_responsible: this.state.todo_responsible,
            todo_priority: this.state.todo_priority,
        }
        this.props.onAddtodo(newTodo)
        if (!this.props.token) {
            this.props.history.push('/login')
        }
        else { this.props.history.push('/') }
    }

    onCancelHandler = () => {
        this.props.history.push('/')
    }

    render() {
        return (
            <div>
                <form onSubmit={this.onSubmitHandler}>
                    <div className="form-group">
                        <label>Description: </label>
                        <input type="text"
                            className="form-control"
                            required
                            autoFocus
                            value={this.state.todo_description}
                            onChange={e => this.setState({ todo_description: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Responsible: </label>
                        <input
                            type="text"
                            required
                            className="form-control"
                            value={this.state.todo_responsible}
                            onChange={e => this.setState({ todo_responsible: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <div className="form-check form-check-inline">
                            <input className="form-check-input"
                                type="radio"
                                value="Low"
                                required
                                checked={this.state.todo_priority === 'Low'}
                                onChange={e => this.setState({ todo_priority: e.target.value })}
                            />
                            <label className="form-check-label">Low</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input"
                                type="radio"
                                value="Medium"
                                required
                                checked={this.state.todo_priority === 'Medium'}
                                onChange={e => this.setState({ todo_priority: e.target.value })}
                            />
                            <label className="form-check-label">Medium</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input"
                                type="radio"
                                value="High"
                                required
                                checked={this.state.todo_priority === 'High'}
                                onChange={e => this.setState({ todo_priority: e.target.value })}
                            />
                            <label className="form-check-label">High</label>
                        </div>
                    </div>
                    <input type="submit" value="Create Todo" onClick={this.creatingHandler} className="btn btn-primary" />{' '}
                    <input type="submit" value="Cancel" onClick={this.onCancelHandler} className="btn btn-light" />
                </form>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    token: state.auth.token
})
const mapDispatchToProps = dispatch => {
    return {
        onAddtodo: newTodo => dispatch(addTodo(newTodo))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AddTodo)