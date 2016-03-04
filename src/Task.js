import React from 'react';

// TODO: Remove .render necessity, will need to implement new ReactComponent
//       like ReactCompositeComponent:
//
// ReactCompositeComponent.mountComponent calls ->
//   ReactReconciler.mountComponent calls ->
//     ReactDOMComponent.mountComponent
//
// I think the key here is going to create my own ReactPipelineComponent and
// have ReactReconciler call ReactPipelineComponent instead of
// ReactDOMComponent. As of right now I'm unsure how I would go about this.

/**
 * Handles the execution of a task and it's children.
 * @class
 */
export default class Task extends React.Component {
  /**
   * Tasks require a pipeline context which corresponds to the root Pipeline
   * element; and they require a tasks context to register their run command.
   */
  static contextTypes = {
    pipeline: React.PropTypes.object.isRequired
  };

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
