import React, { Component } from 'react'
// import Modal from '../components/Modal/modal'
// import Backdrop from '../components/Backdrop/Backdrop'

class ErrorHandler extends Component {
    state = { errorOccurred: false }
    
    componentDidCatch() {
        this.setState({ errorOccurred: true })
    }

    render() {
        return this.state.errorOccurred ?
            <h1>Something went wrong!</h1> : this.props.children
    }
}
export default ErrorHandler