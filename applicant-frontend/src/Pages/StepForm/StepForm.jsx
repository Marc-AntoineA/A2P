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

class StepForm extends Component {
  constructor(props) {
    super(props);

    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);

    this.openSubmitModal = this.openSubmitModal.bind(this);
    this.closeSubmitModal = this.closeSubmitModal.bind(this);

    this.submitForm = this.submitForm.bind(this);
    this.saveForm = this.saveForm.bind(this);
    this.sendForm = this.sendForm.bind(this);

    this.handleChangeValue = this.handleChangeValue.bind(this);
    this.getFormData = this.getFormData.bind(this);
    this.checkCurrentRequiredAndFormatQuestions = this.checkCurrentRequiredAndFormatQuestions.bind(this);

    this.isNotAuthorized = this.isNotAuthorized.bind(this);

    this.state = {
      'submissionRunning': false,
      'currentPage': 1,
      'step': [],
      'mandatoryFailed': false, // to display in red mandatory questions failed
      'xDown': null,
      'yDown': null,
      'canBeEdited': true,
      'submitModalOpened': false,
      'redirectPath': null
    };
  }

  getFormData() {
    if (this.isNotAuthorized()) return;
    if (this.props.index === undefined) {
      ApiRequests.getSigninForm().then((step) => {
          this.setState((prevState) => {
            prevState.step = step;
            return prevState;
          });
        }).catch((err) => {
          this.props.handleModal(err.toString());
        });
      } else {
        ApiRequests.getStepForm(this.props.user, this.props.index).then((step) => {
          this.setState((prevState) => {
            prevState.step = step.pages;
            prevState.canBeEdited = step.status === 'rejected' || step.status === 'todo';
            return prevState;
          });
        }).catch((error) => {
          this.props.handleModal(error.message ? error.message : error.toString());
        });
      }
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
    this.getFormData();
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("touchstart", this.handleTouchStart);
    document.addEventListener("touchmove", this.handleTouchMove);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("touchstart", this.handleTouchStart);
    document.removeEventListener("touchmove", this.handleTouchMove);
  }

  handleTouchStart(e) {
    const firstTouch = e.touches[0];
    this.setState((prevState) => {
      prevState.xDown = firstTouch.clientX;
      prevState.yDown = firstTouch.clientY;
      return prevState;
    });
  }

  handleTouchMove(e) {
    const xDown = this.state.xDown;
    const yDown = this.state.yDown;
    if(!xDown || !yDown) return;

    const xUp = e.touches[0].clientX;
    const yUp = e.touches[0].clientY;

    const xDiff = xDown - xUp;
    const yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff) && Math.abs(xDiff) > 5) {/*most significant*/
        if ( xDiff > 0 ) {
            this.nextPage();
        } else {
            this.previousPage();
        }
    } else {
    }
    this.setState((prevState) => {
      prevState.xDown = null;
      prevState.yDown = null;
      return prevState;
    });
  }

  handleKeyDown(e) {
    if (e.key === 'ArrowRight')
      this.nextPage();
    if (e.key === 'ArrowLeft')
      this.previousPage();
  }

  nextPage() {
    if (this.state.currentPage >= this.state.step.length) return;
    if (!this.checkCurrentRequiredAndFormatQuestions()) {
      this.props.handleModal(TEXTS.ERROR_REQUIRED_QUESTIONS);
      return;
    }
    this.setState((prevState) => {
      prevState.mandatoryFailed = false;
      prevState.currentPage++;
      return prevState;
    });
  }

  previousPage() {
    if (this.state.currentPage === 1) return;
    this.setState((prevState) => {
      prevState.currentPage--;
      prevState.mandatoryFailed = false;
      return prevState;
    });
  }

  handleChangeValue(pageIndex, questionIndex, value) {
    this.setState((prevState) => {
      if (prevState.step.length < pageIndex) return prevState;
      if (prevState.step[pageIndex].questions.length < questionIndex) return prevState;
      prevState.step[pageIndex].questions[questionIndex].answer = value;
      return prevState;
    });
  }

  checkCurrentRequiredAndFormatQuestions() {
    const currentPage = this.state.step[this.state.currentPage - 1];
    const questions = currentPage.questions;
    for (let questionIndex = 0; questionIndex < questions.length; questionIndex++) {
      const question = questions[questionIndex];
      if (question.mandatory && (question.answer === '' || question.answer === -1 || question.answer === null)) {
        this.setState((prevState) => {
          prevState.mandatoryFailed = true;
          return prevState;
        });
        return false;
      }
      switch (question.type) {
        case 'password':
          if (checkPassword(question.answer)) break;
          this.setState((prevState) => {
            prevState.mandatoryFailed = true;
            return prevState;
          });
          return false;
        case 'phone':
          if (checkPhone(question.answer)) break;
          this.setState((prevState) => {
            prevState.mandatoryFailed = true;
            return prevState;
          });
          return false;
        case 'email':
          if (checkMailAddress(question.answer)) break;
          this.setState((prevState) => {
            prevState.mandatoryFailed = true;
            return prevState;
          });
          return false;
        default:
          break;
      }
    }
    return true;
  }

  sendForm(confirm) {
    const promise = this.props.index === undefined ?
      ApiRequests.postSigninForm(this.state.step)
      :
      ApiRequests.putStepForm(this.props.user, this.props.index, this.state.step, confirm);

    promise.then((response) => {
      if (this.props.index === undefined) {
        this.props.handleLogin({'id': response.id, 'token': response.token})
        .then(() => {
          this.setState((prevState) => {
            prevState.redirectPath = '/summary';
            return prevState;
          });
        });
      } else {
        this.setState((prevState) => {
          prevState.redirectPath = '/summary';
          return prevState;
        });
      }

      let successMessage = '';
      if (this.props.index === undefined)
        successMessage = TEXTS.SUCCESS_MESSAGES.APPLICATION;
      else if (confirm)
        successMessage = TEXTS.SUCCESS_MESSAGES.SUBMITTING_FORM;
      else
        successMessage = TEXTS.SUCCESS_MESSAGES.SAVING_FORM;
      this.props.handleModal(successMessage, 'Success');
    })
    .catch((error) => {
      this.props.handleModal(error.message ? error.message : error.toString());
    }).catch((error) => {
      this.props.handleModal(error.toString());
    });
  }

  saveForm() {
    const confirm = false;
    this.sendForm(confirm);
  }

  submitForm() {
    if (!this.checkCurrentRequiredAndFormatQuestions()) return;
    const confirm = true;
    this.sendForm(confirm);
  }

  closeSubmitModal() {
    this.setState((prevState) => {
      prevState.submitModalOpened = false;
      return prevState;
    });
  }

  openSubmitModal() {
    this.setState((prevState) => {
      prevState.submitModalOpened = true;
      return prevState;
    });
  }

  render() {
    const submitModal = (<Modal show={ this.state.submitModalOpened } onHide={ this.closeSubmitModal }>
      <Modal.Header closeButton>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>{ TEXTS.SUBMIT_FORM_VALIDATION }</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={ this.closeSubmitModal }>
          Close
        </Button>
        <Button variant='primary' onClick={ this.submitForm }>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>);

    const pages = this.state.step.map((page, index) => {
      return(
        <QuestionPage
          key={ page._id }
          pageIndex={ index }
          data={ page }
          hidden={ index + 1 !== this.state.currentPage }
          mandatoryFailed={ this.state.mandatoryFailed }
          onChange={this.handleChangeValue}
          disabled={!this.state.canBeEdited}>
        </QuestionPage>);
    });

    const mainComponent = (
      <div>
        { submitModal }
        <Header user={ this.props.user }/>
        <ProgressBar animated
          now={ this.state.currentPage }
          max= { pages.length }
          label={`${this.state.currentPage}/${pages.length}`}>
        </ProgressBar>
        <Container>
          { pages }
          <div className='buttons-flexbar'>
            {this.state.currentPage !== 1 ?
              <Button onClick={ this.previousPage } size='lg' className='fixed-width'> { TEXTS.BUTTONS.PREVIOUS_PAGE }</Button> : ''}
            {
                this.state.canBeEdited && this.props.index !== undefined ?
                  <Button
                    onClick={ this.saveForm }
                    size='lg'
                    variant='success'
                    className='fixed-width'>
                    { TEXTS.BUTTONS.SAVE }
                  </Button>
                  :
                  ''
              }
              {
                this.state.currentPage === pages.length && this.state.canBeEdited ?
                <Button
                  onClick={ this.openSubmitModal }
                  size='lg'
                  variant='success'
                  className='fixed-width'>
                  { TEXTS.BUTTONS.SUBMIT }
                </Button>
                :
                ''
            }
            {this.state.currentPage !== pages.length ?
              <Button onClick={ this.nextPage } size='lg' className='fixed-width'>{ TEXTS.BUTTONS.NEXT_PAGE }</Button> : ''}
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

export default StepForm;
