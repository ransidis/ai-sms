import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <Row>
          <Col className='d-flex flex-column text-center m-2'>
            <div style={{ display: 'flex', alignItems: 'center', fontFamily: 'Arial, sans-serif' }}>
              <div style={{ marginRight: '10px' }}>
                <svg height="50" width="50" viewBox="0 0 24 24" fill="#c4c4c4">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M12 14c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z" />
                </svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                <h2>Howdy, [HOD]</h2>
                <p>xxx@mgt.sjp.ac.lk</p>
              </div>
            </div>
          </Col>
          <Col className='d-flex flex-column text-end m-2'>
            <Link to="/"><Button>Log Out</Button></Link>
          </Col>
        </Row>
  )
}

export default Header