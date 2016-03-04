import ReactDOMComponent from 'react/lib/ReactDOMComponent';
import ReactCurrentOwner from 'react/lib/ReactCurrentOwner';
import assign from 'react/lib/Object.assign';
import ReactPipelineChildReconciler from './ReactPipelineChildReconciler';

export default class ReactPipelineDOMComponent extends ReactDOMComponent {
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
