import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'
import EditTodo from './components/editTodo/editTodo'
import Navbar from './components/NavBar/NavBar'
import AddTodo from './components/addTodo'
import "bootstrap/dist/css/bootstrap.min.css";
import Logout from './components/Register/logout'
import Login from './components/login/login'
import Register from './components/Register/register'
import Todolist from './components/todolist/todoList';
import AccountSettings from './components/AccountSettings/AccountSettings'
import { connect } from 'react-redux';
import { loadUser, logout } from './actions/authActions'
import Mytodolist from './components/myTodoList/myTodolist'

class App extends Component {
  componentDidMount() {
    const expirationTime = new Date(localStorage.getItem('expirationTime'))
    if (expirationTime <= new Date()) {
      this.props.onlogout()
    }
    this.props.onLoadUser()
  }

  render() {
    let routes = (
      <Switch>
        <Route exact path='/' component={Login} />
        {/* <Route path='/' component={Todolist} /> */}
        <Route path='/register' component={Register} />
        <Route path='/create' component={AddTodo} />
        <Redirect to='/' />
      </Switch>
    )
    if (this.props.token) {
      routes = (
        <Switch>
          <Route exact path='/' component={Mytodolist} />
          <Route path='/edit/:id' component={EditTodo} />
          <Route path='/create' component={AddTodo} />
          <Route path='/logout' component={Logout} />
          <Route path='/AccountSettings' component={AccountSettings} />
          <Redirect to='/' />
        </Switch>
      )
    }
    return (
      <div>
        <Navbar />
        <br />
        <div className='container'>
          {routes}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  token: state.auth.token
})

const mapDispatchToProps = dispatch => {
  return {
    onLoadUser: () => dispatch(loadUser()),
    onlogout: () => dispatch(logout())
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(App)

// import Child from './Child'
// state = {
//    message: "parent message" 
//   }
// callbackFunction = (childData) => {
//   this.setState({ message: childData })
//   console.log(this.state.message)
//   console.log(childData)
// }
{/* <Child parentCallback={this.callbackFunction} /> */ }
