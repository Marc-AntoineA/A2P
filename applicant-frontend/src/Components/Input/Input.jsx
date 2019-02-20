'using strict';

import React, { Component } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobileAlt, faCalendarAlt, faPen } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Form } from 'react-bootstrap';

class Input extends Component {

  constructor(props) {
    super(props);
    this.handleChangeTextInput = this.handleChangeTextInput.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeRadio = this.handleChangeRadio.bind(this);

    this.initState(this.props.type);
  }

  initState(type) {
    switch (type) {
      case 'date':
        this.state = {'currentValue': new Date()};
        break;
      case 'radio':
        this.state = {'currentValue': -1};
        break;
      default:
        this.state = {'currentValue': ''};
    }
  }

  handleChangeTextInput(e) {
    const target = e.target;
    const value = target.value;

    this.setState(prevState => {
      prevState.currentValue = value;
      return prevState;
    });
  }

  handleChangeDate(date) {
    this.setState((prevState) => {
      prevState.currentValue = date;
      return prevState;
    })
  }

  handleChangeRadio(e) {
    const target = e.target;
    const value = target.dataset.index;
    console.log(value);
    this.setState((prevState) => {
      prevState.currentValue = value;
      return prevState;
    });
  }

  renderText() {
    return (<textarea onChange={this.handleChangeTextInput}></textarea>);
  }

  renderInline() {
    return (
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class='input-group-text'>
              <FontAwesomeIcon icon={faPen} />
            </span>
          </div>
          <input type="text"
           class="form-control"
           onChange={this.handleChangeTextInput}
           value={this.state.currentValue}/>
        </div>);
  }

  renderDate() {
    return (
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class='input-group-text'>
            <FontAwesomeIcon icon={faCalendarAlt} />
          </span>
        </div>
        <DatePicker
          selected={this.state.currentValue}
          onChange={this.handleChangeDate}/>
      </div>);
  }

  renderEmail() {
    return (
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text">@</span>
        </div>
        <input type="text"
          class="form-control"
          placeholder="mail address"
          onChange={this.handleChangeTextInput}
          value={this.state.currentValue}/>
      </div>);
  }

  renderPhone() {
    return (
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class='input-group-text'>
            <FontAwesomeIcon icon={faMobileAlt} />
          </span>
        </div>
        <input type="text"
          class="form-control"
          placeholder="phone number"
          onChange={this.handleChangeTextInput}
          value={this.state.currentValue}/>
      </div>);
  }

  renderRadio() {
    const choices = [];
    this.props.data.choices.forEach((choice, index) => {
      choices.push(
        <div className='custom-control custom-checkbox'>
          <Form.Check
            type='radio'
            label={choice}
            id={this.props.id + '-' + index}
            data-index={index}
            name={this.props.id}
            onChange={this.handleChangeRadio}
          />
        </div>);
    });
    return (<div>{ choices }</div>);
  }

  render() {
    switch (this.props.type) {
      case 'text':
        return this.renderText();
      case 'inline':
        return this.renderInline();
      case 'date':
        return this.renderDate();
      case 'email':
        return this.renderEmail();
      case 'phone':
        return this.renderPhone();
      case 'radio':
        return this.renderRadio();
      default:
        throw new Error(`undefined input type ${this.props.type}`);
    }
  }
}

export default Input;
