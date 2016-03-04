import ReactCompositeComponent from 'react/lib/ReactCompositeComponent';
import assign from 'react/lib/Object.assign';
import traverseAllChildren from 'react/lib/traverseAllChildren';

const ReactCompositeComponentMixin = ReactCompositeComponent.Mixin;

const ReactPipelineComponentMixin = {
  /**
   * Starts running the tasks for the component. it firsts runs it's own exec
   * method, when the method's Promise has completed it runs each of it's
   * children's start methods. If the component has a function componentWillExec
   * defined it will be called before it's own exec method is called. If the
   * component has a function componentDidExec defined it will be called after
   * it's own exec method is called and all of it's children's start Promises
   * are resolved.
   * @return Promise
   */
  start: function () {
    const inst = this._instance;

    if (inst.componentWillExec) {
      inst.componentWillExec();
      // When mounting, calls to `setState` by `componentWillExec` will set
      // `this._pendingStateQueue` without triggering a re-render.
      if (this._pendingStateQueue) {
        inst.state = this._processPendingState(inst.props, inst.context);
      }
    }

    const exec = inst.exec ? inst.exec.bind(inst) : () => Promise.resolve();

    return exec().then(() => {
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
