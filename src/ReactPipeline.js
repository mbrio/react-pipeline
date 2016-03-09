import ReactDefaultBatchingStrategy from 'react/lib/ReactDefaultBatchingStrategy';
import ReactDefaultInjection from 'react/lib/ReactDefaultInjection';
import ReactElement from 'react/lib/ReactElement';
import ReactInstanceHandles from 'react/lib/ReactInstanceHandles';
import ReactServerBatchingStrategy from 'react/lib/ReactServerBatchingStrategy';
import ReactPipelineRenderingTransaction from './ReactPipelineRenderingTransaction';
import ReactUpdates from 'react/lib/ReactUpdates';
import instantiateReactComponent from 'react/lib/instantiateReactComponent';

import emptyObject from 'fbjs/lib/emptyObject';
import invariant from 'fbjs/lib/invariant';

import pkg from '../package.json';
import startTasks from './startTasks';

ReactDefaultInjection.inject();

/**
 * Class for executing a React pipeline.
 * @class
 */
export default class ReactPipeline {
  /**
   * The version of ReactPipeline
   */
  static version = pkg.version;

  /**
   * Runs all of the tasks within the pipeline. This is very similar to the
   * server rendering that ships with React.
   * @param {ReactElement} element
   * @return {Promise} the Promise associated with the Task tree execution
   */
  static start(element) {
    /* istanbul ignore next */
    !ReactElement.isValidElement(element) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'start(): You must pass a valid ReactElement.') : invariant(false) : undefined;

    let transaction;
    /* istanbul ignore next */
    try {
      ReactUpdates.injection
        .injectBatchingStrategy(ReactServerBatchingStrategy);

      const id = ReactInstanceHandles.createReactRootID();
      transaction = ReactPipelineRenderingTransaction.getPooled(true);

      return new Promise((resolve, reject) => {
        transaction.perform(function () {
          const componentInstance = instantiateReactComponent(element, null);
          componentInstance.mountComponent(id, transaction, emptyObject);

          startTasks.call(componentInstance)
          .then(() => {
            componentInstance.unmountComponent();
            resolve();
          }).catch(reject);
        }, null);
      });
    } finally {
      ReactPipelineRenderingTransaction.release(transaction);
      // Revert to the DOM batching strategy since these two renderers
      // currently share these stateful modules.
      ReactUpdates.injection
        .injectBatchingStrategy(ReactDefaultBatchingStrategy);
    }
  }
}
