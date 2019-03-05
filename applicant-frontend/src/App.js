import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Welcome from './Pages/Welcome/Welcome.jsx';
import Login from './Pages/Login/Login.jsx';
import Summary from './Pages/Summary/Summary.jsx';
import StepForm from './Pages/StepForm/StepForm.jsx';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

class App extends Component {

  constructor(props) {
      super(props);
      this.state = {user: {
        username: "",
        token: ""
      }};
      this.signin = this.signin.bind(this);
  }

  // TODO
  handleError(err) {
  }

  signin() {
    return (<StepForm user={ this.state.user } handleError={ this.handleError }></StepForm>);
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path='/' component={ Welcome }/>
          <Route exact path='/login' component={ Login }/>
          <Route exact path='/summary' component={ Summary }/>
          <Route exact path='/signin' component={ this.signin }/>
          <Route exact path='/nextStep' component={ StepForm }/>
        </div>
      </Router>
    );
  }
}

export default App;
