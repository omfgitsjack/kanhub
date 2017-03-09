import React from 'react';
import ReactDOM from 'react-dom';
import SettingsApp from './SettingsApp';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './settings.css';

ReactDOM.render(
  <MuiThemeProvider>
    <SettingsApp />
  </MuiThemeProvider>,
  document.getElementById('settings-root')
);
