import React from 'react';
import ParallelTask from '../src/ParallelTask';

export default class ParallelTestTask extends ParallelTask {
  static propTypes = {
    callback: React.PropTypes.func
  };

  handleSomething(e) {
    return new Promise ((resolve, reject) => {
      if (this.props.callback) {
        this.props.callback.call(this);
      }
      resolve();
    });
  }

  exec() {
    return this.handleSomething();
  }
}
