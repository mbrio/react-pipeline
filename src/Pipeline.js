import React from 'react';
import SeriesTask from './SeriesTask';

export default class Pipeline extends SeriesTask {
  static childContextTypes = Object.assign({}, SeriesTask.childContextTypes, {
    pipeline: React.PropTypes.object.isRequired
  });

  static contextTypes = {};
  static __pipeline = null;

  tasks = [];

  getChildContext() {
    return Object.assign({}, super.getChildContext(), {
      pipeline: this
    });
  }

  constructor() {
    super();

    Pipeline.__pipeline = this;
  }

  componentWillMount() {
  }
}
