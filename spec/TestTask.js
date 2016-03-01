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
        this.props.callback();
      }
      resolve();
    });
  }

  async exec() {
    await this.handleSomething();
  }
}
