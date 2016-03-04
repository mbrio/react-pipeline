import React from 'react';
import Task from './Task';

/**
 * A task that executes it's children in parallel as opposed to in series.
 * @class
 */
export default class ParallelTask extends Task {
  /**
   * Sets the default value for the parallelTasks property to true
   */
  static defaultProps = {
    parallelTasks: true
  };
}
