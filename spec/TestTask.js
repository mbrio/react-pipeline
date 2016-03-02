import React from 'react';
import Task from '../lib/Task';
import { callbackExec } from './helper';

export default class TestTask extends Task {
  static propTypes = {
    callback: React.PropTypes.func
  };

  handleSomething() {
    return callbackExec.call(this);
  }

  exec() {
    return this.handleSomething();
  }
}
