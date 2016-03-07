import assign from 'react/lib/Object.assign';
import traverseAllChildren from 'react/lib/traverseAllChildren';

export default {
  /**
   * Runs the task and each of it's children's tasks.
   *
   * It first runs it's own element's exec() method if one exists; when it's
   * own Promise resolves it runs each of it's child elements' start()
   * methods in series, unless the property parallelTasks is set to true on it's
   * component instance, in which case they will run in parallel.
   *
   * Introduces two new lifecycle methods componentWillExec() and
   * componentDidExec(). If componentWillExec() is defined it will be called
   * before it's own exec() method is called. If componentDidExec() is defined
   * it will be called after it's own exec() method has resolved and after
   * each of it's child elements' start() methods have resolved.
   *
   * It's important to note that the start() method is an internal construct
   * while exec(), componentWillExec(), and componentDidExec() are part of the
   * React component representing the task. An inheritor will never need to
   * implement a start() method, and if they do it will never be called by the
   * internals of React Pipeline.
   * @return Promise
   */
  start: function () {
    const inst = this._instance;

    if (inst && inst.componentWillExec) {
      inst.componentWillExec();
    }

    const exec = inst && inst.exec ? inst.exec.bind(inst) : () => Promise.resolve();

    return exec().then(() => {
      const children = [];
      let renderedChildren = this._renderedChildren;
     
      if (this._renderedComponent) {
        if (this._renderedComponent._instance && this._renderedComponent._instance.exec) {
          children.push(this._renderedComponent);
        } else if (this._renderedComponent._renderedChildren) {
          renderedChildren = this._renderedComponent._renderedChildren;
        }
      }

      if (renderedChildren) {
        for (let key in renderedChildren) {
          const child = renderedChildren[key];
          children.push(child);
        }
      }

      if (children.length === 0) {
        if (inst && inst.componentDidExec) { inst.componentDidExec(); }
        return Promise.resolve();
      }

      if (inst && inst.props.parallelTasks === true) {
        return Promise.all(children.map((c) => c.start())).then(() => {
          if (inst && inst.componentDidExec) { inst.componentDidExec(); }
        });
      } else {
        return children.reduce((cur, next) => {
          return cur.then(next.start.bind(next));
        }, Promise.resolve()).then(() => {
          if (inst && inst.componentDidExec) { inst.componentDidExec(); }
        })
      }
    });
  }
};
