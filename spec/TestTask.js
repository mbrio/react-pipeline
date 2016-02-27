import React from 'react';
import autobind from 'autobind-decorator';
import { Task } from '../lib';

export default class TestTask extends Task {
  handleSomething(e) {
    return new Promise ((resolve, reject) => {
      console.log('test', this.props.id);
      resolve();
    });
  }

  async run() {
    await this.handleSomething();
  }
}
