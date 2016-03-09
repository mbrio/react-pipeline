/**
 * Tricks React to not cache the specified component.
 *
 * @param {object} component The component to monkey patch
 */
function trickReactToNotCache(component) {
  if (component) {
    if (component._flags !== undefined) { component._flags = 1; }
    if (component._nativeNode !== undefined) { component._nativeNode = {}; }
    trickReactToNotCache(component._renderedComponent);
  }
}

/**
 * Gets all of the rendered children for the specified component.
 *
 * @param {object} component The parent component to retrieve children for
 * @return {object[]}
 */
function getChildren(component) {
  const children = [];
  let renderedChildren = component._renderedChildren;

  if (component._renderedComponent) {
    if (component._renderedComponent._instance && component._renderedComponent._instance.exec) {
      children.push(component._renderedComponent);
    } else if (component._renderedComponent._renderedChildren) {
      renderedChildren = component._renderedComponent._renderedChildren;
    }
  }

  if (renderedChildren) {
    for (let key in renderedChildren) {
      const child = renderedChildren[key];
      children.push(child);
    }
  }

  return children;
}

/**
 * Runs the task and each of it's children's tasks.
 *
 * It first runs it's own element's exec() method if one exists; when it's
 * own Promise resolves it runs each of it's child elements' through
 * startTasks() in series, unless the property parallelTasks is set to true on
 * it's * component instance, in which case they will run in parallel.
 *
 * Introduces two new lifecycle methods componentWillExec() and
 * componentDidExec(). If componentWillExec() is defined it will be called
 * before it's own exec() method is called. If componentDidExec() is defined
 * it will be called after it's own exec() method has resolved and after
 * each of it's child elements' have been run through startTasks() methods have
 * resolved.
 *
 * It's important to note that the startTasks() method is an internal construct
 * while exec(), componentWillExec(), and componentDidExec() are part of the
 * React component representing the task. An inheritor will never need to
 * implement a startTasks() method, and if they do it will never be called by
 * the internals of React Pipeline.
 * @return Promise
 */
export default function startTasks() {
  const inst = this._instance;
  const exec = inst && inst.exec ? inst::inst.exec : () => Promise.resolve();
  const forceUpdate = inst && inst.forceUpdate ? inst::inst.forceUpdate : (cb) => cb();
  const children = getChildren(this).map((c) => {
    trickReactToNotCache(c);
    return c;
  });

  if (inst && inst.componentWillExec) { inst.componentWillExec(); }

  return exec().then(() => {
    return new Promise((resolve, reject) => {
      forceUpdate(() => {
        if (children.length === 0) {
          if (inst && inst.componentDidExec) { inst.componentDidExec(); }
          return resolve();
        }

        if (inst && inst.props.parallelTasks === true) {
          Promise.all(children.map((c) => c::startTasks())).then(() => {
            if (inst && inst.componentDidExec) { inst.componentDidExec(); }
          }).then(resolve).catch(reject);
        } else {
          children.reduce((cur, next) => {
            return cur.then(next::startTasks);
          }, Promise.resolve()).then(() => {
            if (inst && inst.componentDidExec) { inst.componentDidExec(); }
          }).then(resolve).catch(reject);
        }
      });
    });
  });
}
