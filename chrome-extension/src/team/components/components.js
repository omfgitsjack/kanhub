import React, { Component } from 'react';
import {
  RepoContent, SubNav, SubNavItem, SectionContainer,
  SectionTitle, SectionHeader, SectionButtonGroup, NormalButton, PrimaryButton,
  PrimaryButtonSmall, DangerButton, BlankSlate, BlankSlateSpacious,
  UserCard, Box
} from '../../github_elements/elements';

import 'primer-css/build/build.css';
import styles from '../styles/style';

var octicons = require("octicons");

export const TeamSubNav = (props) => {

  const teams = props.teams.map((team, i) => {
    return <SubNavItem key={i} label={team.displayName} selected={team.id === props.selectedTeamId} onClick={function (e) {
      e.preventDefault();
      props.handleNavSelect(team.id);
    }} />
  });

  return (
    <SubNav>
      {teams}
    </SubNav>
  );
};

export const TeamInfo = (props) => {
  return (
      <p className="lead">{props.description}</p>
  );
}

export const TeamSection = (props) => {
  return (
    <SectionContainer>
      <SectionHeader>
        <SectionTitle>{props.heading}</SectionTitle>
      </SectionHeader>
      {props.children}
    </SectionContainer>
  )
};

export const TeamIssues = (props) => {
  return (
    <Box heading="Issues">
      <ul className="summary-stats">
        <li style={styles.issueListItem}>
          <a href="#closed-issues">
            <div style={styles.issueHeader}>
              <div style={styles.issueClosedIcon} dangerouslySetInnerHTML={{ __html: octicons['issue-closed'].toSVG() }}></div>
              <div style={styles.issueCount}>{props.closedIssues}</div>
            </div>
            Closed Issues
          </a>
        </li>
        <li style={styles.issueListItem}>
          <a href="#new-issues">
            <div style={styles.issueHeader}>
              <div style={styles.issueOpenIcon} dangerouslySetInnerHTML={{ __html: octicons['issue-opened'].toSVG() }}></div>
              <div style={styles.issueCount}>{props.openIssues}</div>
            </div>
            Open Issues
          </a>
        </li>
      </ul>
    </Box>
  );
};

export const TeamMembers = (props) => {

  const members = props.members.map(function (member, i) {
    return <UserCard key={i} user={member} />;
  });

  return (
    <div>{members}</div>
  );
}

export const NoTeamFound = (props) => {
  const heading = "Oh no! The team you are looking for isn't here..";
  return (
    <BlankSlateSpacious heading={heading} icon={octicons['issue-opened'].toSVG({ "width": 45, "height": 45 })}/>
  );
}

export const NoTeams = (props) => {
  const heading = "There aren't any teams.";
  const description = "Create teams to organize your team's internal structure.";
  return (
    <BlankSlateSpacious heading={heading} description={description} icon={octicons.octoface.toSVG({ "width": 45, "height": 45 })}>
      <p><PrimaryButtonSmall onClick={props.handleCreateTeamSelect}>New Team</PrimaryButtonSmall></p>
    </BlankSlateSpacious>
  );
}

export const NoPresenter = (props) => {
  const heading = "Oh no! The presenter left the session!";
  const description = props.timeLeft;
  return (
    <BlankSlateSpacious heading={heading} description={description} icon={octicons['issue-opened'].toSVG({ "width": 45, "height": 45 })}>
      <p><PrimaryButtonSmall onClick={props.handleNextPerson}>Skip Presenter</PrimaryButtonSmall></p>
    </BlankSlateSpacious>
  );
}

export const NoMembers = (props) => {
  const heading = `There aren't any members in ${props.teamName}.`;
  return (
    <BlankSlate heading={heading} icon={octicons.hubot.toSVG({ "width": 45, "height": 45 })}>
      <p><PrimaryButtonSmall onClick={props.handleJoinTeam}>Join Team</PrimaryButtonSmall></p>
    </BlankSlate>
  );
}

export const CreateTeamForm = (props) => {

  return (
    <SectionContainer>
      <SectionHeader>
        <SectionTitle>Create New Team</SectionTitle>
      </SectionHeader>
      <form>
        <dl className="form-group">
          <dt><label>Team Name</label></dt>
          <dd><input className="form-control" type="text" placeholder="Team name" onChange={props.handleTeamNameChange}/></dd>
        </dl>

        <dl className="form-group">
          <dt><label>Team Description</label></dt>
          <dd>
            <textarea className="form-control" placeholder="Briefly describe what this team is for..." onChange={props.handleTeamDescriptionChange}></textarea>
          </dd>
        </dl>

        <div className="form-actions">
          <PrimaryButton onClick={props.handleCreateTeamSelect}>Create</PrimaryButton>
          <NormalButton onClick={props.handleCancelTeamSelect}>Cancel</NormalButton>
        </div>
      </form>
    </SectionContainer>
  );
}

export const EditTeamForm = (props) => {

  return (
    <SectionContainer>
      <SectionHeader>
        <SectionTitle>{'Editing ' + props.team.displayName}</SectionTitle>
      </SectionHeader>
      <form>
        <dl className="form-group">
          <dt><label>Team Name</label></dt>
          <dd><input className="form-control" type="text" placeholder="Team name" value={props.teamName} onChange={props.handleTeamNameChange}/></dd>
        </dl>

        <dl className="form-group">
          <dt><label>Team Description</label></dt>
          <dd>
            <textarea className="form-control" placeholder="Briefly describe what this team is for..." value={props.teamDescription} onChange={props.handleTeamDescriptionChange}></textarea>
          </dd>
        </dl>

        <div className="form-actions">
          <PrimaryButton onClick={props.handleEditTeamSelect}>Save</PrimaryButton>
          <NormalButton onClick={props.handleCancelTeamSelect}>Cancel</NormalButton>
        </div>
      </form>
    </SectionContainer>
  );
}