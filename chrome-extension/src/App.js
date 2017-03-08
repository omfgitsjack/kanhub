/* global chrome */

import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import { blueGrey100, blueGrey500 } from 'material-ui/styles/colors';
import Popover from 'material-ui/Popover/Popover';
import { Menu, MenuItem } from 'material-ui/Menu';
import ReactTooltip from 'react-tooltip';
import logo from './logo-256.png';
import './App.css';

const Settings = ({anchorEl, anchorOrigin, targetOrigin, handleCloseSettings, open}) => {
  return (
    <div>
      <Popover
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={anchorOrigin}
        targetOrigin={targetOrigin}
        onRequestClose={handleCloseSettings}
      >
        <Menu>
          <MenuItem primaryText="Help &amp; feedback" />
          <MenuItem primaryText="Settings" />
          <MenuItem primaryText="Sign out" />
        </Menu>
      </Popover>
    </div>
  );
};

const WhatsThis = () => {
  return (
    <div>
      <label className="popup-whats-this" data-tip data-for='whats-this-tooltip'>What's this?</label>
      <ReactTooltip id='whats-this-tooltip' place='top' effect='solid'>
        <div className="whats-this-text">
          This extension requires you to authenticate with your GitHub account
          ONLY for project issue management.
        </div>
      </ReactTooltip>
    </div>
  );
};

class App extends Component {

 constructor(props) {
    super(props);

    this.anchorOrigin = {
      horizontal: 'right',
      vertical: 'bottom',
    };

    this.targetOrigin = {
      horizontal: 'right',
      vertical: 'top',
    };

    this.state = {
      open: false,
    };
  };

  handleOpenSettings = (event) => {
    event.preventDefault();
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleCloseSettings = () => {
    this.setState({
      open: false,
        });
  };

  handleOpenGithubAuth = () => {
    chrome.tabs.create({ 'url': process.env.REACT_APP_SERVER_ROUTE + '/api/auth/github' }, function (tab) {
      // Tab opened.
    });
  };

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <div className="popup">
            <div className="popup-settings-bar">
              <div className="settings">
                <ActionSettings
                  id="popup-settings"
                  color={ blueGrey500 }
                  hoverColor={ blueGrey100 }
                  onClick={this.handleOpenSettings}
                />
              </div>
            </div>
            <div className="popup-header">
              <img src={logo} className="popup-logo" alt="logo" />
              <div className="popup-title">KanHub</div>
            </div>
            <div className="popup-body">
              <RaisedButton
                primary={true}
                label="Authenticate with GitHub"
                onClick={this.handleOpenGithubAuth}
              />
            </div>
            <div className="popup-footer">
              <WhatsThis />
            </div>
          </div>
        </MuiThemeProvider>
        <MuiThemeProvider>
          <Settings
            anchorEl={this.state.anchorEl}
            anchorOrigin={this.anchorOrigin}
            targetOrigin={this.targetOrigin}
            handleCloseSettings={this.handleCloseSettings}
            open={this.state.open}
          />
        </MuiThemeProvider>
      </div>
    );
  };
}

export default App;
