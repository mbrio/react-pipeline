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
   * Provides context for it's child tasks. The tasks context is assigned to
   * itself so children can register their run command.
   *
   * When inheriting from Task and supplying a child context it is necessary
   * to ensure the new class supplies the tasks context.
   *
   * @example
   * // tasks: React.PropTypes.object.isRequired
   */
  static childContextTypes = {
    tasks: React.PropTypes.object.isRequired
  };

  /**
   * Tasks require a pipeline context which corresponds to the root Pipeline
   * element; and they require a tasks context to register their run command.
   */
  static contextTypes = {
    pipeline: React.PropTypes.object.isRequired,
    tasks: React.PropTypes.object.isRequired
  };

  /**
   * Child tasks to execute.
   */
  tasks = [];

  /**
   * The child context, set's the tasks context to itself.
   * @return {object} the child context
   */
  getChildContext() {
    return { tasks: this };
  }

  /**
   * Constructor for Task. Registers itself with it's tasks context.
   */
  constructor(props, context) {
    super(props, context);

    this.registerTask(context);
  }

  /**
   * Registers itself with it's tasks context.
   */
  registerTask(context) {
    // Register the Task's run method with it's parent tasks context.
    if (context && context.tasks) {
      context.tasks.enqueue(this.start.bind(this));
    }
  }

  /**
   * Pushes a function onto the child task list.
   */
  enqueue(task) {
    this.tasks.push(task);
  }

  /**
   * Starts the execution of the task. Handles executing all registered child
   * tasks. Inheritors should be careful about overriding this function as it
   * will effect the execution of registered child tasks. Executes it's own
   * run command prior to executing it's children's.
   * @return {Promise<undefined,Error>} The promise associated with the async
   *                                    tasks.
   */
  start() {
    return this.exec().then(() => {
      if (this.tasks.length > 0) {
        return this.tasks.reduce((cur, next) => {
          return cur.then(next);
        }, Promise.resolve());
      }
    });
  }

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
