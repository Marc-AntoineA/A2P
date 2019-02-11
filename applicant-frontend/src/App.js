import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Welcome from './Pages/Welcome/Welcome.jsx';
import Login from './Pages/Login/Login.jsx';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Welcome/>
        </header>
        <Router>
          <div>
            <Route exact path='/' component={Welcome} />
            <Route exact path='/login' component={Login} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
