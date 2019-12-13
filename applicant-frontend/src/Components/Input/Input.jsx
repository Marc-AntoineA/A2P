'using strict';

import React, { Component } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobileAlt, faCalendarAlt, faPen, faUnlockAlt } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReactDOM from 'react-dom';
import { Form } from 'react-bootstrap';

import './styles.css';

class Input extends Component {

  constructor(props) {
    super(props);

    this.handleChangeTextInput = this.handleChangeTextInput.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeRadio = this.handleChangeRadio.bind(this);

    this.initState(this.props.type);
  }

  handleKeyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.stopPropagation();
    }
  }

  componentDidMount() {
    ReactDOM.findDOMNode(this).addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    ReactDOM.findDOMNode(this).addEventListener("keydown", this.handleKeyDown);
  }

  initState(type) {
    if (this.props.data && this.props.data.answer !== undefined) {
      if (type !== 'text')
        this.state = { 'currentValue': this.props.data.answer };
      else
        this.state = { 'currentValue': this.props.data.answer, 'nbWords': this.props.data.answer.split(' ').length };
      return;
    }

    switch (type) {
      case 'date':
        this.state = {'currentValue': null};
        break;
      case 'radio':
        this.state = {'currentValue': -1};
        break;
      case 'text':
        this.state = { 'currentValue': '', 'nbWords': 0 };
        break;
      default:
        this.state = {'currentValue': ''};
    }
    this.props.onChange(this.state.currentValue);
  }

  handleChangeTextInput(e) {
    if (this.props.disabled) return;
    const target = e.target;
    const value = target.value;
    this.setState(prevState => {
      prevState.currentValue = value;
      prevState.nbWords = value.split(' ').length
      return prevState;
    });
    this.props.onChange(value);
  }

  handleChangeDate(date) {
    if (this.props.disabled) return;
    this.setState((prevState) => {
      prevState.currentValue = date;
      return prevState;
    });
    this.props.onChange(date);
  }

  handleChangeRadio(e) {
    if (this.props.disabled) return;
    const target = e.target;
    const value = target.dataset.index;
    this.setState((prevState) => {
      prevState.currentValue = value;
      return prevState;
    });
    this.props.onChange(value);
  }

  getAnswer() {
    return this.props.data.answer === undefined ? '' :    this.props.data.answer;
  }

  renderText() {
    return (
      <div>
      <Form.Control as="textarea" rows="3"
        onChange={this.handleChangeTextInput}
        value={this.state.currentValue}
        disabled={this.props.disabled}/>
        <div className='words-counter'> { this.state.nbWords } words</div>
      </div>
    );
  }

  renderInline() {
    return (
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className='input-group-text'>
              <FontAwesomeIcon icon={faPen} />
            </span>
          </div>
          <input type="text"
           className="form-control"
           placeholder={this.props.placeholder}
           onChange={this.handleChangeTextInput}
           value={this.state.currentValue}/>
        </div>);
  }

  renderDate() {
    return (
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className='input-group-text'>
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
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text">@</span>
        </div>
        <input type="text"
          className="form-control"
          placeholder={this.props.placeholder ? this.props.placeholder : 'Email address'}
          onChange={this.handleChangeTextInput}
          value={this.state.currentValue}/>
      </div>);
  }

  renderPhone() {
    return (
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className='input-group-text'>
            <FontAwesomeIcon icon={faMobileAlt} />
          </span>
        </div>
        <input type="text"
          className="form-control"
          placeholder="+11123123123"
          onChange={this.handleChangeTextInput}
          value={this.state.currentValue}/>
      </div>);
  }

  renderPassword() {
    return (
      <div className="input-group mb-3">
        <div className="input-group-prepend">
        <span className='input-group-text'>
          <FontAwesomeIcon icon={faUnlockAlt} />
        </span>
        </div>
        <input type="password"
          className="form-control"
          placeholder={this.props.placeholder ? this.props.placeholder : 'Password'}
          onChange={this.handleChangeTextInput}
          value={this.state.currentValue}/>
      </div>);
  }

  renderRadio() {
    const choices = [];
    this.props.data.choices.forEach((choice, index) => {
      choices.push(
        <div className='custom-control custom-checkbox' key={ index }>
          <Form.Check
            type='radio'
            label={ choice }
            id={ this.props.id + '-' + index }
            data-index={ index }
            name={ this.props.id }
            checked={ this.state.currentValue == index}
            onChange={ this.handleChangeRadio }
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
      case 'password':
        return this.renderPassword();
      default:
        throw new Error(`undefined input type ${this.props.type}`);
    }
  }
}

export default Input;
