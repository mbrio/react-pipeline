import ReactCompositeComponent from 'react/lib/ReactCompositeComponent';
import assign from 'react/lib/Object.assign';
import traverseAllChildren from 'react/lib/traverseAllChildren';

const ReactCompositeComponentMixin = ReactCompositeComponent.Mixin;

const ReactPipelineComponentMixin = {
  start: function (transaction, context) {
    const inst = this._instance;

    if (inst.componentWillExec) {
      inst.componentWillExec();
      // When mounting, calls to `setState` by `componentWillExec` will set
      // `this._pendingStateQueue` without triggering a re-render.
      if (this._pendingStateQueue) {
        inst.state = this._processPendingState(inst.props, inst.context);
      }
    }

    return inst.exec().then(() => {
      const children = [];
      for (let key in this._renderedComponent._renderedChildren) {
        const child = this._renderedComponent._renderedChildren[key];
        children.push(child);
      }

      if (children.length === 0) {
        if (inst.componentDidExec) { inst.componentDidExec(); }
        return Promise.resolve();
      }

      if (inst.props.parallelTasks === true) {
        return Promise.all(children.map((c) => c.start())).then(() => {
          if (inst.componentDidExec) { inst.componentDidExec(); }
        });
      } else {
        return children.reduce((cur, next) => {
          return cur.then(next.start.bind(next));
        }, Promise.resolve()).then(() => {
          if (inst.componentDidExec) { inst.componentDidExec(); }
        })
      }
    });
  }
};

export default class ReactPipelineComponent {
  static Mixin = assign({}, ReactCompositeComponentMixin, ReactPipelineComponentMixin);
};
