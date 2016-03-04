import ReactCompositeComponent from 'react/lib/ReactCompositeComponent';
import assign from 'react/lib/Object.assign';

const ReactCompositeComponentMixin = ReactCompositeComponent.Mixin;

const ReactPipelineComponentMixin = {
  mountComponent: function (rootID, transaction, context) {
    const markup = ReactCompositeComponentMixin.mountComponent.call(this, rootID, transaction, context);
    const inst = this._instance;
    
    if (inst.componentWillExec) {
      inst.componentWillExec();
      // When mounting, calls to `setState` by `componentWillExec` will set
      // `this._pendingStateQueue` without triggering a re-render.
      if (this._pendingStateQueue) {
        inst.state = this._processPendingState(inst.props, inst.context);
      }
    }

    if (inst.componentDidExec) {
      transaction.getReactMountReady().enqueue(inst.componentDidExec, inst);
    }

    return markup;
  }
};

export default class ReactPipelineComponent {
  static Mixin = assign({}, ReactCompositeComponentMixin, ReactPipelineComponentMixin);
};
