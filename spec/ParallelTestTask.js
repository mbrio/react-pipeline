import React from 'react';
import ParallelTask from '../lib/ParallelTask';
import { callbackExec } from './helper';

export default class ParallelTestTask extends ParallelTask {
  static propTypes = {
    callback: React.PropTypes.func
  };

  handleSomething(e) {
    return callbackExec.call(this);
  }

  exec() {
    return this.handleSomething();
  }
}
