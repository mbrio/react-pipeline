import ReactInjection from 'react/lib/ReactInjection';
import ReactDefaultInjection from 'react/lib/ReactDefaultInjection';
import ReactPipelineDOMComponent from './ReactPipelineDOMComponent';

export default class ReactPipelineInjection {
  static inject() {
    ReactDefaultInjection.inject();
    ReactInjection.NativeComponent.injectGenericComponentClass(ReactPipelineDOMComponent);
  }
};
