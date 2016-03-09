import React from 'react';

export default class EmptyReactComponent extends React.Component {
  static propTypes = {
    children: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.node),
      React.PropTypes.node
    ])
  };

  render() {
    return (<div>{this.props.children}</div>);
  }
}
