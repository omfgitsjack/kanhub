/* globals model elements icons gitHubInjection detectPage*/

//'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import SettingsApp from './SettingsApp';
import TeamContent from './TeamContent';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import $ from 'jquery';
import gitHubInjection from './githubInjection';
import * as detectPage from './detectPage';
import * as elements from './elements';

import './settings.css';

var octicons = require("octicons");

function addRepoTab(label, url, icon, customClass) {

    if ($(customClass).length !== 0) {
      return;
    }
    
    const newTab = elements.createRepoTab(label, icon, url, customClass);

    elements.getRepoNavBar().append(newTab);
}

function selectRepoTab(tab) {
    elements.getRepoNavBar().find('.selected').removeClass('selected');
    tab.addClass('selected');
}

function handleHashLocation() {

  if (!detectPage.isRepo()) {
    return;
  }

  var location = window.location.hash.replace(/^#\/?|\/$/g, '').split('/')[0];

  const repoContainer = elements.getRepoContainer();

  switch(location) {
    case 'Standup':
      repoContainer.empty();
      selectRepoTab($(".reponav-standup"));
      ReactDOM.render(
        <MuiThemeProvider>
          <SettingsApp />
        </MuiThemeProvider>,
        repoContainer[0]
      );
      break;
    case 'Team':
      repoContainer.empty();
      selectRepoTab($(".reponav-team"));
      ReactDOM.render(
        <MuiThemeProvider>
          <TeamContent />
        </MuiThemeProvider>,
        repoContainer[0]
      );
      break;
    default:
  }
}

document.addEventListener('DOMContentLoaded', () => {
    if (detectPage.isRepo()) {
      gitHubInjection(window, () => {
        addRepoTab("Standup", "#Standup", octicons['comment-discussion'].toSVG(), "reponav-standup");
        addRepoTab("Team", "#Team", octicons.organization.toSVG(), "reponav-team");
      });

      handleHashLocation();
    }

});

window.addEventListener('hashchange', handleHashLocation, false);

