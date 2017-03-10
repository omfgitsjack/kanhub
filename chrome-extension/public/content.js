/* globals elements icons gitHubInjection detectPage*/

'use strict';

function addStandupTab() {
    const standupTab = createRepoTab("Standup", icons.organization, "#Standup", "reponav-standup");

    getRepoNavBar().append(standupTab);

    standupTab.click(function(e) {
        e.preventDefault();
        getRepoContainer().empty();

        const repoNavBar = getRepoNavBar();

		repoNavBar.find('.selected').removeClass('selected');

        $(this).addClass('selected');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (detectPage.isRepo()) {
        gitHubInjection(window, () => {
            addStandupTab();
        });
    }
});