import React, { Component } from 'react';
import axios from 'axios'
import Spinner from '../spinner/Spinner'
import { FormControl } from 'react-bootstrap'
import { editTodo } from '../../actions/itemActions'
import { connect } from 'react-redux';

class EditTodo extends Component {
    state = {
        todo_description: '',
        todo_responsible: '',
        todo_priority: '',
    }

    componentDidMount() {
        axios.get('/api/todos/' + this.props.match.params.id)
            .then(response => {
                this.setState({
                    todo_description: response.data.todo_description,
                    todo_responsible: response.data.todo_responsible,
                    todo_priority: response.data.todo_priority,
                })
            })
            .catch(error => {
                console.log(error);
            })
    }

    onChangeTodoCompleted = e => {
        this.setState({
            todo_completed: !this.state.todo_completed
        });
    }

    onSubmitHandler = e => {
        e.preventDefault();
        const obj = {
            todo_description: this.state.todo_description,
            todo_responsible: this.state.todo_responsible,
            todo_priority: this.state.todo_priority,
        };
        axios.post('/api/todos/update/' + this.props.match.params.id, obj)
            .then(res => 'ccc');
        this.props.history.push('/')
    }
    onCancelHandler = () => {
        this.props.history.push('/')
    }
    render() {
        let editForm = (<div>
            <h3 align="center">Update Todo</h3>
            <form onSubmit={this.onSubmitHandler}>
                <div className="form-group">
                    <label>Description: </label>
                    <FormControl type="text"
                        value={this.state.todo_description}
                        onChange={e => this.setState({ todo_description: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>Responsible: </label>
                    <FormControl type="text"
                        value={this.state.todo_responsible}
                        onChange={e => this.setState({ todo_responsible: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <div className="form-check form-check-inline">
                        <input className="form-check-input"
                            type="radio"
                            name="priorityOptions"
                            id="priorityLow"
                            value="Low"
                            checked={this.state.todo_priority === 'Low'}
                            onChange={e => this.setState({ todo_priority: e.target.value })}
                        />
                        <label className="form-check-label">Low</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input"
                            type="radio"
                            name="priorityOptions"
                            id="priorityMedium"
                            value="Medium"
                            checked={this.state.todo_priority === 'Medium'}
                            onChange={e => this.setState({ todo_priority: e.target.value })}
                        />
                        <label className="form-check-label">Medium</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input"
                            type="radio"
                            name="priorityOptions"
                            id="priorityHigh"
                            value="High"
                            checked={this.state.todo_priority === 'High'}
                            onChange={e => this.setState({ todo_priority: e.target.value })}
                        />
                        <label className="form-check-label">High</label>
                    </div>
                </div><br />
                <input type="submit" value="Update Todo" className="btn btn-primary" />{' '}
            </form><span>
                <input type="submit" value="cancel" onClick={this.onCancelHandler} className="btn btn-light" /></span>
        </div>)

        if (!this.state.todo_priority) {
            editForm = <Spinner />
        }
        return (
            <div>
                {editForm}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    todo: state.todo,
    loading: state.todo.loading
})
const mapDispatchToProps = dispatch => {
    return {
        onEditTodo: id => (dispatch(editTodo(id)))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(EditTodo)