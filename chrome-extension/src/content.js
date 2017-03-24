import React from 'react';
import ReactDOM from 'react-dom';
import StandupContainer from './standup/containers/StandupContainer';
import TeamContainer from './team/containers/TeamContainer';
import CreateTeam from './team/containers/CreateTeam';
import EditTeam from './team/containers/EditTeam';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import $ from 'jquery';
import gitHubInjection from './githubInjection';
import * as pageHelper from './pageHelper';
import * as elements from './github_elements/elements';
import * as teamModel from './team/model/model';
import { getUsernameCookie, getSocketToken, authKanhub, getAuthUser } from './modelCommon';

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

  document.body.style.width = null;
  
  if (!pageHelper.isRepo()) {
    return;
  }

  const location = pageHelper.getLocationHash();
  const query = pageHelper.queryToObject(pageHelper.getQuery());
  const repoContainer = elements.getRepoContainer();
  const reactRepoContainer = elements.getReactRepoContainer();
  
  switch (location) {
    case '#Standup':
      repoContainer.empty();
      selectRepoTab($(".reponav-standup"));
      renderStandupTab(query, reactRepoContainer);
      break;
    case '#Team':
      repoContainer.empty();
      selectRepoTab($(".reponav-team"));
      renderTeamTab(query, reactRepoContainer);
      break;
    default:
  }
}

function renderStandupTab(query, renderAnchor) {

  const {ownerName, repoName} = pageHelper.getOwnerAndRepo();

  // render standup container
  Promise.all([getAuthUser(), getSocketToken(), teamModel.getTeams({repo: repoName})]).then((res) => {

    ReactDOM.unmountComponentAtNode(renderAnchor);
    ReactDOM.render(
      <MuiThemeProvider>
        <StandupContainer query={query} user={res[0]} socketToken={res[1].token} teams={res[2]} owner={ownerName} repo={repoName} />
      </MuiThemeProvider>,
      renderAnchor
    );
  });
}

function renderTeamTab(query, renderAnchor) {

  const {ownerName, repoName} = pageHelper.getOwnerAndRepo();

  ReactDOM.unmountComponentAtNode(renderAnchor);

  if (query.action === "new") {
    // render the create team container
    ReactDOM.render(
      <MuiThemeProvider>
        <CreateTeam repo={repoName} />
      </MuiThemeProvider>,
      renderAnchor
    );
  } else if (query.action === "edit") {

    ReactDOM.render(
      <MuiThemeProvider>
        <EditTeam query={query} repo={repoName} />
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

  authKanhub().then(() => {

    gitHubInjection(window, () => {
      // reset the body width to original
      document.body.style.width = null;
    });

    if (pageHelper.isRepo()) {
      elements.createReactRepoContainer();

      gitHubInjection(window, () => {
        addRepoTab("Team", "#Team", octicons.organization.toSVG(), "reponav-team");
        addRepoTab("Standup", "#Standup", octicons['comment-discussion'].toSVG(), "reponav-standup");
        ReactDOM.unmountComponentAtNode(elements.getReactRepoContainer());
      });

      handleHashLocation(null);
    }
  });
});

window.addEventListener('hashchange', handleHashLocation, false);

