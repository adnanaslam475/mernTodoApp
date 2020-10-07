import React from 'react';
import './todo.module.css'
import { Link } from 'react-router-dom'

const todo = props => {
    return (
        <tr>
            <td>{props.todo_description}</td>
            <td>{props.todo_responsible} </td>
            <td>{props.todo_priority}</td>
            {props.token ? <td> <Link to={"/edit/" + props._id}>Edit</Link></td> : null}
            {props.token ? <td onClick={props.clicked}><Link to='/'>Delete</Link></td> : null}
        </tr>
    );
}
export default todo