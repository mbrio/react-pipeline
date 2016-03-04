import ReactInjection from 'react/lib/ReactInjection';
import ReactDefaultInjection from 'react/lib/ReactDefaultInjection';
import ReactPipelineDOMComponent from './ReactPipelineDOMComponent';

export default class ReactPipelineInjection {
  /**
   * This is identical to the same method found within
   * react/lib/ReactDefaultInjection, with the exception we are using own
   * custom ReactPipelineDOMComponent.
   */
  static inject() {
    ReactDefaultInjection.inject();
    ReactInjection.NativeComponent.injectGenericComponentClass(ReactPipelineDOMComponent);
  }
};
