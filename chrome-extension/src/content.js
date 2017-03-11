/* globals model elements icons gitHubInjection detectPage*/

//'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import SettingsApp from './SettingsApp';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import $ from 'jquery';
import gitHubInjection from './githubInjection';
import * as detectPage from './detectPage';
import * as elements from './elements';
import * as icons from './icons';

import './settings.css';

function addStandupTab() {
    const standupTab = elements.createRepoTab("Standup", icons.organization, "#Standup", "reponav-standup");

    elements.getRepoNavBar().append(standupTab);

    standupTab.click(function(e) {

        // change selected tab to this tab
        elements.getRepoNavBar().find('.selected').removeClass('selected');
        $(this).addClass('selected');
    });
}

function handleHashLocation() {

  if (!detectPage.isRepo()) {
    return;
  }

  var location = window.location.hash.replace(/^#\/?|\/$/g, '').split('/')[0];

  const repoContainer = elements.getRepoContainer();

  switch(location) {
    case 'Standup':
      // remove repo contents
      repoContainer.empty();
      ReactDOM.render(
        <MuiThemeProvider>
          <SettingsApp />
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
        addStandupTab();
      });

      handleHashLocation();
    }

});

window.addEventListener('hashchange', handleHashLocation, false);

