import React, { Component } from 'react';
import './App.css';

import Welcome from './Pages/Welcome/Welcome.jsx';
import Login from './Pages/Login/Login.jsx';
import Summary from './Pages/Summary/Summary.jsx';
import StepForm from './Pages/StepForm/StepForm.jsx';
import PrivacyPolicy from './Pages/PrivacyPolicy/PrivacyPolicy.jsx';
import ForgotPassword from './Components/forgetpassword/forgetpassword'
import ResetPassword from './Components/resetpassword/resetpassword'
import ApiRequests from './Providers/ApiRequests';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';

const TEXTS = require('./static.json');

class App extends Component {

  constructor(props) {
      super(props);
      this.state = {
        user: ApiRequests.getLogin(),
        modal: {
          display: false,
          message: ''
        }
      };
      this.signin = this.signin.bind(this);
      this.summary = this.summary.bind(this);
      this.stepForm = this.stepForm.bind(this)
      this.login = this.login.bind(this);
      this.welcome = this.welcome.bind(this);
      this.privacyPolicy = this.privacyPolicy.bind(this);

      this.handleCloseModal = this.handleCloseModal.bind(this);
      this.handleModal = this.handleModal.bind(this);
      this.handleLogin = this.handleLogin.bind(this);
      this.forgetPassword = this.forgetPassword.bind(this);
  }

  // bug : use componentDidUpdate?
  componentDidMount(){
    // ??? // In the app component there is a handleError  function but I didn't find any where diefined inside this file.
  }
   
  welcome() {
    return (<Welcome version={this.props.version} user={ this.state.user } handleError={ this.handleModal }/>);
  }

  login() {
    return (<Login  version={this.props.version} user={ this.state.user } handleModal={ this.handleModal } handleLogin={ this.handleLogin }></Login>);
  }

  signin() {
    return (<StepForm  version={this.props.version} user={ this.state.user } handleLogin={ this.handleLogin } handleModal={ this.handleModal }></StepForm>);
  }

  stepForm(params) {
    const index = params.match.params.index;
    return (<StepForm  version={this.props.version} user={ this.state.user } handleModal={ this.handleModal } index={ index }></StepForm>);
  }

  summary() {
    return (<Summary  version={this.props.version} user={ this.state.user } handleError={ this.handleModal }></Summary>);
  }

  privacyPolicy() {
    return (<PrivacyPolicy  version={this.props.version} user={ this.state.user }/>);
  }
  forgetPassword() {
    return (<ForgotPassword  version={this.props.version} handleModal={ this.handleModal }/>);
  }

  handleCloseModal() {
    this.setState((prevState) => {
      prevState.modal.display = false;
      return prevState;
    });
  }

  handleModal(errorMessage, status) {
    if (status == null)
      status = 'Error';
    this.setState((prevState) => {
      prevState.modal = {
        display: true,
        message: errorMessage,
        status: status
      };
      return prevState;
    });
  }

  handleLogin(user) {
    return new Promise((resolve) => {
      if (user === undefined) {
        this.setState((prevState) => {
          prevState.user = undefined;
          return prevState;
        });
        if(ApiRequests.logout())
          this.handleModal(TEXTS.SUCCESS_MESSAGES.LOGGED_OUT, 'Success');
        resolve();
      } else {
        ApiRequests.saveLogin(user.id, user.token);
        this.setState((prevState) => {
          prevState.user = user;
          return prevState;
        });
        resolve();
      }
    });
  }

  render() {
    const modal = (
      <Modal show={ this.state.modal.display } onHide={ this.handleCloseModal }>
        <Modal.Header className="text-black" closeButton>
          <Modal.Title>{ this.state.modal.status }</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-black">{ this.state.modal.message }</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={ this.handleCloseModal }>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );

    const router = (
      <Router>
        <div className="App">
          <Route exact path='/' component={ this.welcome }/>
          <Route exact path='/login' component={ this.login }/>
          <Route exact path='/summary' component={ this.summary }/>
          <Route exact path='/signin' component={ this.signin }/>
          <Route exact path='/privacy-policy' component={ this.privacyPolicy }/>
          <Route exact path='/step/:index' component={ this.stepForm }/>
          <Route exact path='/forgot-password' component={ this.forgetPassword }/>
          <Route exact path='/reset-password' component={ ResetPassword }/>
        </div>
      </Router>
    );

    return (
       <div>
        { modal }
        { router }
      </div>
    );
  }
}

export default App;
