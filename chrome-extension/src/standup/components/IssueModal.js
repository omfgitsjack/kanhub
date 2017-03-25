import React, { Component } from 'react';
import styles from '../styles/style';
import ReactModal from 'react-modal';

class IssueModal extends Component {

  constructor(props) {
    super(props);
  };

  componentWillMount() {
    ReactModal.setAppElement("body");
  };

  render() {
    return (
      <ReactModal
        contentLabel="issue-modal"
        isOpen={this.props.isIssueModalOpen}
        style={styles.modalStyle}
        onRequestClose={this.props.handleIssueModalClose}
      >
        <div>

        </div>
      </ReactModal>
    );
  };
}

export default IssueModal;