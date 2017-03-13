import React from 'react';
import ReactDOM from 'react-dom';
import SettingsApp from './SettingsApp';
import TeamContent from './TeamContent';
import CreateTeam from './CreateTeam';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import $ from 'jquery';
import gitHubInjection from './githubInjection';
import * as pageHelper from './pageHelper';
import * as elements from './elements';
import * as model from './model';

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

function handleHashLocation(e) {

  if (!pageHelper.isRepo()) {
    return;
  }

  const location = pageHelper.getLocationHash();
  const query = pageHelper.getQuery();

  const queryObject = pageHelper.queryToObject(query);
  const repoContainer = elements.getRepoContainer();

  const oldHash = e && pageHelper.urlToHash(e.oldURL);

  model.getAuthUser(function(e) {});
  
  switch (location) {
    case '#Standup':
      if (oldHash !== "#Standup") {
        repoContainer.empty();
      }
      selectRepoTab($(".reponav-standup"));
      ReactDOM.render(
        <MuiThemeProvider>
          <SettingsApp />
        </MuiThemeProvider>,
        repoContainer[0]
      );
      break;
    case '#Team':
      if (oldHash !== "#Team") {
        repoContainer.empty();
      }
      selectRepoTab($(".reponav-team"));
      renderTeamTab(queryObject, repoContainer);
      break;
    default:
  }
}

function renderTeamTab(queryObject, repoContainer) {

  if (queryObject.action !== "new") {
    ReactDOM.render(
      <MuiThemeProvider>
        <TeamContent query={queryObject} />
      </MuiThemeProvider>,
      repoContainer[0]
    );
  } else {

    ReactDOM.render(
      <MuiThemeProvider>
        <CreateTeam />
      </MuiThemeProvider>,
      repoContainer[0]
    );
  }

}

document.addEventListener('DOMContentLoaded', () => {
  if (pageHelper.isRepo()) {
    gitHubInjection(window, () => {
      addRepoTab("Standup", "#Standup", octicons['comment-discussion'].toSVG(), "reponav-standup");
      addRepoTab("Team", "#Team", octicons.organization.toSVG(), "reponav-team");
    });

    handleHashLocation(null);
  }

});

window.addEventListener('hashchange', handleHashLocation, false);

