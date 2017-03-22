import React, { Component } from 'react';
import {
  RepoContent, SubNav, SubNavItem, SectionContainer,
  SectionTitle, SectionHeader, SectionButtonGroup, PrimaryButton,
  PrimaryButtonSmall, DangerButton, BlankSlate, BlankSlateSpacious,
  UserCard
} from '../../github_elements/elements';

import 'primer-css/build/build.css';

var octicons = require("octicons");

const styles = {
  chatContainer: {
    position: "absolute",
    right: "0px",
    bottom: "0px",
    top: "0px",
    width: "320px",
    zIndex: "500",
    background: "#efeef1",
  },
  chatHeader: {
    position: "relative",
    height: "54px",
  },
  chatGroup: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  chatSection: {
    display: "block",
    position: "absolute",
    top: "54px",
    bottom: "125px",
    width: "100%",
    height: "auto",
    backgroundClip: "content-box",
    overflow: "hidden",
  },
  chatMessageList: {
    padding: "10px 0px",
    listStyleType: "none",
  },
  chatMessageAuthor: {
    fontWeight: "bold",
    marginRight: "5px",
  },
  chatMessageContent: {
    margin: "0px",
    padding: "0px",
    boxSizing: "border-box",
  },
  chatMessage: {
    fontSize: "12px",
    lineHeight: "20px",
    padding: "6px 20px",
    margin: "-3px 0",
    wordWrap: "break-word",
    listStylePosition: "unset",
  },
  chatFooter: {
    position: "absolute",
    bottom: "0px",
    height: "125px",
    width: "100%",
    padding: "0px 15px 20px 15px",
    boxSizing: "border-box",
  },
  chatText: {
    height: "65px",
    width: "100%",
    resize: "none",
  },
}

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
        <div style={styles.chatGroup}>

        </div>
      </div>
      <div style={styles.chatSection}>
        <ul style={styles.chatMessageList}>
          <Message author={"Klampz"} content="dasjdkasjdl sadaskdasldd sa dsadkjaslkdasd aslkdnaskldnaslkdnklsad klsa dklsa dklnaskldnasklndklasd"/>
        </ul>
      </div>
      <div style={styles.chatFooter}>
        <textarea style={styles.chatText} rows="4">
          
        </textarea>
        <div style={styles.chatGroup}>
          <PrimaryButtonSmall>Send</PrimaryButtonSmall>
        </div>
      </div>
    </div>
  );
}

export const NotInTeam = (props) => {
  const heading = "You are not part of a team.";
  const description = "Find one to start sharing your ideas and progress.";
  return (
    <BlankSlateSpacious heading={heading} description={description} icon={octicon.megaphone.toSVG({ "width": 45, "height": 45 })}>
      <p><PrimaryButtonSmall onClick={props.handleFindTeam}>Find Team</PrimaryButtonSmall></p>
    </BlankSlateSpacious>
  );
};