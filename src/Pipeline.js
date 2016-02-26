import React from 'react';
import Task from './Task';

export default class Pipeline extends Task {
  static childContextTypes = {
    pipeline: React.PropTypes.object.isRequired,
    tasks: React.PropTypes.object.isRequired
  };

  static contextTypes = {};

  static __pipeline = null;

  getChildContext() {
    return {
      pipeline: this,
      tasks: this
    };
  }

  constructor(props, context) {
    super(props, context);
    Pipeline.__pipeline = this;
  }
}
