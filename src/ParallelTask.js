import React from 'react';
import TaskCollection from './TaskCollection';

export default class ParallelTask extends TaskCollection {
  async run() {
    await Promise.all(this.tasks.map(task => task()));
  }
}
