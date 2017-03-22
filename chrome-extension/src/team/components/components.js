import React, { Component } from 'react';
import {
  RepoContent, SubNav, SubNavItem, SectionContainer,
  SectionTitle, SectionHeader, SectionButtonGroup, NormalButton, PrimaryButton,
  PrimaryButtonSmall, DangerButton, BlankSlate, BlankSlateSpacious,
  UserCard
} from '../../github_elements/elements';

import 'primer-css/build/build.css';

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
    <SectionContainer>
      <SectionHeader>
        <SectionTitle>{props.team.displayName}</SectionTitle>
      </SectionHeader>
      <p className="lead">{props.team.description}</p>
    </SectionContainer>
  );
}

export const TeamMembers = (props) => {

  const members = props.members.map(function (member, i) {
    return <UserCard key={i} user={member} />;
  });

  return (
    <SectionContainer>
      <SectionHeader>
        <SectionTitle>Members</SectionTitle>
      </SectionHeader>
      {members}
    </SectionContainer>
  );
}

export const NoTeams = (props) => {
  const heading = "There aren't any teams.";
  const description = "Create teams to organize your team's internal structure.";
  return (
    <BlankSlateSpacious heading={heading} description={description} icon={octicons.octoface.toSVG({ "width": 45, "height": 45 })}>
      <p><PrimaryButtonSmall onClick={props.handleCreateTeamSelect}>New Team</PrimaryButtonSmall></p>
    </BlankSlateSpacious>
  )
}

export const NoMembers = (props) => {
  const heading = `There aren't any members in ${props.teamName}.`;
  return (
    <BlankSlate heading={heading} icon={octicons.hubot.toSVG({ "width": 45, "height": 45 })}>
      <p><PrimaryButtonSmall onClick={props.handleJoinTeam}>Join Team</PrimaryButtonSmall></p>
    </BlankSlate>
  )
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
