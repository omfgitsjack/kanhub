import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TooltipLabel from './TooltipLabel';
import logo from './logo-256.png';
import { openNewTab } from './helper.js';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
  };


  handleOpenGithubAuth = () => {
    openNewTab(process.env.REACT_APP_SERVER_ROUTE + '/api/auth/github');
  };

  render() {
    return (
      <div>
        <div className="popup">
          <div className="popup-header">
            <img src={logo} className="popup-logo" alt="logo" />
            <div className="popup-title">KanHub</div>
          </div>
          <div className="popup-body">
            <RaisedButton
              primary={ true }
              label="Authenticate with GitHub"
              onClick={ this.handleOpenGithubAuth }
            />
          </div>
          <div className="popup-footer">
            <TooltipLabel label="What's this?">
              This extension requires you to authenticate with your GitHub account.
            </TooltipLabel>
          </div>
        </div>
      </div>
    );
  };
}

export default App;
