import ReactServerRenderingTransaction from 'react/lib/ReactServerRenderingTransaction';

/**
 * Provides a `CallbackQueue` queue for collecting `onDOMReady` callbacks
 * during the performing of the transaction.
 */
const ON_DOM_READY_QUEUEING = {
  /**
   * Initializes the internal `onDOMReady` queue.
   */
  initialize: function () {
    this.reactMountReady.reset();
  },

  close: function () {
    this.reactMountReady.notifyAll();
  }
};

/**
 * Executed within the scope of the `Transaction` instance. Consider these as
 * being member methods, but with an implied ordering while being isolated from
 * each other.
 */
const TRANSACTION_WRAPPERS = [ON_DOM_READY_QUEUEING];

export default class ReactPipelineRenderingTransaction extends ReactServerRenderingTransaction {
  constructor(renderToStaticMarkup) {
    super(renderToStaticMarkup);
  }

  /**
   * @see Transaction
   * @abstract
   * @final
   * @return {array} Empty list of operation wrap procedures.
   */
  getTransactionWrappers() {
    return TRANSACTION_WRAPPERS;
  }
}
