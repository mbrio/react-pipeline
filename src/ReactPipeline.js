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

export default class ReactPipeline {
  static async run(element) {
    invariant(
      PipelineElement.isValidElement(element),
      'run(): You must pass a valid PipelineElement.'
    );

    let transaction;
    try {
      ReactUpdates.injection.injectBatchingStrategy(ReactServerBatchingStrategy);

      const id = ReactInstanceHandles.createReactRootID();
      transaction = ReactServerRenderingTransaction.getPooled(true);

      return new Promise((resolve, reject) => {
        transaction.perform(function () {
          const componentInstance = instantiateReactComponent(element, null);
          const mountedComponent = componentInstance.mountComponent(id, transaction, emptyObject);

          const inst = componentInstance._instance;

          inst.run()
            .then(() => resolve(mountedComponent))
            .catch(reject);
        }, null);
      });
    } finally {
      ReactServerRenderingTransaction.release(transaction);
      // Revert to the DOM batching strategy since these two renderers
      // currently share these stateful modules.
      ReactUpdates.injection.injectBatchingStrategy(ReactDefaultBatchingStrategy);
    }
  }
}
