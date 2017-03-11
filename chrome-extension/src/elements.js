import $ from 'jquery';
import React from 'react';
import 'primer-css/build/build.css';

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
        <div className="container">
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

export const SubNavItem = ({label, url, selected, onClick}) => {

    return (
        <a href={url} className={"js-selected-navigation-item subnav-item " + (selected ? "selected":"")} role={"tab"} onClick={onClick}>
            {label}
        </a>
    );
}
