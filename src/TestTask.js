import React from 'react';
import autobind from 'autobind-decorator';
import Task from './Task';

export default class TestTask extends Task {
  @autobind
  handleSomething(e) {
    console.log('test', this.props.id);
  }

  async run() {
    const method = this.handleSomething;

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        method();
        resolve();
      }, 5000);
    });
  }
}
