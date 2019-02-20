'using strict';

import React, { Component } from 'react';

import Header from '../../Components/Header/Header.jsx';
import QuestionPage from '../../Components/QuestionPage/QuestionPage.jsx';
import './styles.css';

import { Button, ProgressBar } from 'react-bootstrap';

// TODO do this for tests only
const data = require('../../dataExamples/step1.json');

class StepForm extends Component {
  constructor(props) {
    super(props);
    this.state = { currentPage: 1 };
    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentWillMount(){
      document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnMount(){
      document.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown(e) {
    if (e.key === 'ArrowRight')
      this.nextPage();
    if (e.key === 'ArrowLeft')
      this.previousPage();
  }

  nextPage() {
    if (this.state.currentPage === data.length) return;
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

  render() {
    const pages = [];
    data.forEach((page, index) => {
      pages.push(<QuestionPage key={ page.id } data={ page }
        hidden={ index + 1 !== this.state.currentPage }></QuestionPage>);
    });

    // TODO don't displayed previous / next if no pages are available
    return (
      <div>
        <Header/>
        <ProgressBar animated
          now={ this.state.currentPage }
          max= { pages.length }
          label={`${this.state.currentPage}/${pages.length}`}>
        </ProgressBar>
        <main>
          { pages }
          <Button className='float-left' onClick={ this.previousPage }>Previous</Button>
          <Button className='float-right' onClick={ this.nextPage }>Next</Button>
        </main>
      </div>
    );
  }
}

export default StepForm;
