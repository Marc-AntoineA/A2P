'using strict';

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import Header from '../../Components/Header/Header.jsx';
import QuestionPage from '../../Components/QuestionPage/QuestionPage.jsx';
import ApiRequests from '../../Providers/ApiRequests.js';
import './styles.css';

import { Button, ProgressBar, Modal, Container } from 'react-bootstrap';
import { checkPassword, checkPhone, checkMailAddress } from '../../validators';

const TEXTS = require('../../static.json');

class Interview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'redirectPath': null
    };
  }

  isNotAuthorized() {
    return this.props.index !== undefined
      && (!this.props.user || !this.props.user.token || !this.props.user.id);
  }

  componentWillMount() {
    if (this.isNotAuthorized()) {
      this.setState((prevState) => {
        prevState.redirectPath = '/login';
        return prevState;
      });
      return;
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    const submitModal = (<Modal>
      <Modal.Header closeButton>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>{ TEXTS.SUBMIT_FORM_VALIDATION }</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary">
          Close
        </Button>
        <Button variant='primary'>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>);

    const mainComponent = (
      <div>
        { submitModal }
        <Header user={ this.props.user }/>
        <Container>
          <h4>xxx</h4>
        </Container>
      </div>
    );

    return (
      <div>{
        this.state.redirectPath ?
          <Redirect to={ this.state.redirectPath }/>
          :
          mainComponent
      }</div>
    );
  }
}

export default Interview;
