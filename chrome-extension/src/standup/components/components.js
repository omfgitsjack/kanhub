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
    position: "fixed",
    right: "30px",
    bottom: "0px",
    height: "550px",
    width: "320px",
    zIndex: "500",
    background: "#efeef1",
    borderRadius: "5px 5px 0px 0px",
    boxShadow: "0px 0px 26px 2px rgba(122,122,122,1)",
  },
  chatHeader: {
    borderRadius: "5px 5px 0px 0px",
    background: "#000a1c",
    height: "40px",
  },
  chatGroup: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  chatSection: {
    display: "block",
    position: "relative",
    height: "380px",
    backgroundClip: "content-box"
  },
  chatFooter: {
    padding: "0px 15px 10px 15px",
    boxSizing: "border-box",
  },
  chatText: {
    width: "100%",
    resize: "none",
  },
}

export const Chat = (props) => {
  return (
    <div style={styles.chatContainer}>
      <div style={styles.chatHeader}>
        <div style={styles.chatGroup}>

        </div>
      </div>
      <div style={styles.chatSection}>
        {props.children}
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