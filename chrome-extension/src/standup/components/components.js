import React, { Component } from 'react';
import {
  RepoContent, SubNav, SubNavItem, SectionContainer,
  SectionTitle, SectionHeader, SectionButtonGroup, PrimaryButton,
  PrimaryButtonSmall, DangerButton, BlankSlate, BlankSlateSpacious,
  UserCard, Box
} from '../../github_elements/elements';
import styles from '../styles/style';
import 'primer-css/build/build.css';

var octicons = require("octicons");

export const Message = (props) => {

  return (
    <li style={styles.chatMessage}>
      <span style={props.presenting ? styles.chatMessagePresenter : styles.chatMessageAuthor}>{props.username + ":"}</span>
      <span style={props.forMe ? styles.chatMessageContentForMe : styles.chatMessageContent}>{props.message}</span>
    </li>
  );
}

export const WaitingRoom = (props) => {
  let users = [];

  props.users.toArray().map(function(user, key) {
    if (user) {
      users.push(<UserCard key={key} user={user} />)
    }
  });

  return (
    <Box heading="Waiting Room">
      <div style={styles.waitingRoomMemberList}>
        {users}
      </div>
      <div style={styles.waitingRoomButtonGroup}>
        <PrimaryButton onClick={props.handleStartSession}>Start Session</PrimaryButton>
      </div>
    </Box>
  );
}

export const NotInTeam = (props) => {
  const heading = "You are not part of a team.";
  const description = "Find one to start sharing your ideas and progress.";
  return (
    <BlankSlateSpacious heading={heading} description={description} icon={octicons.megaphone.toSVG({ "width": 45, "height": 45 })}>
      <p><PrimaryButtonSmall onClick={props.handleFindTeam}>Find Team</PrimaryButtonSmall></p>
    </BlankSlateSpacious>
  );
};

export const StandupProfile = (props) => {
  return (
    <div style={styles.standUpProfile}>
      <h2>{props.username}</h2>
      <img style={styles.standUpProfilePicture} src={props.src} alt="user" />
    </div>
  );
};

export const StandupBox = (props) => {
  return (
    <div style={styles.standUpBox}>
      {props.children}
    </div>
  );
};