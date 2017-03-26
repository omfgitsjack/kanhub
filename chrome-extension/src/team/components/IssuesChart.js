import React, { Component } from 'react';
import styles from '../styles/style';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import moment from 'moment';
import _ from 'lodash';

class IssuesChart extends Component {

  constructor(props) {
    super(props);
  };

  render() {

    let acc = {};
    let i = 0;
    for (i ; i < this.props.daysSince; i++) {
      acc[moment().subtract(i, 'd').format('MM-DD')] = {open: 0, closed: 0};
    }


    const data = _.reduce(this.props.issues.toArray(), function(graphData, issue) {
      if (!issue['created_at'] && !issue['closed_at']) {
        return graphData;
      }

      let issueDate = 'created_at';
      if (issue['state'] === 'closed') {
        issueDate = 'closed_at';
      }

      if (moment(issue[issueDate]).isAfter(moment().subtract(this.props.daysSince, 'd'))) {
        const date = moment(issue[issueDate]).format('MM-DD');
        if (issue['state'] === 'open') {
          graphData[date].open ++;
        } else if (issue['state'] === 'closed') {
          graphData[date].closed ++;
        }
      }

      return graphData;
    }.bind(this), acc);

    const pointData = _.keys(data).map(function(key) {
      return {name: key, open: data[key].open, closed: data[key].closed};
    });

    return (
      <ResponsiveContainer width='90%' height={200}>
        <LineChart data={pointData.reverse()} margin={{top: 20, right:0, left:0, bottom: 10}}>
          <XAxis dataKey='name'/>
          <YAxis/>
          <Tooltip/>
          <Line type='monotone' dataKey='open' stroke='#87ff75'/>
          <Line type='monotone' dataKey='closed' stroke='#ff6060'/>
        </LineChart>
      </ResponsiveContainer>
    );
  };
}

export default IssuesChart;