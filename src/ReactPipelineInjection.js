import react from 'React';
import ReactDefaultInjection from 'react/lib/ReactDefaultInjection';
import ReactInjection from 'react/lib/ReactInjection';
import ReactPipelineComponent from './ReactPipelineComponent';

export default class ReactPipelineInjection {
  static inject() {
    ReactDefaultInjection.inject();

    ReactInjection.NativeComponent
      .injectGenericComponentClass(ReactPipelineComponent);
  }
}
