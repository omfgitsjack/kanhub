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
import * as standupModel from './standup/model/model';

import { getUsernameCookie, getSocketToken, authKanhub, getAuthUser, getRepoIssues, getRepoLabels, logout } from './modelCommon';

var octicons = require("octicons");

function addRepoTab(label, url, icon, customClass) {

  if ($('.' + customClass).length !== 0) {
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
      selectRepoTab($(".kanhub-reponav-standup"));
      renderStandupTab(query, reactRepoContainer);
      break;
    case '#Team':
      repoContainer.empty();
      selectRepoTab($(".kanhub-reponav-team"));
      renderTeamTab(query, reactRepoContainer);
      break;
    default:
  }
}

function renderStandupTab(query, renderAnchor) {

  const { ownerName, repoName } = pageHelper.getOwnerAndRepo();

  // render standup container
  Promise.all([getAuthUser(), getSocketToken(), getRepoIssues({repo: repoName, owner: ownerName})]).then((res) => {
    standupModel.getKanhubUser({username: res[0].login}).then((user) => {
      const teams = _.filter(user.user.teams, function(team) {
        return team.repository === repoName;
      });

      ReactDOM.unmountComponentAtNode(renderAnchor);
      ReactDOM.render(
        <MuiThemeProvider>
          <StandupContainer query={query} user={res[0]} socketToken={res[1].token} teams={teams} owner={ownerName} repo={repoName} issues={res[2]} />
        </MuiThemeProvider>,
        renderAnchor
      );
    });
  });
}

function renderTeamTab(query, renderAnchor) {

  const { ownerName, repoName } = pageHelper.getOwnerAndRepo();

  ReactDOM.unmountComponentAtNode(renderAnchor);

  if (query.action === "new") {
    getRepoLabels({repo: repoName, owner: ownerName}).then((labels) => {
      ReactDOM.render(
        <MuiThemeProvider>
          <CreateTeam repo={repoName} labels={labels} />
        </MuiThemeProvider>,
        renderAnchor
      );
    });
  } else if (query.action === "edit") {
    getRepoLabels({repo: repoName, owner: ownerName}).then((labels) => {
      ReactDOM.render(
        <MuiThemeProvider>
          <EditTeam query={query} repo={repoName} labels={labels} />
        </MuiThemeProvider>,
        renderAnchor
      );
    });
  } else {
    // render team container
    Promise.all([getUsernameCookie(), teamModel.getTeams({ repo: repoName })]).then((res) => {
      const teams = _.sortBy(res[1], function(team) {
        return team.id;
      });

      console.log(teams);
      ReactDOM.render(
        <MuiThemeProvider>
          <TeamContainer query={query} username={res[0]} teams={teams} repo={repoName} owner={ownerName} />
        </MuiThemeProvider>,
        renderAnchor
      );
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {

  $("button.dropdown-signout").click(e => {
    console.log("github's logging out...");
    logout()
      .then(() => console.log("logged out of kanhub"))
      .catch(() => console.log("tried to logout but didn't work"));

  })

  gitHubInjection(window, () => {
    // reset the body width to original
    document.body.style.width = null;
  });

  if (pageHelper.isRepo()) {

      elements.createReactRepoContainer();

      gitHubInjection(window, () => {
        addRepoTab("Team", "#Team", octicons.organization.toSVG(), "kanhub-reponav-team");
        addRepoTab("Standup", "#Standup", octicons['comment-discussion'].toSVG(), "kanhub-reponav-standup");
        ReactDOM.unmountComponentAtNode(elements.getReactRepoContainer());
      });

      handleHashLocation(null);
  }

});

window.addEventListener('hashchange', handleHashLocation, false);

