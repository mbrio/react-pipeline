export function callbackExec() {
  return new Promise ((resolve, reject) => {
    if (this.props.callback) {
      const result = this.props.callback.call(this);
      if (result && typeof result.then === 'function') {
        result.then(resolve).catch(reject);
      } else {
        resolve();
      }
    } else {
      resolve();
    }
  });
}
