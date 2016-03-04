import React from 'react';

/**
 * Defines a task, is able to run it's children tasks in series or parallel.
 * @class
 */
export default class Task extends React.Component {
  /**
   * You can make all tasks run in parallel if the property parallelTasks is
   * set to true.
   */
  static propTypes = {
    parallelTasks: React.PropTypes.bool
  };

  /**
   * The task's main execution function. Inheritors should override this
   * method in order to add task functionality.
   * @return {Promise<undefined,Error>} The promise associated with the async
   *                                    task.
   */
  exec() {
    return Promise.resolve();
  }

  /**
   * Necessary for compatibility with server renderer.
   */
  render() {
    return <div>{this.props.children}</div>;
  }
}
