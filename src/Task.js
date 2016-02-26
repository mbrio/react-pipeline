import React from 'react';
import Pipeline from './Pipeline';

export default class Task extends React.Component {
  static childContextTypes = {
    tasks: React.PropTypes.object.isRequired
  };

  static contextTypes = {
    pipeline: React.PropTypes.object.isRequired,
    tasks: React.PropTypes.object.isRequired
  };

  static propTypes = {
    children: function (props, propName, componentName) {
      let hasError = null;

      if (React.Children.count(props.children) === 1) {
        if (!(props.children.type.prototype instanceof this.constructor)) {
          hasError = new Error('Child found is not a Task');
        }
      } else if (React.Children.count(props.children) > 1) {
        props.children.forEach(c => {
          if (!(c.type.prototype instanceof this.constructor)) {
            hasError = new Error('Child found is not a Task');
          }
        });
      }

      return hasError;
    }
  };

  tasks = [];

  getChildContext() {
    return { tasks: this };
  }

  constructor(props, context) {
    super(props, context);

    if (context && context.tasks) {
      context.tasks.enqueue(this.run.bind(this));
    }
  }

  enqueue(task) {
    this.tasks.push(task);
  }

  async run() {
    for(let i = 0, j = this.tasks.length; i < j; i++) {
      const task = this.tasks[i];
      await task();
    }
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}
