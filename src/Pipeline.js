import React from 'react';
import Task from './Task';

/**
 * The main pipeline component, all tasks must live under this component.
 * @class
 */
export default class Pipeline extends Task {
  /**
   * Provides context for this pipeline and it's tasks to it's children.
   */
  static childContextTypes = {
    pipeline: React.PropTypes.object.isRequired,
  };

  // Since this is the top level element we must override the required context
  // for a task. Since this component will define the pipeline context there
  // is no way it would require one being passed into it.
  static contextTypes = {};

  /**
   * Sets the child context. Initialized the pipeline context as itself for all
   * child components to consume.
   * @return {object} the child context.
   */
  getChildContext() {
    return { pipeline: this };
  }
}
