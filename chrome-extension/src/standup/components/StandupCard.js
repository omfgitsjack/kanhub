import React, { Component } from 'react';
import styles from '../styles/style';

class StandupCard extends Component {

  constructor(props) {
    super(props);
  };

  render() {

    const noun = this.props.presenting ? "I" : this.props.card.username;
    return (
      <div style={styles.standUpCard}>
        <h2 style={styles.standUpCardHeader}>{"What " + noun + " did yesterday"}</h2>
        <textarea ref="standup-yesterday"
          className="border"
          style={this.props.presenting ? styles.standUpCardText : styles.standUpCardNoText}
          placeholder={"things " + noun + " accomplished yesterday..."}
          maxLength="150"
          value={this.props.card.yesterdayDescription || ''}
          readOnly={!this.props.presenting}
          disabled={!this.props.presenting}
          onChange={this.props.presenting ? this.props.handleYesterdayChange : (()=>{})}/>
        <h2 style={styles.standUpCardHeader}>{"What " + noun + " will do today"}</h2>
        <textarea ref="standup-today"
          className="border"
          style={this.props.presenting ? styles.standUpCardText : styles.standUpCardNoText}
          placeholder={"things " + noun + " will do today..."}
          maxLength="150"
          value={this.props.card.todayDescription || ''}
          readOnly={!this.props.presenting}
          disabled={!this.props.presenting}
          onChange={this.props.presenting ? this.props.handleTodayChange : (()=>{})}/>
        <h2 style={styles.standUpCardHeader}>Obstacles</h2>
        <textarea ref="standup-obstacle"
          className="border"
          style={this.props.presenting ? styles.standUpCardText : styles.standUpCardNoText}
          placeholder="roadblocks impeding progress..."
          maxLength="150"
          value={this.props.card.obstaclesDescription || ''}
          readOnly={!this.props.presenting}
          disabled={!this.props.presenting}
          onChange={this.props.presenting ? this.props.handleObstacleChange : (()=>{})}/>
      </div>
    );
  };
}

export default StandupCard;