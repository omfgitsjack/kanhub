import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React!!!!</h2>
        </div>
        <div className="popup-body">
          <MuiThemeProvider>
            <RaisedButton
              primary={true}
              label="Authenticate with GitHub"
            />
          </MuiThemeProvider>
        </div>
      </div>
    );
  }
}

export default App;
