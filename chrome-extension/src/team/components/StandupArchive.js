import React, { Component } from 'react';
import styles from '../styles/style';
import moment from 'moment';
import _ from 'lodash';
import { getTeamStandups } from '../model/model';



class StandupArchive extends Component {

  constructor(props) {
    super(props);

    this.state = {
      standups: {},
    };
  };

  componentDidMount() {
    const requestData = {
      repo: this.props.repo,
      owner: this.props.owner,
      id: this.props.team.id,
    };

    getTeamStandups(requestData).then(function(standups) {
      console.log(standups);
      this.setState({
        standups: standups,
      });
    }.bind(this));
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
      <div>

      </div>
    );
  };
}

export default StandupArchive;