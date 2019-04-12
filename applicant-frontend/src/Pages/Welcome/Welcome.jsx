'using strict';

import React, { Component } from 'react';
import './styles.css';

import Header from '../../Components/Header/Header.jsx';

import { Button, Container, Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faDatabase } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

import { library } from '@fortawesome/fontawesome-svg-core'
library.add(fab);

class Welcome extends Component {

  render() {
    return (
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
              <h2 class='centered-title'>Opened Locations</h2>
              <div id='current-locations'>
                <div className='location'>
                  <FontAwesomeIcon className='map-icon' icon={faMapMarkerAlt} />
                  Athens
                  </div>
                <div className='location'>
                  <FontAwesomeIcon className='map-icon' icon={faMapMarkerAlt} />
                  London
                </div>
                <div className='location'>
                  <FontAwesomeIcon className='map-icon' icon={faMapMarkerAlt} />
                  Barcelona
                </div>
              </div>
            </Col>
            <Col className='centered-col'>
              <img src='https://socialhackersacademy.org/wp-content/uploads/2018/01/coding-isometric-01.png'
                width='350px'/>
              <Button href='/signin' variant='success' block>Apply Now</Button>
              <Button href='/login' variant='info' block>Already Registered</Button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Welcome;
