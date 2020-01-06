'using strict';

import React, { Component } from 'react';
import './styles.css';
import computer from './computer.png';

import ApiRequests from '../../Providers/ApiRequests';
import Header from '../../Components/Header/Header.jsx';
import Footer from '../../Components/Footer/Footer.jsx';

import { Button, Container, Row, Col, ButtonToolbar } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faDatabase, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

const TEXTS = require('../../static.json').WELCOME_VIEW;
const FOOTER = require('../../static.json').FOOTER;


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

    const applyButtons = this.state.openedProcesses.map((process, index) => {
      return (
          <Button variant="danger" size="lg" key={index} className='apply-button' href='/apply'>
            <FontAwesomeIcon className='map-icon' icon={faMapMarkerAlt} />
            Apply in {process.location}
            </Button>
          );
    });

    const mainComponent = (
      <div>
        <Header></Header>
        <Container>
          <Row className='first-row'>
            <Col>
              <h2 className='red-title'>{ TEXTS.TITLE }</h2>
              <p className='subtitle' dangerouslySetInnerHTML={{ __html: TEXTS.BLACK_SUBTITLE }}></p>
              <p className='red subtitle'>{ TEXTS.RED_SUBTITLE }</p>
            </Col>
            <Col className='centered-col'>
              <img src={computer} alt='webdevelopment illustration' width='350px'/>
            </Col>
          </Row>
          <Row>
          <Col className='centered-col'>
          <h2>{TEXTS.OPENED_LOCATIONS_LABEL}</h2>
          { applyButtons.length > 0 ? <ButtonToolbar className='button-toolbar'>
            { applyButtons }
          </ButtonToolbar> :
            'All the applications are curently closed. '
          }
          <Link className='text-btn' to='/login'>{ TEXTS.SIGN_IN }</Link>
          </Col>
          </Row>
          <Row>
            <Col>
              <h2>Requirements</h2>
              <div dangerouslySetInnerHTML={{ __html: TEXTS.REQUIREMENTS }}></div>
              <div dangerouslySetInnerHTML={{ __html: TEXTS.OFFICE_LOCATION }}></div>
              <ButtonToolbar className='button-toolbar'>
                <Button variant="secondary" size="lg" href={'mailto:' + FOOTER.EMAIL}>
                  <FontAwesomeIcon className='status-icon' icon={faEnvelope} />
                  A question ? Contact us
                </Button>
              </ButtonToolbar>
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
