import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom'
import { connect } from 'react-redux';
import { logout } from '../../actions/authActions'
import axios from 'axios';
import { Navbar, Dropdown, NavItem, Image } from 'react-bootstrap';

class NavBar extends Component {
    state = {
        image: null
    }
    componentDidMount() {
        if (this.props.token) {
            const config = {
                headers: {
                    "x-auth-token": localStorage.getItem('token')
                },
                responseType: 'blob'
            }
            axios.get(`/api/users/${localStorage.getItem('Id')}/avatar`, config)
                .then(response => {
                    if(response.data){
                    this.setState({ image: URL.createObjectURL(response.data) })}
                })
                .catch(err => {
                    console.log('err')
                })
        }
    }
    render() {
        let authFrom = (
            <Navbar bg="light" variant="light">
                <Navbar.Brand href='/'>MERN Todo App</Navbar.Brand>
                <NavItem>
                    <NavLink to='/create'>Create Todo</NavLink>

                </NavItem>
                <NavItem className="ml-auto" style={{ paddingRight: '0.7%' }}>
                    <Link to='/register'>Register</Link>
                </NavItem>
                <NavItem style={{ paddingRight: '5%' }}>
                    <Link to='/login'>login</Link>
                </NavItem>
            </Navbar>
        )
        if (this.props.token) {
            authFrom = (
                <Navbar bg="light" variant="light">
                    <Navbar.Brand href='/'>MERN Todo App</Navbar.Brand>
                    <NavItem>
                        <Link to='/create'>Create Todo</Link>
                    </NavItem>
                    <Image src={this.state.image} id='img' width='50px' className='ml-auto' />
                    <span>
                        <Dropdown className="ml-auto">
                            <Dropdown.Toggle variant='' id="dropdown-basic">
                            </Dropdown.Toggle>
                            <Dropdown.Menu alignRight>
                                <Dropdown.Item href='/AccountSettings'>AccountSettings</Dropdown.Item>
                                <Dropdown.Item onClick={this.props.onlogout} href='/' >logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </span>
                </Navbar>)
        }
        return (
            <div>
                {authFrom}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    token: state.auth.token
})

const mapDispatchToProps = dispatch => {
    return {
        onlogout: () => dispatch(logout())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)