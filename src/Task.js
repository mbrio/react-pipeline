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
