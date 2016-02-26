import React from 'react';
import Task from './Task';

export default class ParallelTask extends Task {
  async run() {
    await Promise.all(this.tasks.map(task => task()));
  }
}
