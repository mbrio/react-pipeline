import React from 'react';

/**
 * Defines a task, is able to run it's children tasks in series or parallel.
 * A task does not need to inherit from this class, it can be any React
 * component. If the component has an exec method then it will be executed, but
 * one is not required to process each of it's children. If the component
 * defines it's own render method it should ensure that it's children are
 * rendered, otherwise it's children's tasks will not run.
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
