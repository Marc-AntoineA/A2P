'using strict';

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import Header from '../../Components/Header/Header.jsx';
import QuestionPage from '../../Components/QuestionPage/QuestionPage.jsx';
import ApiRequests from '../../Providers/ApiRequests.js';
import './styles.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faEye, faExclamationTriangle, faEdit, faCheck, faSpinner, faSquare, faTimes, faEnvelope, faAngleRight, faThumbsUp, faFrown } from '@fortawesome/free-solid-svg-icons';

import { Button, ProgressBar, Modal, Container, ButtonToolbar } from 'react-bootstrap';
import { checkPassword, checkPhone, checkMailAddress } from '../../validators';

import Handlebars from 'handlebars';

const TEXTS = require('../../static.json');

class Interview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'redirectPath': null,
      'slotsByDate': {},
      'interviewSlot': undefined
    };

    this.selectSlot = this.selectSlot.bind(this);
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
    this.getSelectedSlot();
  }

  componentWillUnmount() {
  }

  selectSlot(e) {
    const target = e.currentTarget;
    const begin = target.dataset.begin;
    ApiRequests.selectSlot(this.props.user, begin)
    .then(() => {
      this.props.handleModal('Your interview will be on Dec');
      this.setState((prevState) => {
        prevState.redirectPath = '/summary';
        return prevState;
      });
    }).catch((error) => {
      this.props.handleError(error.message ? error.message : error.toString());
    });
    e.stopPropagation();
  }

  getSelectedSlot() {
    if (!this.props.user.token || !this.props.user.id) return;
    ApiRequests.getSelectedSlot(this.props.user).then((slot) => {
      this.setState((prevState) => {
        prevState.interviewSlot = slot;
      });
    })
  }

  getAvailableSlots() {
    if (!this.props.user.token || !this.props.user.id) return;

    ApiRequests.listAvailableSlots(this.props.user).then((slots) => {
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
    const dayBoxes = orderedDays.map((date, dayIndex) => {
      const slots = this.state.slotsByDate[date];
      const slotBoxes = slots.map((slot, slotIndex) => {
        const slotBegin = new Date(slot.begin);
        const slotEnd = new Date(slot.end);

        return (
          <div key={ dayIndex + '-' + slotIndex} className='slot' onClick={ this.selectSlot } data-begin={ slot.begin }>
          <span className='slot-label'>From: </span>
          <span className='slot-time'>{ slot.begin.slice(11, 16) }</span>
          <span className='slot-label'>To: </span>
          <span className='slot-time'>{ slot.end.slice(11, 16) }</span>
          </div>
        );
      });

      const d = new Date(date);
      const month = d.toLocaleString('en-GB', { month: 'long' });
      const number = d.getDate();

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

    const beginTemplate = Handlebars.compile(TEXTS.ITW_VIEW.SLOT_SELECTED);
    const date = new Date(this.state.interviewSlot ? this.state.interviewSlot.begin : undefined);

    const mainComponent = (
      <div>
        { submitModal }
        <Header user={ this.props.user }/>
        <Container>

          <h2>{ TEXTS.ITW_VIEW.TITLE }</h2>

          <p>{ TEXTS.ITW_VIEW.WELCOME_MESSAGE }</p>

          <p>{ !this.state.interviewSlot && TEXTS.ITW_VIEW.SLOT_SELECTION }</p>

          { this.state.interviewSlot && beginTemplate({
            begin: date.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                  + ' at ' + date.toLocaleTimeString('en-GB')})
          }

          <div className='calendar-box'>
            { !this.state.interviewSlot && dayBoxes.length === 0 && TEXTS.ITW_VIEW.NO_MORE_INTERESTED }
            { !this.state.interviewSlot && dayBoxes.length !== 0 && dayBoxes }
          </div>

        <ButtonToolbar className='center'>
          <Button variant="secondary" size="lg" href={'mailto:' + TEXTS.FOOTER.EMAIL}>
            <FontAwesomeIcon className='status-icon' icon={faEnvelope} />
            { TEXTS.ITW_VIEW.CONTACT_US }
          </Button>
        </ButtonToolbar>

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
