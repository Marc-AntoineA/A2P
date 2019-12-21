'using strict';

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import Header from '../../Components/Header/Header.jsx';
import QuestionPage from '../../Components/QuestionPage/QuestionPage.jsx';
import ApiRequests from '../../Providers/ApiRequests.js';
import './styles.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faEye, faExclamationTriangle, faEdit, faCheck, faSpinner, faSquare, faTimes, faEnvelope, faAngleRight, faThumbsUp, faFrown } from '@fortawesome/free-solid-svg-icons';

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
          <h4>Please select a slot for your interview</h4>
          <p>
            You have to be available
          </p>

          <div className='calendar-box'>
            <div className='day-box'>
              <div className='day-label'>
                <span className='day-number'>19</span>
                <span className='day-month'>December</span>
              </div>
              <div className='slots-label'>
                <div className='slot'>
                  <span className='slot-label'>From: </span>
                  <span className='slot-time'>2:00 p.m. </span>
                  <span className='slot-label'>To: </span>
                  <span className='slot-time'>2:20 p.m. </span>
                </div>
                <div className='slot'>
                  <span className='slot-label'>From: </span>
                  <span className='slot-time'>2:20 p.m. </span>
                  <span className='slot-label'>To: </span>
                  <span className='slot-time'>2:40 p.m. </span>
                </div>
                <div className='slot'>
                  <span className='slot-label'>From: </span>
                  <span className='slot-time'>2:40 p.m. </span>
                  <span className='slot-label'>To: </span>
                  <span className='slot-time'>3:00 p.m. </span>
                </div>
                <div className='slot'>
                  <span className='slot-label'>From: </span>
                  <span className='slot-time'>3:20 p.m. </span>
                  <span className='slot-label'>To: </span>
                  <span className='slot-time'>3:40 p.m. </span>
                </div>
                <div className='slot'>
                  <span className='slot-label'>From: </span>
                  <span className='slot-time'>3:40 p.m. </span>
                  <span className='slot-label'>To: </span>
                  <span className='slot-time'>4:0 p.m.< /span>
                </div>
              </div>
            </div>


          </div>
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
