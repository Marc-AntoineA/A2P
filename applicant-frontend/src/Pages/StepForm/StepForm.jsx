'using strict';

import React, { Component } from 'react';

import Header from '../../Components/Header/Header.jsx';
import Question from '../../Components/Question/Question.jsx';
import { Carousel } from 'react-bootstrap';

class StepForm extends Component {
  render() {
    return (
      <div>
        <Header/>
        <h2>Step form (carousel below)</h2>
        <Carousel>
          <Question></Question>
          <Question></Question>
          <Question></Question>
          <Question></Question>
          <Question></Question>
          <Question></Question>
          <Question></Question>
          <Question></Question>
          <Question></Question>
        </Carousel>
      </div>
    );
  }
}

export default StepForm;
