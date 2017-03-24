import React, { Component } from 'react';
import {
  RepoContent, SubNav, SubNavItem, SectionContainer,
  SectionTitle, SectionHeader, SectionButtonGroup, PrimaryButton,
  PrimaryButtonSmall, DangerButton, BlankSlate, BlankSlateSpacious,
  UserCard, Box
} from '../../github_elements/elements';
import { Message } from './components';
import styles from '../styles/style';
import 'primer-css/build/build.css';

class Chat extends Component {

  constructor(props) {
    super(props);
  };

  render() {
    const messages = this.props.messages.map(function(message, i) {
      return <Message key={i} username={message.username} message={message.message} />;
    });

    return (
      <div className="border-left" style={styles.chatContainer}>
        <div style={styles.chatHeader}>
          {this.props.teamName}
        </div>
        <div style={styles.chatSection} ref="chat-container">
          <ul style={styles.chatMessageList}>
            {messages}
          </ul>
        </div>
        <div style={styles.chatFooter}>
          <textarea style={styles.chatText} rows="4" value={this.props.message} onChange={this.props.handleMessageChange} onKeyPress={this.props.handleKeyPress}/>
          <div style={styles.chatGroup}>
            <PrimaryButtonSmall onClick={this.props.handleSendMessage}>Send</PrimaryButtonSmall>
          </div>
        </div>
      </div>
    );
  };
}

export default Chat;