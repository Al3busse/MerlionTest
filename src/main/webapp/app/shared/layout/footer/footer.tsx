import './footer.scss';

import React from 'react';
import { Translate } from 'react-jhipster';
import { Col, Row } from 'reactstrap';

const Footer = props => (
  <div className="footer">
    <Row>
      <Col md="12" className="p-0">
        <p className="footer-text">
          <Translate contentKey="footer">Hecho por</Translate>{' '}
          <a className="footer-link" href="https://github.com/Al3busse">
            al3busse
          </a>
        </p>
      </Col>
    </Row>
  </div>
);

export default Footer;
