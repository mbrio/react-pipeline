import React from 'react';
import autobind from 'autobind-decorator';
import { ParallelTask } from '../lib';

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

  async exec() {
    await this.handleSomething();
  }
}
