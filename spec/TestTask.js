import React from 'react';
import autobind from 'autobind-decorator';
import { Task } from '../lib';

export default class TestTask extends Task {
  static propTypes = {
    callback: React.PropTypes.func
  };

  handleSomething(e) {
    return new Promise ((resolve, reject) => {
      if (this.props.callback) {
        const result = this.props.callback.call(this);
        if (result && typeof result.then === 'function') {
          result.then(resolve).catch(reject);
        } else {
          resolve();
        }
      } else {
        resolve();
      }
    });
  }

  async exec() {
    await this.handleSomething();
  }
}
