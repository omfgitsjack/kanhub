import $ from 'jquery';
import React from 'react';

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

export const RepoContent = (props) => {
    return (
        <div className="repository-content">
            {props.children}
        </div>
    );
}

export const SubNav = (props) => {
  return (
    <nav className="subnav">
        {props.children}
    </nav>
  );
};

export const SubNavItem = ({label, url, selected}) => {
    return (
        <a href={url} className={"js-selected-navigation-item subnav-item " + (selected ? "selected":"")} role={"tab"}>
            {label}
        </a>
    );
}
