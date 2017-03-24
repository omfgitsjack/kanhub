import React, { Component } from 'react';
import styles from '../styles/style';
import 'primer-css/build/build.css';

class StandupCard extends Component {

  constructor(props) {
    super(props);
  };

  render() {
    return (
      <div style={styles.standUpCard}>
        <h2 style={styles.standUpCardHeader}>What I did yesterday</h2>
        <textarea ref="standup-yesterday"
          className="border"
          style={styles.standUpCardText}
          placeholder="things accomplished yesterday..."
          maxLength="150"
          value={this.props.card.yesterdayDescription || ''}
          onChange={this.props.presenting ? this.props.handleYesterdayChange : (()=>{})}/>
        <h2 style={styles.standUpCardHeader}>What I will do today</h2>
        <textarea ref="standup-today"
          className="border"
          style={styles.standUpCardText}
          placeholder="things I will do today..."
          maxLength="150"
          value={this.props.card.todayDescription || ''}
          onChange={this.props.presenting ? this.props.handleTodayChange : (()=>{})}/>
        <h2 style={styles.standUpCardHeader}>Obstacles</h2>
        <textarea ref="standup-obstacle"
          className="border"
          style={styles.standUpCardText}
          placeholder="roadblocks impeding progress..."
          maxLength="150"
          value={this.props.card.obstaclesDescription || ''}
          onChange={this.props.presenting ? this.props.handleObstacleChange : (()=>{})}/>
      </div>
    );
  };
}

export default StandupCard;