/* globals model elements icons gitHubInjection detectPage*/

// basically our view
import React from 'react';
import ReactDOM from 'react-dom';
import SettingsApp from './SettingsApp';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { isRepo, isGist } from 'detectPage';
import './settings.css';

ReactDOM.render(
  <MuiThemeProvider>
    <SettingsApp />
  </MuiThemeProvider>,
  document.getElementById
);

// 'use strict';

// function addStandupTab() {
//     const standupTab = createRepoTab("Standup", icons.organization, "#Standup", "reponav-standup");

//     getRepoNavBar().append(standupTab);

//     standupTab.click(function(e) {

//         // change selected tab to this tab
//         getRepoNavBar().find('.selected').removeClass('selected');
//         $(this).addClass('selected');

//         // TODO: fetch stuff from model then addStandupContainer with info
//         addStandupContainer();
//     });
// }

// function addStandupContainer() {

//     const repoContainer = getRepoContainer();

//     // remove repo contents
//     repoContainer.empty();

//     const repoContent = createRepoContent();
//     const subNav = createSubNav();

//     // TODO: fetch groups and append tabs to sub nav
//     // test groups
//     const testSubNavTab = createSubNavTab("Frontend", "#wow", "subnav-test selected");
//     subNav.append(testSubNavTab);
//     subNav.append(createSubNavTab("Backend", "#wow", "subnav-test"));

//     repoContent.append(subNav);

//     repoContainer.append(repoContent);

// }

// document.addEventListener('DOMContentLoaded', () => {
//     if (detectPage.isRepo()) {
//         gitHubInjection(window, () => {
//             addStandupTab();
//         });
//     }
// });

