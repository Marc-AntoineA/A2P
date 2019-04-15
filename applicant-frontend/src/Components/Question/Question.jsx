'using strict';

import React, { Component } from 'react';
import Input from '../../Components/Input/Input.jsx';
import { checkPassword, checkPhone, checkMailAddress } from '../../validators';

import './styles.css';

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
    console.log('failed ????');
    if (!this.props.mandatoryFailed) return false;
    const data = this.props.data;
    if (data.mandatory && (data.answer === '' || data.answer === -1)) {
      this.failedMessage = 'Required Question';
      return true;
    }
    switch (data.type) {
      case 'password':
        if (checkPassword(data.answer)) break;
        this.failedMessage = 'Please provide a valid password. (it should contains at least one'
            + 'uppercase, lowercase, one number and one special character (!, @, #, $, %, ^, &, *, |, -,_))';
        return true;
        break;
      case 'phone':
        if (checkPhone(data.answer)) break;
        this.failedMessage = 'Please provide a valid phone number (like +77123123123)';
        return true;
        break;
      case 'mail':
        if (checkMailAddress(data.answer)) break;
        this.failedMessage = 'Please provide a valid maid address';
        return true;
        break;
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
