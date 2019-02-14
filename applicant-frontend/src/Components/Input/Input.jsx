'using strict';

import React, { Component } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobileAlt } from '@fortawesome/free-solid-svg-icons';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class Input extends Component {
  render() {
    const props = this.props;

    let input = (<div>MISTAKE</div>);

    switch (props.type) {
      case 'text':
        return <textarea></textarea>
      case 'inline':
      return (
        <div class="input-group mb-3">
          <input type="text" class="form-control" placeholder="mail address"/>
        </div>);
      case 'date': // TODO
      return (
        <div class="input-group mb-3">
          <DatePicker className='form-control'/>
        </div>);
      case 'email': // TODO
        return (
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">@</span>
            </div>
            <input type="text" class="form-control" placeholder="mail address"/>
          </div>);
      case 'phone': // TODO
      return (
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class='input-group-text'>
              <FontAwesomeIcon icon={faMobileAlt} />
            </span>
          </div>
          <input type="text" class="form-control" placeholder="phone number"/>
        </div>);
      case 'radio':
        const choices = [];
        this.props.data.choices.forEach((choice) => {
          choices.push(
            <div className='custom-control custom-checkbox'>
              <input type='checkbox' className='custom-control-input'/>
              <label className='custom-control-label'>{ choice }</label>
            </div>);
        });
        return (<div>{ choices }</div>);
    }
    console.log(input);
    return (<div> mistake </div>);
  }
}

export default Input;
