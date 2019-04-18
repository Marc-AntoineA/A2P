'using strict';

import React, { Component } from 'react';

import Question from '../../Components/Question/Question.jsx';
import './styles.css';

class QuestionPage extends Component {

  constructor(props) {
    super(props);
    this.handleChangeValue = this.handleChangeValue.bind(this);
  }

  handleChangeValue(questionIndex, value) {
    this.props.onChange(this.props.pageIndex, questionIndex, value);
  }

  render() {
    const data = this.props.data;
    const questions = [];
    data.questions.forEach((question, index) => {
      questions.push(
        <Question
          key={ question.id }
          data={ question }
          questionIndex={ index }
          onChange={ this.handleChangeValue }
          mandatoryFailed={ this.props.mandatoryFailed }
          disabled={ this.props.disabled }>
        </Question>);
    });

    return (
      <div className={this.props.hidden ? 'hidden' : ''}>
        <h2>{ data.label }</h2>
        <p>{ data.caption }</p>
        { questions }
      </div>
    );
  }
}

export default QuestionPage;
