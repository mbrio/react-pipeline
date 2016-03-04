import ReactDOMComponent from 'react/lib/ReactDOMComponent';
import ReactCurrentOwner from 'react/lib/ReactCurrentOwner';
import assign from 'react/lib/Object.assign';
import ReactPipelineChildReconciler from './ReactPipelineChildReconciler';

export default class ReactPipelineDOMComponent extends ReactDOMComponent {
  /**
   * This is a duplicate of the same method found with
   * react/lib/ReactMultiChild, the only difference is we are using the
   * ReactPipelineChildReconciler for instantiation.
   */
  _reconcilerInstantiateChildren(nestedChildren, transaction, context) {
    if (process.env.NODE_ENV !== 'production') {
      if (this._currentElement) { try {
          ReactCurrentOwner.current = this._currentElement._owner;
          return ReactPipelineChildReconciler.instantiateChildren(nestedChildren, transaction, context);
        } finally {
          ReactCurrentOwner.current = null;
        }
      }
    }
    return ReactPipelineChildReconciler.instantiateChildren(nestedChildren, transaction, context);
  }
};
