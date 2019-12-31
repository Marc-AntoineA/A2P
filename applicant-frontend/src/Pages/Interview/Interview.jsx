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
      'redirectPath': null,
      'slotsByDate': {}
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
    const user = this.props.user;
    this.getAvailableSlots();
  }

  componentWillUnmount() {
  }

  getAvailableSlots() {
    if (!this.props.user.token || !this.props.user.id) return;

    const user = this.props.user;
    ApiRequests.listAvailableSlots(user).then((slots) => {
      const slotsByDate = {};
      for (let k=0; k<slots.length; k++) {
        const slot = slots[k];
        const begin = new Date(slot.begin);
        const date = begin.getFullYear() + '-' + (begin.getMonth() + 1) + '-' + begin.getDate();
        if (!slotsByDate[date]) slotsByDate[date] = [];
        slotsByDate[date].push(slot);
        slotsByDate[date].sort();
      }

      this.setState((prevState) => {
        prevState.slotsByDate = slotsByDate;
        return prevState;
      });

      console.log('available slots');
      console.log(slotsByDate);
    }).catch((error) => {
      this.props.handleError(error.message ? error.message : error.toString());
    });

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

    const orderedDays = Object.keys(this.state.slotsByDate).sort();
    const dayBoxes = orderedDays.map((date) => {
      const slots = this.state.slotsByDate[date];
      const slotBoxes = slots.map((slot) => {
        const slotBegin = new Date(slot.begin);
        const slotEnd = new Date(slot.end);

        return (
          <div className='slot'>
          <span className='slot-label'>From: </span>
          <span className='slot-time'>{ slot.begin.slice(11, 16) }</span>
          <span className='slot-label'>To: </span>
          <span className='slot-time'>{ slot.end.slice(11, 16) }</span>
          </div>
        );
      });

      const d = new Date(date);
      const month = d.toLocaleString('default', { month: 'long' });
      const number = date.slice(8, 10);

      return (
        <div className='day-box'>
          <div className='day-label'>
            <span className='day-number'>{ number }</span>
            <span className='day-month'>{ month }</span>
          </div>
          <div className='slots-label'>
            { slotBoxes }
          </div>
        </div>
      );
    });
    // const dayBoxes = ty

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
            { dayBoxes }

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
