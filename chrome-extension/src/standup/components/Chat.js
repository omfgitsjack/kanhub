import React, { PureComponent } from 'react';
import {
  RepoContent, SubNav, SubNavItem, SectionContainer,
  SectionTitle, SectionHeader, SectionButtonGroup, PrimaryButton,
  PrimaryButtonSmall, DangerButton, BlankSlate, BlankSlateSpacious,
  UserCard, Box
} from '../../github_elements/elements';
import { Message } from './components';
import styles from '../styles/style';
import _ from 'lodash';

class Chat extends PureComponent {

  constructor(props) {
    super(props);

    this.meString = "@" + this.props.me.login.toLowerCase();
  };

  render() {
    const messages = this.props.messages.map(function(message, i) {
      const forMe = _.includes(message.message.toLowerCase(), this.meString);
      const presenting = this.props.presentingUser && (message.username === this.props.presentingUser.login);
      return <Message key={i} username={message.username} message={message.message} presenting={presenting} forMe={forMe}/>;
    }.bind(this));

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