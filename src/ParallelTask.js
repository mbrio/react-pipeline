import React from 'react';
import Task from './Task';

/**
 * A task that executes it's children in parallel as opposed to in series.
 * @class
 */
export default class ParallelTask extends Task {
  /**
   * Run's all of the child tasks in parallel
   * @return {Promise<undefined,Error>} the promise associated with the async
   *                                    task.
   */
  async start() {
    await this.exec();
    await Promise.all(this.tasks.map(task => task()));
  }
}
