import React, { Component } from 'react';
import styles from '../styles/style';
import moment from 'moment';
import _ from 'lodash';
import { getTeamStandups, getStandupCards } from '../model/model';
import Collapse, { Panel } from 'rc-collapse';
import 'rc-collapse/assets/index.css';
import { Map } from 'immutable';

const StandupCardSection = (props) => {
  return (
    <div style={styles.standupCardSection}>
      <div style={styles.standupCardSectionHeader}>{props.heading}</div>
      <div style={styles.standupCardText}>{props.children}</div>
    </div>
  );
};

const StandupCards = (props) => {
  if (!props.activeKey) {
    return <div></div>;
  }

  const standups = props.standupCards.get(props.activeKey).map(function(standup, key) {
    const username = standup.username;

    if (!username) {
      return <div key={key}></div>;
    }

    return (
      <div className="border" key={key} style={styles.standupCard}>
        <StandupCardSection style={styles.standupCardSection} heading={"What " + username + " did yesterday"}>{standup.yesterdayDescription}</StandupCardSection>
        <StandupCardSection style={styles.standupCardSection} heading={"What " + username + " will do today"}>{standup.todayDescription}</StandupCardSection>
        <StandupCardSection style={styles.standupCardSection} heading={"What roadblocks did " + username + " have"}>{standup.obstaclesDescription}</StandupCardSection>
      </div>
    )
  });

  return (
    <div style={styles.standupSection}>
      {standups}
    </div>
  )
};

// pass in standup data and render accordingly maybe also pass in active key
const GetStandupPanels = (standups, activeKey, standupCards) => {
  const panels = standups.map(function(standup) {
    const startDate = moment(standup.sessionStartedAt).format('MMMM Do YYYY, h:mm:ss');
    return <Panel header={startDate} key={standup.id}><StandupCards standupCards={standupCards} activeKey={activeKey}/></Panel>
  });
  
  return (
    panels
  );
};

class StandupArchive extends Component {

  constructor(props) {
    super(props);

    this.state = {
      standups: {},
      standupCards: Map(),
      activeKey: null,
    };

    this.onPanelChange = this.onPanelChange.bind(this);
  };

  componentWillReceiveProps() {
    const requestData = {
      repo: this.props.repo,
      owner: this.props.owner,
      id: this.props.team.id,
    };

    getTeamStandups(requestData).then(function(standups) {
      this.setState({
        standups: standups,
      });
    }.bind(this));
  };

  onPanelChange(activeKey) {
    if (activeKey) {
      const requestData = {
        repo: this.props.repo,
        owner: this.props.owner,
        id: this.props.team.id,
        standupId: activeKey,
      };

      let standupCards = this.state.standupCards;

      //check if we need to fetch, if we already have the data then exit
      if (standupCards.get(activeKey)) {
        this.setState({
          activeKey: activeKey,
        });
        return;
      }

      getStandupCards(requestData).then(function(cards) {
        standupCards = standupCards.set(activeKey, cards.data);
        this.setState({
          activeKey: activeKey,
          standupCards: standupCards,
        });
      }.bind(this));
      // do fetch and update state with standup data


    } else {
      this.setState({
        activeKey: activeKey,
      });
    }
  };

  render() {

    if (_.size(this.state.standups) === 0 || this.state.standups.count === 0) {
      return (
        <div style={styles.noStandupsHeading}>
          No Standups Found
        </div>
      )
    }

    return (
      <Collapse
        onChange={this.onPanelChange}
        activeKey={this.state.activeKey}
        accordion={true}
      >
        {GetStandupPanels(this.state.standups.data, this.state.activeKey, this.state.standupCards)}
      </Collapse>
    );
  };
}

export default StandupArchive;