import React from 'react';
import Task from './Task';

export default class TaskCollection extends Task {
  static childContextTypes = {
    tasks: React.PropTypes.object.isRequired
  };

  tasks = [];

  getChildContext() {
    return { tasks: this };
  }

  enqueue(task) {
    this.tasks.push(task);
  }
}
