/* globals elements icons gitHubInjection detectPage*/

'use strict';

function addStandupTab() {
	const navBar = document.getElementsByClassName('reponav js-repo-nav')[0];
    
    const standupTab = createTab("Standup", icons.organization, "test");
    
    navBar.appendChild(standupTab);
}

document.addEventListener('DOMContentLoaded', () => {
    if (detectPage.isRepo()) {
        gitHubInjection(window, () => {
            addStandupTab();
        });
    }
});