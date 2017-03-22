import React, { Component } from 'react';

const styles = {
  visible: {
    display: "none",
  },
  invisible: {
    display: "block",
  },
}

export function LoadingHOC(WrappedComponent) {
  return class LoadingProxy extends Component {
    constructor(props) {
      super(props);
      this.setLoading = this.setLoading.bind(this);

      this.state = {
        loading: false,
      };
    };

    setLoading = (loading) => {
      this.setState({
        loading: loading,
      })
    };

    render() {
      return (
        <div>
          <div style={this.state.loading ? styles.visible : styles.invisible}></div>
          <WrappedComponent style={this.state.loading ? styles.invisible : styles.visible} {...this.props} setLoading={this.setLoading} />
        </div>
      )
    }
  }
}

export default LoadingHOC;