import React, { PureComponent } from 'react';
import { connect } from 'react-redux'
import { deleteUser, logout, updateUser } from '../../actions/authActions';
import axios from 'axios'
import classes from './AccountSettings.module.css'
import Modal from '../deleteAccount/Modal'
import { Container, Row, Col, FormControl, Form, Button } from 'react-bootstrap'

class AccountSettings extends PureComponent {
    state = {
        email: '',
        avatar: null,
        oldPassword: '',
        newPassword: '',
        modalToggle: false,
        imagediv: false,
        emaildiv: false,
        passworddiv: false
    }

    onChangeHandler = e => {
        this.setState({ avatar: e.target.files[0] })
        const preview = document.getElementById('img')
        const file = document.querySelector('input[type=file]').files[0];
        const reader = new FileReader()
        reader.addEventListener('load', () => {
            preview.src = reader.result
        }, false)
        if (file) {
            reader.readAsDataURL(file)
        }
    }
    onSubmitPic = e => {
        e.preventDefault()
        const data = new FormData()
        data.append('image', this.state.avatar)
        const config = {
            headers: {
                "x-auth-token": localStorage.getItem('token')
            }
        }
        axios.post('/api/users/avatar', data, config)
            .then(response => {
                console.log(response.data)
            })
            .catch(e => {
                console.log(e.response.error)
            })
    }

    updateSubmitHandler = e => {
        e.preventDefault()
        const updatedData = {
            email: this.state.email,
            oldPassword: this.state.oldPassword,
            newPassword: this.state.newPassword,
            confirmPassword: this.state.confirmPassword
        }
        const config = {
            headers: {
                'x-auth-token': localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        }
        if (this.state.newPassword === this.state.confirmPassword) {
            console.log('password dont match')
            const body = JSON.stringify(updatedData)
            axios.post(`api/auth/update/${localStorage.getItem('Id')}`, body, config)
                .then(res => {
                    console.log(res.data)
                })
                .catch(err => {
                    console.log(err.response.data)
                })
        }
    }

    modalHandler = e => {
        e.preventDefault()
        this.setState({
            modalToggle: !this.state.modalToggle
        })
    }
    deleteSubmithandler = e => {
        e.preventDefault()
        this.props.onDeleteUser(this.state.password)
    }
    render() {
        let redirect = null
        if (this.props.status) {
            setTimeout(() => {
                redirect = window.location.href = '/'
            }, 1000)
        }
        return (
            <Container>
                {redirect}
                <Row>
                    <Col xs={4}>
                        <p className={classes.p} onClick={() => this.setState({ imagediv: true, emaildiv: false, passworddiv: false })} >change profile image</p>
                        <p className={classes.p} onClick={() => this.setState({ imagediv: false, emaildiv: true, passworddiv: false })}>change email</p>
                        <p className={classes.p} onClick={() => this.setState({ imagediv: false, emaildiv: false, passworddiv: true, email: '' })}>change password</p><br />
                        <Button variant='danger' onClick={() => this.setState({ modalToggle: true })}>Delete account</Button>
                    </Col>
                    <Col xs={6}>
                        {this.state.imagediv ? <Form onSubmit={this.onSubmitPic}>
                            <h6>upload profile picture</h6>
                            <input type='file' onChange={this.onChangeHandler} />
                            <Button type='submit'>save</Button>
                        </Form> : null}
                        {this.state.passworddiv ? <Form id='passForm' onSubmit={this.updateSubmitHandler}>
                            <FormControl placeholder='Type old password...' type='password' required
                                onChange={e => this.setState({ oldPassword: e.target.value })} />
                            <FormControl
                                onChange={e => this.setState({ newPassword: e.target.value })}
                                type='password' required placeholder='Type new password...' /><br />
                            <FormControl
                                onChange={e => this.setState({ confirmPassword: e.target.value })}
                                type='password' placeholder='confirm password...' />
                            <Button type='submit'>Update password</Button>
                        </Form> : null}
                        {this.state.emaildiv ? <Form id='emailForm' onSubmit={this.updateSubmitHandler}>
                            <FormControl
                                onChange={e => this.setState({ email: e.target.value })}
                                type='email' required placeholder='Type new Email...' /><br />
                            <Button type='submit'>Update Email</Button>
                        </Form> : null}
                    </Col>
                </Row>
                <Modal show={this.state.modalToggle}
                    modalClosed={this.modalHandler}>
                    <h4>Enter password to delete your Account</h4>
                    <Form id='deleteForm' onSubmit={this.deleteSubmithandler}>
                        <FormControl placeholder='password' type='password' required
                            onChange={e => this.setState({ password: e.target.value })} />
                        <p>{this.props.errors.msg}</p>
                        <Button onClick={this.modalHandler} className="btn btn-light" >cancel</Button>
                        <Button variant='danger' type='submit'>confirm</Button>
                    </Form>
                </Modal>
            </Container>
        )
    }
}

const mapStateToProps = state => ({
    user: state.auth.user,
    errors: state.auth.errors,
    status: state.auth.status
})

const mapDispatchToProps = dispatch => {
    return {
        onlogout: () => dispatch(logout()),
        onUpdateUser: updatedData => dispatch(updateUser(updatedData)),
        onDeleteUser: password => dispatch(deleteUser(password))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AccountSettings)