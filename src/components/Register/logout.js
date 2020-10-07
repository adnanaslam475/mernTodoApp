import React from 'react';
import { Redirect } from 'react-router-dom'

const Logout = props => {
    return (
        <div>
            < Redirect to='/' />
        </div>
    )
}
export default Logout