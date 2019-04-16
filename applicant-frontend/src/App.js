import React, { Component } from 'react';
import './App.css';

import Welcome from './Pages/Welcome/Welcome.jsx';
import Login from './Pages/Login/Login.jsx';
import Summary from './Pages/Summary/Summary.jsx';
import StepForm from './Pages/StepForm/StepForm.jsx';
import history from './history';
import ApiRequests from './Providers/ApiRequests';

import { Router, Route, Link } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';

class App extends Component {

  constructor(props) {
      super(props);
      this.state = {
        user: ApiRequests.getLogin(),
        errorModal: {
          display: false,
          message: ''
        }
      };
      this.signin = this.signin.bind(this);
      this.summary = this.summary.bind(this);
      this.stepForm = this.stepForm.bind(this)
      this.login = this.login.bind(this);
      this.welcome = this.welcome.bind(this);

      this.handleCloseErrorModal = this.handleCloseErrorModal.bind(this);
      this.handleError = this.handleError.bind(this);
      this.handleLogin = this.handleLogin.bind(this);
  }

  // bug : use componentDidUpdate?
  componentDidMount(){
    // ???
  }

  welcome() {
    return (<Welcome handleError={ this.handleError }/>);
  }

  login() {
    return (<Login user={ this.state.user } handleError={ this.handleError } handleLogin={ this.handleLogin }></Login>);
  }

  signin() {
    return (<StepForm user={ this.state.user } handleError={ this.handleError }></StepForm>);
  }

  stepForm(params) {
    const index = params.match.params.index;
    return (<StepForm user={ this.state.user } handleError={ this.handleError } index={ index }></StepForm>);
  }

  summary() {
    return (<Summary user={ this.state.user } handleError={ this.handleError }></Summary>);
  }

  handleCloseErrorModal() {
    this.setState((prevState) => {
      prevState.errorModal.display = false;
      return prevState;
    });
  }

  handleError(errorMessage) {
    this.setState((prevState) => {
      prevState.errorModal = {
        display: true,
        message: errorMessage
      };
      console.log(prevState);
      return prevState;
    });
  }

  handleLogin(user) {
    ApiRequests.saveLogin(user.id, user.token);
    this.setState((prevState) => {
      prevState.user = user;
      history.push('/summary')
      return prevState;
    });
  }

  render() {
    const modal = (
      <Modal show={ this.state.errorModal.display } onHide={ this.handleCloseErrorModal }>
        <Modal.Header className="text-black" closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-black">{ this.state.errorModal.message }</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={ this.handleCloseErrorModal }>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );

    const router = (
      <Router history={ history }>
        <div className="App">
          <Route exact path='/' component={ this.welcome }/>
          <Route exact path='/login' component={ this.login }/>
          <Route exact path='/summary' component={ this.summary }/>
          <Route exact path='/signin' component={ this.signin }/>
          <Route exact path='/step/:index' component={ this.stepForm }/>
        </div>
      </Router>
    );

    return (<div>
        { modal }
        { router }
      </div>
    );
  }
}

export default App;
