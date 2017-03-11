import $ from 'jquery';

export function getRepoNavBar() {
    return $('.reponav.js-repo-nav');
};

export function getRepoContainer() {
    return $('.container.new-discussion-timeline.experiment-repo-nav');
};

export function createRepoTab(label, icon, url, customClass) {
    return $(`
        <a href=${url} class="js-selected-navigation-item reponav-item ${customClass}">
            ${icon}
            ${label}
        </a>
    `);
};

export function createRepoContent() {
    return $('<div class="repository-content"></div>');
};

export function createSubNav() {
    return $('<nav class="subnav"></nav>');
};

export function createSubNavTab(label, url, customClass) {
    return $(`
        <a href=${url} class="js-selected-navigation-item subnav-item ${customClass}" role="tab">
            ${label}
        </a>
    `);
};
