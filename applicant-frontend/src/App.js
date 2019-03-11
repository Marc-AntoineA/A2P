import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Welcome from './Pages/Welcome/Welcome.jsx';
import Login from './Pages/Login/Login.jsx';
import Summary from './Pages/Summary/Summary.jsx';
import StepForm from './Pages/StepForm/StepForm.jsx';

import { Router, Route, Link } from 'react-router-dom';

import history from './history';

class App extends Component {

  constructor(props) {
      super(props);
      this.state = {user: {
        name: "",
        id: "",
        token: ""
      }};
      this.signin = this.signin.bind(this);
      this.summary = this.summary.bind(this);
      this.stepForm = this.stepForm.bind(this)
      this.login = this.login.bind(this);
  }

  // TODO ??
  handleError(err) {
  }

  login() {
    return (<Login user={ this.state.user }></Login>);
  }

  signin() {
    return (<StepForm user={ this.state.user } handleError={ this.handleError }></StepForm>);
  }

  stepForm() {
    return (<StepForm user={ this.state.user }></StepForm>);
  }

  summary() {
    console.log("Hého??");
    return (<Summary user={ this.state.user }></Summary>);
  }

  render() {
    return (
      <Router history={ history }>
        <div className="App">
          <Route exact path='/' component={ Welcome }/>
          <Route exact path='/login' component={ this.login }/>
          <Route exact path='/summary' component={ this.summary }/>
          <Route exact path='/signin' component={ this.signin }/>
          <Route exact path='/nextStep' component={ this.stepForm }/>
        </div>
      </Router>
    );
  }
}

export default App;
