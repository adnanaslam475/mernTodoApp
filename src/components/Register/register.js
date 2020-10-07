import React, { Component } from 'react';
import classes from './register.module.css'
import { connect } from 'react-redux';
import { TextField, Button } from '@material-ui/core';
import { register } from '../../actions/authActions';

class Register extends Component {
    state = {
        email: '',
        password: '',
        msg: null
    }
    componentDidUpdate(prevProps) {
        const { error } = this.props
        if (error !== prevProps.error) {
            if (error.id === 'REGISTER_FAIL') {
                this.setState({ msg: error.msg.msg });
            }
        }
    }

    onSubmitHandler = e => {
        e.preventDefault();
        const { email, password } = this.state
        const newUser = { email, password }
        this.props.onRegisterUser(newUser)
    }

    render() {
        return (
            <div className={classes.Login}>
                {this.state.msg ?
                    <p>{this.state.msg}</p>
                    : null}
                <form onSubmit={this.onSubmitHandler}>
                    <TextField id="standard-basic" className={classes.InputElement}
                        type="email" label="Email" required autoFocus
                        onChange={e => this.setState({ email: e.target.value })} />
                    <TextField id="standard-basic" className={classes.InputElement}
                        type="password" label="password" required
                        onChange={e => this.setState({ password: e.target.value })} />
                    <Button type='submit' variant="contained">Register</Button>
                </form>
            </div>
        );
    }
}


const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error
})

const mapDispatchToProps = dispatch => {
    return {
        onRegisterUser: (email, password, data) => dispatch(register(email, password, data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register)