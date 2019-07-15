'using strict';

import React, { Component } from 'react';
import './styles.css';
import computer from './computer.png';

import ApiRequests from '../../Providers/ApiRequests';
import Header from '../../Components/Header/Header.jsx';
import Footer from '../../Components/Footer/Footer.jsx';

import { Button, Container, Row, Col } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faDatabase } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

const TEXTS = require('../../static.json').WELCOME_VIEW;

library.add(fab);

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openedProcesses: []
    };
    this.getOpenedProcesses = this.getOpenedProcesses.bind(this);
  }

  getOpenedProcesses() {
    ApiRequests.getOpenedProcesses().then((processes) => {
      this.setState((prevState) => {
        prevState.openedProcesses = processes;
        return prevState;
      });
    }).catch((error) => {
      this.props.handleError(error.toString());
    });
  }

  componentDidMount() {
    this.getOpenedProcesses();
  }

  render() {
    const processesElements = this.state.openedProcesses.map((process) => {
      return (<div className='location'>
                <FontAwesomeIcon className='map-icon' icon={faMapMarkerAlt} />
                {process.location}
              </div>);
    });

    const canApply = this.state.openedProcesses.length !== 0;

    const mainComponent = (
      <div>
        <Header></Header>
        <Container>
          <Row>
            <Col>
              <h2 className='centered-title'>{ TEXTS.TITLE }</h2>
              <div dangerouslySetInnerHTML={{ __html: TEXTS.DESCRIPTION }}></div>
              <div dangerouslySetInnerHTML={{ __html: TEXTS.OFFICE_LOCATION }}></div>
              <div dangerouslySetInnerHTML={{ __html: TEXTS.ANY_QUESTION}}></div>

              <h2 className='centered-title'>{ TEXTS.OPENED_LOCATIONS_LABEL }</h2>
              { canApply ?
                <div id='current-locations'>
                  { processesElements }
                </div>
                :
                <p>{ TEXTS.NO_OPENED_LOCATIONS }</p>
              }
            </Col>
            <Col className='centered-col'>
            <div id='language-container'>
              <FontAwesomeIcon className='technology html' icon={['fab', 'html5']}/>
              <FontAwesomeIcon className='technology css' icon={['fab', 'css3-alt']}/>
              <FontAwesomeIcon className='technology javascript' icon={['fab', 'js-square']}/>
              <FontAwesomeIcon className='technology node' icon={['fab', 'node-js']}/>
              <FontAwesomeIcon className='technology react' icon={['fab', 'react']}/>
              <FontAwesomeIcon className='technology database' icon={faDatabase}/>
            </div>
            <div className='citation'>
              <div className='left-citation'>155 classrooms hours - 24 / 7 Online Support...</div>
              <div className='right-citation'>...to learn all these technologies in only 7 months.</div>
            </div>

            <p className='big'>Free For All Students</p>
              <img src={computer} alt='webdevelopment illustration' width='350px'/>

              <Button href='/signin' variant='success' block disabled={!canApply}>{ TEXTS.CREATE_ACCOUNT_BUTTON }</Button>
              <Button href='/login' variant='info' block>{ TEXTS.ALREADY_REGISTERED_BUTTON }</Button>
            </Col>
          </Row>
        </Container>
        <Footer version={this.props.version}/>
      </div>
    );

    return (
      <div>
        {
          this.props.user.token && this.props.user.id ?
          <Redirect to='/summary'/>
          :
          mainComponent
        }
      </div>
    );
  }
}

export default Welcome;
