import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import {Tabs, Tab} from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import { blueGrey100, blueGrey500 } from 'material-ui/styles/colors';
import Popover from 'material-ui/Popover/Popover';
import { Menu, MenuItem } from 'material-ui/Menu';
import TooltipLabel from './TooltipLabel';
import logo from './logo-256.png';
import './SettingsApp.css';

const styles = {
  appbar: {
    backgroundColor: "#24222a",
    height: "90px",
    padding: "10px 15%",
    alignItems: "center",
  },
  appbarTitle: {
    fontWeight: "bold",
    fontSize: "24px",
  },
  appbarLogo: {
    height: "80px",
    width: "80px",
  },
  tabs: {
    height: "90px",
    width: "500px",
  },
  tab: {
    backgroundColor: "#24222a",
    height: "90px",
  },
  tabsInkBar: {
    color: "pink",
    backgroundColor: "pink",
  },
};

const OptionTabs = () => {
  return (
    <Tabs style={styles.tabs} value="rulesets" inkBarStyle={styles.inkBarStyle} >
      <Tab label="Rulesets" style={styles.tab} value="rulesets" >
      </Tab>
      <Tab label="Feedback" style={styles.tab} value="feedback" >
      </Tab>
    </Tabs>
  );
}
class StandupContent extends Component {

  constructor(props) {
    super(props);
  };

  render() {
    return (
      <div>
        <AppBar title="KanHub"
          titleStyle={styles.appbarTitle} 
          iconElementLeft={<img style={styles.appbarLogo} src={logo} />}
          style={styles.appbar}
        >
          <OptionTabs />
        </AppBar>
      </div>
    );
  };
}

export default StandupContent;

        // <div className="settings-nav-bar">
        //   <img className="settings-logo" src={logo} />
        //   <div className="settings-title">KanHub</div>
        //   <OptionTabs />
        // </div>