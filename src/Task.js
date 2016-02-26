import React from 'react';
import Pipeline from './Pipeline';

export default class Task extends React.Component {
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

  async run() {
    throw new Error('The task must specify an async #run() method.');
  }

  componentWillMount() {
    this.context.tasks.enqueue(this.run.bind(this));
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}
