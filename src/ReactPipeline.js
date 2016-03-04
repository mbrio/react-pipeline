import RenderDOMServer from 'react-dom/server';
import ReactDefaultBatchingStrategy from 'react/lib/ReactDefaultBatchingStrategy';
import ReactElement from 'react/lib/ReactElement';
import ReactInstanceHandles from 'react/lib/ReactInstanceHandles';
import ReactMarkupChecksum from 'react/lib/ReactMarkupChecksum';
import ReactServerBatchingStrategy from 'react/lib/ReactServerBatchingStrategy';
import ReactPipelineRenderingTransaction from './ReactPipelineRenderingTransaction';
import ReactUpdates from 'react/lib/ReactUpdates';
import ReactInjection from 'react/lib/ReactInjection';
import ReactDOMComponent from 'react/lib/ReactDOMComponent';

import emptyObject from 'fbjs/lib/emptyObject';
import invariant from 'fbjs/lib/invariant';

import pkg from '../package.json';
import instantiatePipelineComponent from './instantiatePipelineComponent';
import ReactPipelineInjection from './ReactPipelineInjection';

ReactPipelineInjection.inject();

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
   * @return {Promise<string, Error>} the Promise associated with the Task tree
   *                                  execution, resolves to the rendered HTML
   */
  static start(element) {
    !ReactElement.isValidElement(element) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'start(): You must pass a valid ReactElement.') : invariant(false) : undefined;

    let transaction;
    try {
      ReactUpdates.injection
        .injectBatchingStrategy(ReactServerBatchingStrategy);

      const id = ReactInstanceHandles.createReactRootID();
      transaction = ReactPipelineRenderingTransaction.getPooled(true);

      return new Promise((resolve, reject) => {
        transaction.perform(function () {
          const componentInstance = instantiatePipelineComponent(element, null);
          const mountedComponent = componentInstance
          .mountComponent(id, transaction, emptyObject);

          return componentInstance.start(transaction, emptyObject)
          .then(() => {
            componentInstance.unmountComponent();
            return resolve(mountedComponent);
          })
          .catch(reject);
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
