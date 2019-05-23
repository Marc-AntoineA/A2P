'using strict';

import React, { Component } from 'react';
import Input from '../../Components/Input/Input.jsx';
import { checkPassword, checkPhone, checkMailAddress } from '../../validators';

import './styles.css';
const TEXTS = require('../../static.json');

class Question extends Component {

  constructor(props) {
      super(props);
      this.failedMessage = '';
      this.handleChangeValue = this.handleChangeValue.bind(this);
  }

  handleChangeValue(value) {
    this.props.onChange(this.props.questionIndex, value);
  }

  failed() {
    if (!this.props.mandatoryFailed) return false;
    const data = this.props.data;
    if (data.mandatory && (data.answer === '' || data.answer === -1)) {
      this.failedMessage = 'Required Question';
      return true;
    }
    switch (data.type) {
      case 'password':
        if (checkPassword(data.answer)) break;
        this.failedMessage = TEXTS.ERROR_VALID_PASSWORD;
        return true;
      case 'phone':
        if (checkPhone(data.answer)) break;
        this.failedMessage = TEXTS.ERROR_VALID_PHONE;
        return true;
      case 'email':
        if (checkMailAddress(data.answer)) break;
        this.failedMessage = TEXTS.ERROR_VALID_EMAIL;
        return true;
      default:
        break;
    }
    return false;
  }

  render() {
    const data = this.props.data;
    const failed = this.failed();
    return (
      <div className={ failed ? 'question-box question-box-failed' : 'question-box'}>
        <label className='question-label' htmlFor={ data.id }>{ data.label }{data.mandatory ? '*' : ''}</label>
        { failed ? <div className='error-message'> { this.failedMessage } </div> : ''}
        <Input
          id={ data. id}
          type={ data.type }
          data={ data }
          onChange={ this.handleChangeValue }
          disabled={ this.props.disabled }>
        </Input>
      </div>
    );
  }
}

export default Question;
