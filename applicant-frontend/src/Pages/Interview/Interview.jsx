'using strict';

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import Header from '../../Components/Header/Header.jsx';
import ApiRequests from '../../Providers/ApiRequests.js';
import './styles.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faFrown } from '@fortawesome/free-solid-svg-icons';

import { Button, Container, ButtonToolbar, Alert, Spinner, Modal } from 'react-bootstrap';

import Handlebars from 'handlebars';

const TEXTS = require('../../static.json');

class Interview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'redirectPath': null,
      'slotsByDate': {},
      'interviewSlot': undefined,
      'loadingSlots': true,
      'loadingCurrentSlot' : true,
      'submitModalOpened': false,
      'choosenSlotBegin': undefined
    };

    this.selectSlot = this.selectSlot.bind(this);
    this.openSlotModal = this.openSlotModal.bind(this);
    this.closeSubmitModal = this.closeSubmitModal.bind(this);
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
    this.getAvailableSlots();
    this.getSelectedSlot();
  }

  componentWillUnmount() {
  }

  openSlotModal(e) {
    console.log('open');
    const target = e.currentTarget;
    const begin = target.dataset.begin;

    this.setState((prevState) => {
      prevState.submitModalOpened = true;
      prevState.choosenSlotBegin = begin;
      return prevState;
    });
    console.log(this.state);
    e.stopPropagation();
  }

  selectSlot() {
    const begin = this.state.choosenSlotBegin;
    ApiRequests.selectSlot(this.props.user, begin)
    .then(() => {
      const beginDate = new Date(begin);
      this.props.handleModal('Your interview will be on ' + beginDate.toLocaleDateString('en-GB') + ' at ' + beginDate.toLocaleTimeString('en-GB'));
      this.setState((prevState) => {
        prevState.redirectPath = '/summary';
        return prevState;
      });
    }).catch((error) => {
      this.props.handleError(error.message ? error.message : error.toString());
    });
  }

  getSelectedSlot() {
    if (!this.props.user.token || !this.props.user.id) return;
    ApiRequests.getSelectedSlot(this.props.user).then((slot) => {
      this.setState((prevState) => {
        prevState.interviewSlot = slot;
        prevState.loadingCurrentSlot = false;
        return prevState;
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
        prevState.loadingSlots = false;
        return prevState;
      });
    }).catch((error) => {
      this.props.handleError(error.message ? error.message : error.toString());
    });
  }

  closeSubmitModal() {
    console.log('closons');
    this.setState((prevState) => {
      prevState.submitModalOpened = false;
      return prevState;
    });
  }

  render() {

    const begin = this.state.choosenSlotBegin ? new Date(this.state.choosenSlotBegin) : new Date();

    const submitModal = (<Modal show={ this.state.submitModalOpened } onHide={ this.closeSubmitModal }>
      <Modal.Header closeButton>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure to choose your interview on { begin.toLocaleDateString('en-GB') + ' at ' + begin.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) }? </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={ this.closeSubmitModal }>
          Close
        </Button>
        <Button variant='danger' onClick={ this.selectSlot }>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>);

    const orderedDays = Object.keys(this.state.slotsByDate).sort();
    const dayBoxes = orderedDays.map((date, dayIndex) => {
      const slots = this.state.slotsByDate[date];
      const slotBoxes = slots.map((slot, slotIndex) => {
        const begin = new Date(slot.begin);
        const end = new Date(slot.end);
        return (
          <div key={ dayIndex + '-' + slotIndex} className='slot' onClick={ this.openSlotModal } data-begin={ slot.begin }>
          <span className='slot-label'>From: </span>
          <span className='slot-time'>{ begin.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) }</span>
          <span className='slot-label'> To: </span>
          <span className='slot-time'>{ end.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) }</span>
          </div>
        );
      });

      const d = new Date(date);
      const month = d.toLocaleString('en-GB', { month: 'long' });
      const number = d.getDate();

      return (
        <div key={ dayIndex} className='day-box'>
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
        <Header user={ this.props.user }/>
        <Container>
          { submitModal }

          <h2>{ TEXTS.ITW_VIEW.TITLE }</h2>

          <p>{ TEXTS.ITW_VIEW.WELCOME_MESSAGE }</p>

          <p>{ !this.state.interviewSlot && TEXTS.ITW_VIEW.SLOT_SELECTION }</p>

          {
            this.state.interviewSlot && !this.state.loadingCurrentSlot && !this.state.loadingSlots ?
            <Alert variant='success'>
              { beginTemplate({
                begin: date.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                      + ' at ' + date.toLocaleTimeString('en-GB')})
              }
            </Alert>
            :
            ''
          }

          { !this.state.interviewSlot && !this.state.loadingCurrentSlot && !this.state.loadingSlots && dayBoxes.length === 0 ?
            <Alert variant='warning'>
              <FontAwesomeIcon className='status-icon' icon={faFrown} />{ TEXTS.ITW_VIEW.NO_AVAILABLE_SLOT }
            </Alert>
            :
            ''
          }

          { this.state.loadingCurrentSlot || this.state.loadingSlots ?
            <div className='center'><Spinner animation="border" variant="danger" /></div>
            :
            ''
          }

          <div className='calendar-box'>
            { !this.state.interviewSlot && !this.state.loadingCurrentSlot && !this.state.loadingSlots && dayBoxes.length !== 0 && dayBoxes }
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
