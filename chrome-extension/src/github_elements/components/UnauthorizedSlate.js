import React, { Component } from 'react';
import styles from '../styles/style';
import { BlankSlateSpacious, PrimaryButtonSmall } from '../elements';
import { openNewTab } from '../../helper.js';

var octicons = require("octicons");

class UnauthorizedSlate extends Component {

  constructor(props) {
    super(props);

    this.heading = "Oops... you must be authenticated with KanHub to use this.";
    this.description = "Press the button below to authenticate.";
    this.handleAuthenticateSelect = this.handleAuthenticateSelect.bind(this);
  };

  handleAuthenticateSelect = (e) => {
    e.preventDefault();

    openNewTab(process.env.REACT_APP_SERVER_ROUTE + '/api/auth/github');
  };

  render() {

    return (
      <BlankSlateSpacious heading={this.heading} description={this.description} icon={octicons.alert.toSVG({ "width": 45, "height": 45 })}>
        <p><PrimaryButtonSmall onClick={this.handleAuthenticateSelect}>Authenticate</PrimaryButtonSmall></p>
      </BlankSlateSpacious>
    );
  };
}

export default UnauthorizedSlate;