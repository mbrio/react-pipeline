import React from 'react';
import TaskCollection from './TaskCollection';

export default class SeriesTask extends TaskCollection {
  async run() {
    for(let i = 0, j = this.tasks.length; i < j; i++) {
      const task = this.tasks[i];
      await task();
    }
  }
}
