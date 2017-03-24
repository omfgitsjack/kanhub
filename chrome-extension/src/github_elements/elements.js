import $ from 'jquery';
import React from 'react';
import 'primer-css/build/build.css';
import styles from './styles/style';

export function getRepoNavBar() {
    return $('.reponav.js-repo-nav');
};

export function getRepoContainer() {
    return $('.container.new-discussion-timeline.experiment-repo-nav');
};

export function getParentRepoContainer() {
    return document.getElementById('js-repo-pjax-container');
};

export function createReactRepoContainer() {
    const container = document.createElement('div');
    container.id = 'kanhub-react-container';
    Object.assign(container.style, styles.reactRepoContainer);

    const sibling = getParentRepoContainer();

    if (sibling && sibling.parentElement) {
        sibling.parentElement.appendChild(container);
    } else {
        document.body.appendChild(container);
    }
};

export function getReactRepoContainer() {
    const container = document.getElementById('kanhub-react-container');

    return container || document.createElement('div');
}

export function createRepoTab(label, icon, url, customClass) {
    return $(`
        <a href=${url} class="js-selected-navigation-item reponav-item ${customClass}">
            ${icon}
            ${label}
        </a>
    `);
};

// react github elements

export const NavHeader = (props) => {
    return (
        <div style={styles.navHeader}>
            {props.children}
        </div>
    );
}

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

export const SectionContainer = (props) => {
    return (
        <div style={styles.sectionContainer}>{props.children}</div>
    );
}

export const SectionTitle = (props) => {

    return (
        <div style={styles.sectionTitle}>{props.children}</div>
    );
}

export const SectionHeader = (props) => {

    return (
        <div className="border-bottom p-2" style={styles.sectionHeader}>{props.children}</div>
    );
}

export const SectionButtonGroup = (props) => {

    return (
        <div style={styles.sectionButtonGroup}>{props.children}</div>
    );
}

export const NormalButton = (props) => {
    
    return (
        <button className={"btn " + props.extraClass} type="button" onClick={props.onClick}>{props.children}</button>
    );
}

export const PrimaryButton = (props) => {

    return (
        <button className={"btn btn-primary " + props.extraClass} type="button" onClick={props.onClick}>{props.children}</button>
    );
}

export const PrimaryButtonSmall = (props) => {

    return (
        <button className="btn btn-sm btn-primary" type="button" onClick={props.onClick}>{props.children}</button>
    );
}

export const PrimaryInputSmall = (props) => {

    return (
        <input className="btn btn-sm btn-primary" type="submit" value={props.value}/>
    );
}

export const DangerButton = (props) => {

    return (
        <button className={"btn btn-danger " + props.extraClass} type="button" onClick={props.onClick}>{props.children}</button>
    );
}

export const BlankSlateSpacious = (props) => {
    
    return (
        <div className="blankslate blankslate-capped blankslate-spacious blankslate-large">
            <div dangerouslySetInnerHTML={{ __html: props.icon }}></div>
            <h3>{props.heading}</h3>
            <p>{props.description}</p>
            {props.children}
        </div>
    );
}

export const BlankSlate = (props) => {
    
    return (
        <div className="blankslate blankslate-capped blankslate-large">
            <div dangerouslySetInnerHTML={{ __html: props.icon }}></div>
            <h3>{props.heading}</h3>
            <p>{props.description}</p>
            {props.children}
        </div>
    );
}

export const UserCard = (props) => {

    const user = props.user;

    return (
        <div className="border" style={styles.userCard}>
            <h4 style={styles.cardHeading}>
                <img style={styles.userImage} src={user['avatar_url']} alt="user" />
                <a className="aname" href={user['html_url']}>{user.login}</a>
            </h4>
        </div>
    );
}

export const Box = (props) => {
    
    return (
        <div className="boxed-group flush">
            <h3>{props.heading}</h3>
            <div className="boxed-group-inner">
                {props.children}
            </div>
        </div>
    );
}