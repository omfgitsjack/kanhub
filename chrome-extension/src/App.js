/* global chrome */

import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import { blueGrey100, blueGrey500 } from 'material-ui/styles/colors';
import './App.css';

class App extends Component {

  openGithubAuth = () => {
    chrome.tabs.create({ 'url': process.env.REACT_APP_SERVER_ROUTE + '/api/auth/github' }, function (tab) {
      // Tab opened.
    });
  };

  openWhatsThis = () => {
    
  };

  render() {
    return (
      <MuiThemeProvider>
        <div className="popup">
          <div className="popup-settings-bar">
            <ActionSettings color={ blueGrey500 } hoverColor={ blueGrey100 } />
          </div>
          <div className="popup-header">
            <div className="popup-title">KanHub</div>
          </div>
          <div className="popup-body">
            <RaisedButton
              primary={true}
              label="Authenticate with GitHub"
              onClick={this.openGithubAuth}
            />
          </div>
          <div className="popup-footer">
            <a target="_blank" href={process.env.REACT_APP_SERVER_ROUTE + '/api/auth/github'}>What's this?</a>
          </div>
        </div>
      </MuiThemeProvider>
    );
  };
}

export default App;
