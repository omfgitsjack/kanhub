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

function addIssueModel() {
  if (document.getElementById("kanhub-issue-modal")) {
    return;
  }
  console.log("asd");
  elements.createModal("kanhub-issue-modal", "kanhub-issue-modal-content", "kanhub-issue-modal-overlay");

  $("#kanhub-issue-modal-overlay").click(function(e) {
    e.preventDefault();
    let modal = document.getElementById("kanhub-issue-modal");
    let overlay = document.getElementById("kanhub-issue-modal-overlay");
    if (e.target === overlay) {
      modal.style.display = "none";
    }
  });
}

function showIssueModal(repo, owner, issueNumber) {
    let issueModal = document.getElementById("kanhub-issue-modal");
    let issueModalContent = document.getElementById("kanhub-issue-modal-content");

    if (!issueModal || !issueModalContent) {
      return;
    }

    const url = 'https://github.com/' + owner + '/' + repo + '/issues/' + issueNumber;
    let temp = $("<div></div>");

    temp.load(url, function(res, text) {
      if (text === 'error') {
        return;
      }

      temp.find(".discussion-timeline-actions").remove();
      temp.find(".gh-header-actions").remove();
      temp.find(".sidebar-notifications").remove();
      temp.find(".lock-toggle").remove();

      issueModal.style.display = "block";
      let issuesList = temp.find(".container.new-discussion-timeline.experiment-repo-nav")[0];
      $("#kanhub-issue-modal-content").empty();
      issueModalContent.appendChild(issuesList);
    });
}

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
  Promise.all([getAuthUser(), getSocketToken()]).then((res) => {
    standupModel.getKanhubUser({username: res[0].login}).then((user) => {
      const teams = _.filter(user.user.teams, function(team) {
        return team.repository === repoName;
      });

      ReactDOM.unmountComponentAtNode(renderAnchor);
      ReactDOM.render(
        <MuiThemeProvider>
          <StandupContainer showIssueModal={showIssueModal} query={query} user={res[0]} socketToken={res[1].token} teams={teams} owner={ownerName} repo={repoName} />
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
        addIssueModel();
        ReactDOM.unmountComponentAtNode(elements.getReactRepoContainer());
      });

      handleHashLocation(null);
  }

});

window.addEventListener('hashchange', handleHashLocation, false);

