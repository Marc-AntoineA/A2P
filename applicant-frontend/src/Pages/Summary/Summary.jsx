'using strict';

import React, { Component } from 'react';

import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { Accordion, AccordionItem, AccordionItemTitle, AccordionItemBody } from 'react-accessible-accordion';
import { withRouter } from 'react-router-dom';
import 'react-accessible-accordion/dist/fancy-example.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

import Header from '../../Components/Header/Header.jsx';
import history from '../../history';
import ApiRequests from '../../Providers/ApiRequests';
import './styles.css';

class Summary extends Component {

  constructor(props) {
    super(props);
    this.state = {
      process: {}
    };
    this.getProcessData = this.getProcessData.bind(this);
  }

  componentDidMount() {
    console.log(this.props.user);
    const user = this.props.user;
    if (user === undefined || user.token === undefined) {
      history.push('/');
      return;
    }
    this.getProcessData();
  }

  getProcessData() {
    const id = this.props.user.id;
    ApiRequests.getProcess(id).then((process) => {
      console.log(process);
      this.setState((prevState) => {
        prevState.process = process;
        return prevState;
      });
    }).catch((err) => {
      this.props.handleError(err);
    });
  }

  editStep(e) {
    const target = e.currentTarget;
    const index = target.dataset.index;
    history.push('/step/' + index);
    e.stopPropagation();
  }

  render() {
    const personalData = this.state.process;
    const steps = this.state.process.process === undefined ? []
      : this.state.process.process.steps.map((step, index) => {
        return (
          <AccordionItem key={ index }>
            <AccordionItemTitle>
              <h3>
               { step.label }
               <OverlayTrigger
                  placement='bottom'
                  overlay={
                    <Tooltip>
                      Step { step.status }
                    </Tooltip>
                  }>
                <span className= { "float-right status-color " + step.status }>&#11044;</span>
                </OverlayTrigger>
               <span className="float-right" data-index={ index } onClick={ this.editStep }>
                <FontAwesomeIcon icon={faEdit} />
               </span>
              </h3>
            </AccordionItemTitle>
            <AccordionItemBody>
              Contents
            </AccordionItemBody>
          </AccordionItem>
        );
    });

    return (
      <div>
        <Header/>
        <main>
          <h2>Your Process Advancement</h2>
          <div id='personal-data'>
            <h3> Your personal information</h3>
            <ul>
              <li>Your name: { personalData.name }</li>
              <li>Your mail address: { personalData.mailAddress }</li>
              <li>Your phone number: { personalData.phoneNumber }</li>
              <li>Your status: { personalData.status }</li>
            </ul>
          </div>
          <div id='process'>
            <Accordion>
              { steps }
            </Accordion>
          </div>
        </main>
      </div>
    );
  }
}

export default withRouter(Summary);
