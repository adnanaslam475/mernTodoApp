import React, { Component } from 'react';
import classes from './login.module.css'
import { connect } from 'react-redux';
import { TextField, Button } from '@material-ui/core';
import { login } from '../../actions/authActions';
class Login extends Component {
    state = {
        email: '',
        password: ''
    }
    onSubmitHandler = e => {
        e.preventDefault();
        const { email, password } = this.state;
        const newUser = { email, password }
        this.props.onLoginUser(newUser)
    }
    render() {
        return (
            <div>
                <div className={classes.Login}>
                <p>{this.props.errors.msg}</p>
                    <form onSubmit={this.onSubmitHandler}>
                        <TextField id="standard-basic" className={classes.InputElement}
                            type="email" label="Email"  autoFocus
                            onChange={e => this.setState({ email: e.target.value })} />
                        <TextField id="standard-basic" className={classes.InputElement}
                            type="password" label='password'
                            onChange={e => this.setState({ password: e.target.value })} /><br />
                        <Button type='submit'
                            variant='contained'>Login</Button>
                    </form>
                    <a href='/auth/google'>sihninwith gogole</a>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    errors: state.auth.errors
})

const mapDispatchToProps = dispatch => {
    return {
        onLoginUser: (email, password) => dispatch(login(email, password))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)