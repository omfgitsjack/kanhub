/* globals detectPage gitHubInjection */

'use strict';

function addStandupTab() {
	const navBar = document.getElementsByClassName('reponav js-repo-nav')[0];
    
    let standupTab = document.createElement('div');
    standupTab.innerHTML = `
        <a href="/" class="js-selected-navigation-item reponav-item" data-selected-links="repo_projects new_repo_project repo_project /sindresorhus/refined-github/projects">
        <svg aria-hidden="true" class="octicon octicon-project" height="16" version="1.1" viewBox="0 0 15 16" width="15"><path fill-rule="evenodd" d="M10 12h3V2h-3v10zm-4-2h3V2H6v8zm-4 4h3V2H2v12zm-1 1h13V1H1v14zM14 0H1a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1z"></path></svg>
        Standup
        </a>
    `;

    navBar.appendChild(standupTab);
}

document.addEventListener('DOMContentLoaded', () => {
    if (detectPage.isRepo()) {
        gitHubInjection(window, () => {
            addStandupTab();
        });
    }
});