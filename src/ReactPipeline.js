import PipelineElement from './PipelineElement';
import RenderDOMServer from 'react-dom/server';
import ReactDefaultBatchingStrategy from 'react/lib/ReactDefaultBatchingStrategy';
import ReactElement from 'react/lib/ReactElement';
import ReactInstanceHandles from 'react/lib/ReactInstanceHandles';
import ReactMarkupChecksum from 'react/lib/ReactMarkupChecksum';
import ReactServerBatchingStrategy from 'react/lib/ReactServerBatchingStrategy';
import ReactServerRenderingTransaction from 'react/lib/ReactServerRenderingTransaction';
import ReactUpdates from 'react/lib/ReactUpdates';

import emptyObject from 'fbjs/lib/emptyObject';
import instantiateReactComponent from 'react/lib/instantiateReactComponent';
import invariant from 'fbjs/lib/invariant';

/**
 * Class for executing a React pipeline.
 * @class
 */
export default class ReactPipeline {
  /**
   * Runs all of tasks within the pipeline. This is identical to the server
   * rendering that ships with React, with the addition of the start function.
   * I've modelled the run execution in the way componentWillMount is called.
   * Unlike componentDidMount, componentWillMount is not added to the queueu,
   * it's just executed directly within the component.
   * @param {ReactElement} element
   * @return {Promise<string, Error>} the Promise associated with the Task tree
   *                                  execution, resolves to the rendered HTML
   */
  static start(element) {
    invariant(
      PipelineElement.isValidElement(element),
      'start(): You must pass a valid PipelineElement.'
    );

    let transaction;
    try {
      ReactUpdates.injection
        .injectBatchingStrategy(ReactServerBatchingStrategy);

      const id = ReactInstanceHandles.createReactRootID();
      transaction = ReactServerRenderingTransaction.getPooled(true);

      return new Promise((resolve, reject) => {
        transaction.perform(function () {
          const componentInstance = instantiateReactComponent(element, null);
          const mountedComponent = componentInstance
            .mountComponent(id, transaction, emptyObject);

          const inst = componentInstance._instance;
          // Execute the tasks
          inst.start()
            .then(() => resolve(mountedComponent))
            .catch(reject);
        }, null);
      });
    } finally {
      ReactServerRenderingTransaction.release(transaction);
      // Revert to the DOM batching strategy since these two renderers
      // currently share these stateful modules.
      ReactUpdates.injection
        .injectBatchingStrategy(ReactDefaultBatchingStrategy);
    }
  }
}
