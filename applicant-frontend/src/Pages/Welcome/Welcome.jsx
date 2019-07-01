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
              <h2 className='centered-title'>Full Stack Web Development Course</h2>
              <p>
                Learn how to design and develop websites both Front and Back end
                with the latest technologies
              </p>

              <div className='citation'>
                <div className='left-citation'>155 classrooms hours - 24 / 7 Online Support...</div>
                <div className='right-citation'>...to learn all these technologies in only 6 months.</div>
              </div>

              <div id='language-container'>
                <FontAwesomeIcon className='technology html' icon={['fab', 'html5']}/>
                <FontAwesomeIcon className='technology css' icon={['fab', 'css3-alt']}/>
                <FontAwesomeIcon className='technology javascript' icon={['fab', 'js-square']}/>
                <FontAwesomeIcon className='technology node' icon={['fab', 'node-js']}/>
                <FontAwesomeIcon className='technology react' icon={['fab', 'react']}/>
                <FontAwesomeIcon className='technology database' icon={faDatabase}/>
              </div>

              <p className='big'>Free For All Students</p>
              <h2 className='centered-title'>Opened Locations</h2>
              { canApply ?
                <div id='current-locations'>
                  { processesElements }
                </div>
                :
                <p>No locations are currently opened. Please come back in few days</p>
              }

            </Col>
            <Col className='centered-col'>
              <img src={computer} alt='webdevelopment illustration'
                width='350px'/>
              <Button href='/signin' variant='success' block disabled={!canApply}>Apply Now</Button>
              <Button href='/login' variant='info' block disabled={!canApply}>Already Registered</Button>
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
