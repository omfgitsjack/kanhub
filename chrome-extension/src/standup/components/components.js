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
      <span style={styles.chatMessageAuthor}>{props.author + ":"}</span>
      <span style={styles.chatMessageContent}>{props.content}</span>
    </li>
  );
}

export const Chat = (props) => {
  return (
    <div className="border-left" style={styles.chatContainer}>
      <div style={styles.chatHeader}>
        {props.teamName}
      </div>
      <div style={styles.chatSection}>
        <ul style={styles.chatMessageList}>
          <Message author={"Klampz"} content="dasjdkasjdl sadaskdasldd sa dsadkjaslkdasd aslkdnaskldnaslkdnklsad klsa dklsa dklnaskldnasklndklasd"/>
          <Message author={"Klampz"} content="dasjdkasjdl sadaskdasldd sa dsadkjaslkdasd aslkdnaskldnaslkdnklsad klsa dklsa dklnaskldnasklndklasd"/>
          <Message author={"Klampz"} content="dasjdkasjdl sadaskdasldd sa dsadkjaslkdasd aslkdnaskldnaslkdnklsad klsa dklsa dklnaskldnasklndklasd"/>
          <Message author={"Klampz"} content="dasjdkasjdl sadaskdasldd sa dsadkjaslkdasd aslkdnaskldnaslkdnklsad klsa dklsa dklnaskldnasklndklasd"/>
          <Message author={"Klampz"} content="dasjdkasjdl sadaskdasldd sa dsadkjaslkdasd aslkdnaskldnaslkdnklsad klsa dklsa dklnaskldnasklndklasd"/>
          <Message author={"Klampz"} content="dasjdkasjdl sadaskdasldd sa dsadkjaslkdasd aslkdnaskldnaslkdnklsad klsa dklsa dklnaskldnasklndklasd"/>
          <Message author={"Klampz"} content="dasjdkasjdl sadaskdasldd sa dsadkjaslkdasd aslkdnaskldnaslkdnklsad klsa dklsa dklnaskldnasklndklasd"/>
          <Message author={"Klampz"} content="dasjdkasjdl sadaskdasldd sa dsadkjaslkdasd aslkdnaskldnaslkdnklsad klsa dklsa dklnaskldnasklndklasd"/>
          <Message author={"Klampz"} content="dasjdkasjdl sadaskdasldd sa dsadkjaslkdasd aslkdnaskldnaslkdnklsad klsa dklsa dklnaskldnasklndklasd"/>
          <Message author={"Klampz"} content="dasjdkasjdl sadaskdasldd sa dsadkjaslkdasd aslkdnaskldnaslkdnklsad klsa dklsa dklnaskldnasklndklasd"/>
          <Message author={"Klampz"} content="dasjdkasjdl sadaskdasldd sa dsadkjaslkdasd aslkdnaskldnaslkdnklsad klsa dklsa dklnaskldnasklndklasd"/>
          <Message author={"Klampz"} content="dasjdkasjdl sadaskdasldd sa dsadkjaslkdasd aslkdnaskldnaslkdnklsad klsa dklsa dklnaskldnasklndklasd"/>
        </ul>
      </div>
      <div style={styles.chatFooter}>
        <textarea style={styles.chatText} rows="4">
          
        </textarea>
        <div style={styles.chatGroup}>
          <PrimaryButtonSmall onClick={props.handleSendMessage}>Send</PrimaryButtonSmall>
        </div>
      </div>
    </div>
  );
}

export const WaitingRoom = (props) => {
  return (
    <Box heading="Waiting Room">
      <div style={styles.waitingRoomMemberList}>
        {props.children}
      </div>
      <div style={styles.waitingRoomButtonGroup}>
        <PrimaryButton>Start Standup</PrimaryButton>
      </div>
    </Box>
  )
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
    <img style={styles.standUpProfile} src={props.src} alt="user" />
  );
};

export const StandupCard = (props) => {
  return (
    <div style={styles.standUpCard}>
      {props.children}
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