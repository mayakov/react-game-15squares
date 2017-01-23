import React, { Component } from 'react';
import logo from './logo.svg';
import Game from './Game';
import './App.css';

var ReactToastr = require("react-toastr");
var {ToastContainer} = ReactToastr; // This is a React Element.
// For Non ES6...
// var ToastContainer = ReactToastr.ToastContainer;
var ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);

class App extends Component {
      
    addAlert = this.addAlert.bind(this);
    clearAlert = this.clearAlert.bind(this);

    addAlert(message, opts, type) {
        type = type || "success";
        var toast = this.refs.toast;
        toast[type] && toast[type](`${message}`, ``, opts);
    }

    clearAlert() {
        this.refs.toast.clear();
    }
  
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Welcome to React</h2>
                </div>
                <div className="App-intro">
                    <Game showMessage={this.addAlert} hideMessage={this.clearAlert}/>
                </div>
                <ToastContainer
                  toastMessageFactory={ToastMessageFactory}
                  ref="toast"
                  className="toast-top-center toast-margin-top"
                />
            </div>
        );
    }
}

export default App;
