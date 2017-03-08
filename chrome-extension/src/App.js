/* global chrome */

import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import { blueGrey100, blueGrey500 } from 'material-ui/styles/colors';
import Popover from 'material-ui/Popover/Popover';
import { Menu, MenuItem } from 'material-ui/Menu';
import TooltipLabel from './TooltipLabel';
import logo from './logo-256.png';
import './App.css';

const Settings = (props) => {

  const options = props.settingsOptions.map((option) => {
                    return <MenuItem primaryText={option} />
                  });

  return (
    <div>
      <Popover
        {...props}
        onRequestClose={props.handleCloseSettings}
      >
        <Menu>
          {options}
        </Menu>
      </Popover>
    </div>
  );
};

class App extends Component {

 constructor(props) {
    super(props);

    this.settingsOptions = ['Help & feedback', 'Settings', 'Sign out'];

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
            <TooltipLabel label="What's this?">
              This extension requires you to authenticate with your GitHub account
              ONLY for project issue management.
            </TooltipLabel>
          </div>
        </div>
        <Settings
          {...this}
          {...this.state}
        />
      </div>
    );
  };
}

export default App;
