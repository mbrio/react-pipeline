import ReactChildReconciler from 'react/lib/ReactChildReconciler';
import traverseAllChildren from 'react/lib/traverseAllChildren';
import warning from 'fbjs/lib/warning';
import assign from 'react/lib/Object.assign';
import instantiatePipelineComponent from './instantiatePipelineComponent';

function instantiateChild(childInstances, child, name) {
  // We found a component instance.
  var keyUnique = childInstances[name] === undefined;
  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_ENV !== 'production' ? warning(keyUnique, 'flattenChildren(...): Encountered two children with the same key, ' + '`%s`. Child keys must be unique; when two children share a key, only ' + 'the first child will be used.', name) : undefined;
  }
  if (child != null && keyUnique) {
    childInstances[name] = instantiatePipelineComponent(child, null);
  }
}

const ReactPipelineChildReconciler = assign({}, ReactChildReconciler, {
  /**
   * Generates a "mount image" for each of the supplied children. In the case
   * of `ReactDOMComponent`, a mount image is a string of markup.
   *
   * This is identical to the same method found within
   * react/lib/ReactChildReconciler, with the exception we are using our own
   * custom instantiatePipelineComponent method.
   *
   * @param {?object} nestedChildNodes Nested child maps.
   * @return {?object} A set of child instances.
   * @internal
   */
  instantiateChildren: function (nestedChildNodes) {
    if (nestedChildNodes == null) {
      return null;
    }
    var childInstances = {};
    traverseAllChildren(nestedChildNodes, instantiateChild, childInstances);
    return childInstances;
  }
});

export default ReactPipelineChildReconciler;
