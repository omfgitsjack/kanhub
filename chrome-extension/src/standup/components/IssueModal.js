import React, { Component } from 'react';
import styles from '../styles/style';
import ReactModal from 'react-modal';
import { UserCard } from '../../github_elements/elements';
import { TeamSection } from '../../team/components/components';
import $ from 'jquery';

export const IssueSection = (props) => {
  
  const assignees = props.issue.assignees.map(function(assignee, i) {
    return <UserCard key={i} user={assignee} />;
  });


  return (
    <div style={styles.issueSection}>
      <div className="gh-header js-details-container Details js-socket-channel js-updatable-content issue">
        <div className="gh-header-show">
          <h1 className="gh-header-title">
            <span className="js-issue-title">
              {props.issue.title}
            </span>
            <span className="gh-header-number">
              {'#' + props.issue.number}
            </span>
          </h1>
        </div>
        <div style={styles.metaHeader} className="gh-header-meta">
          <div className={"state state-" + props.issue.state}>{props.issue.state}</div>
        </div>
        <p className="lead">{props.issue.body}</p>
      </div>
      <TeamSection heading="Assignees">

      </TeamSection>
    </div>
  );
}

class IssueModal extends Component {

  constructor(props) {
    super(props);
  };

  componentWillMount() {
    ReactModal.setAppElement("body");
    let t = document.createElement("div");
    t.id = "test-frame";
    t.style.width = "1000px";
    t.style.height = "700px";
    document.body.appendChild(t);
    $('#test-frame').load('https://github.com/UTSCC09/omfgitsklampz/issues/25', function() {
      console.log("ASDASD");
    });

    console.log("123");
  };

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.isIssueModalOpen !== this.props.isIssueModalOpen;
  };

  render() {

    return (
      <ReactModal
        contentLabel="issue-modal"
        isOpen={this.props.isIssueModalOpen}
        style={styles.modalStyle}
        onRequestClose={this.props.handleIssueModalClose}
      >
        {this.props.issue ? 
        <div>
          <IssueSection issue={this.props.issue} />
        </div> :
        <div>
          Oops something went wrong...
        </div>}
      </ReactModal>
    );
  };
}

export default IssueModal;