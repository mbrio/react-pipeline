import ReactCompositeComponent from 'react/lib/ReactCompositeComponent';
import assign from 'react/lib/Object.assign';

const ReactCompositeComponentMixin = ReactCompositeComponent.Mixin;

const ReactPipelineComponentMixin = {
};

export default class ReactPipelineComponent {
  static Mixin = assign({}, ReactCompositeComponentMixin, ReactPipelineComponentMixin);
};
