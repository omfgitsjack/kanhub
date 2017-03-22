import React from 'react';
import ReactDOM from 'react-dom';
import StandupContainer from './standup/containers/StandupContainer';
import TeamContainer from './team/containers/TeamContainer';
import CreateTeam from './team/containers/CreateTeam';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import $ from 'jquery';
import gitHubInjection from './githubInjection';
import * as pageHelper from './pageHelper';
import * as elements from './github_elements/elements';
import * as teamModel from './team/model/model';
import { getUsernameCookie } from './modelCommon';

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
  const query = pageHelper.queryToObject(pageHelper.getQuery());
  const repoContainer = elements.getRepoContainer();
  const oldHash = e && pageHelper.urlToHash(e.oldURL);
  
  switch (location) {
    case '#Standup':
      if (oldHash !== "#Standup") {
        repoContainer.empty();
      }
      selectRepoTab($(".reponav-standup"));
      renderStandupTab(query, repoContainer[0]);
      break;
    case '#Team':
      if (oldHash !== "#Team") {
        repoContainer.empty();
      }
      selectRepoTab($(".reponav-team"));
      renderTeamTab(query, repoContainer[0]);
      break;
    default:
  }
}

function renderStandupTab(query, renderAnchor) {

   const {ownerName, repoName} = pageHelper.getOwnerAndRepo();

  // render standup container
  Promise.all([getUsernameCookie(), teamModel.getTeams({repo: repoName})]).then((res) => {
    ReactDOM.render(
      <MuiThemeProvider>
        <StandupContainer query={query} username={res[0]} teams={res[1]} repo={repoName} />
      </MuiThemeProvider>,
      renderAnchor
    );
  });
}

function renderTeamTab(query, renderAnchor) {

  const {ownerName, repoName} = pageHelper.getOwnerAndRepo();

  if (query.action === "new") {
    // render the create team container
    ReactDOM.render(
      <MuiThemeProvider>
        <CreateTeam repo={repoName} />
      </MuiThemeProvider>,
      renderAnchor
    );
  } else {
    // render team container
    Promise.all([getUsernameCookie(), teamModel.getTeams({repo: repoName})]).then((res) => {
      ReactDOM.render(
        <MuiThemeProvider>
          <TeamContainer query={query} username={res[0]} teams={res[1]} repo={repoName} />
        </MuiThemeProvider>,
        renderAnchor
      );
    });
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

