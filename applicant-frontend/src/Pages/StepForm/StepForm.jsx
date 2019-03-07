'using strict';

import React, { Component } from 'react';

import Header from '../../Components/Header/Header.jsx';
import QuestionPage from '../../Components/QuestionPage/QuestionPage.jsx';
import './styles.css';

import { Button, ProgressBar, Modal } from 'react-bootstrap';
import ApiRequests from '../../Providers/ApiRequests.js';

// TODO do this for tests only
const EXAMPLE_DATA = require('../../dataExamples/step1.json');

class StepForm extends Component {
  constructor(props) {
    super(props);

    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.handleChangeValue = this.handleChangeValue.bind(this);
    this.getFormData = this.getFormData.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      'submissionRunning': false,
      'currentPage': 1,
      'step': [],
      'displayErrorModal': false,
      'errorMessage': ''
    };
  }

  getFormData() {
    console.log(this.props);
    if (this.props.user.username === "" || this.props.user.token === "") {
      ApiRequests.getSigninForm()
        .then((step) => {
          this.setState((prevState) => {
            prevState.step = step;
            return prevState;
          });
        }).catch((err) => {
          this.props.handleError(err);
        });
      } else {
        this.setState((prevState) => {
          prevState.step = EXAMPLE_DATA;
          return prevState;
        });
      }
  }

  componentWillMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentDidMount() {
    this.getFormData();
  }

  componentWillUnMount() {
      document.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown(e) {
    if (e.key === 'ArrowRight')
      this.nextPage();
    if (e.key === 'ArrowLeft')
      this.previousPage();
  }

  nextPage() {
    if (this.state.currentPage >= this.state.step.length) return;
    this.setState((prevState) => {
      prevState.currentPage++;
      return prevState;
    });
  }

  previousPage() {
    if (this.state.currentPage === 1) return;
    this.setState((prevState) => {
      prevState.currentPage--;
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

  // TODO
  checkRequiredQuestions() {
    return true;
  }
  // TODO
  submitForm() {
    if (this.checkRequiredQuestions()) {
      // TODO
    } else {
      // TODO
    }
    // TODO handle if no users
    ApiRequests.postSigninForm(this.state.step).then(() => {
      console.log('Great!');
    }).catch((err) => {
      console.log(err);
      this.setState((prevState) => {
        prevState.errorMessage = err;
        prevState.displayErrorModal = true;
        return prevState;
      });
    })
    console.log(this.state.step);
  }

  handleClose() {
    this.setState((prevState) => {
      prevState.displayErrorModal = false;
      return prevState;
    });
  }

  render() {
    const pages = [];
    this.state.step.forEach((page, index) => {
      pages.push(
        <QuestionPage
          key={ page.id }
          pageIndex={ index }
          data={ page }
          hidden={ index + 1 !== this.state.currentPage }
          onChange={this.handleChangeValue}>
        </QuestionPage>);
    });

    const modal = (
      <Modal show={this.state.displayErrorModal} >
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{ this.state.errorMessage }</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={this.handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>);

    return (
      <div>
        <Header/>
        <ProgressBar animated
          now={ this.state.currentPage }
          max= { pages.length }
          label={`${this.state.currentPage}/${pages.length}`}>
        </ProgressBar>
        <main>
          { modal }
          { pages }
          {this.state.currentPage !== 1 ?
            <Button className='float-left' onClick={ this.previousPage }>Previous</Button> : ''}
          {this.state.currentPage !== pages.length ?
            <Button className='float-right' onClick={ this.nextPage }>Next</Button> : ''}
          {this.state.currentPage === pages.length ?
            <Button
              onClick={ this.submitForm }
              size='lg'
              variant='success'>
              Submit
            </Button>
            : ''
          }
        </main>
      </div>
    );
  }
}

export default StepForm;
