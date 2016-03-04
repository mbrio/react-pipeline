import react from 'react';
import ReactCompositeComponent from 'react/lib/ReactCompositeComponent';
import assign from 'react/lib/Object.assign';

const ReactPipelineComponentMixin = assign({}, ReactCompositeComponent.Mixin);

export default {
  Mixin: ReactPipelineComponentMixin
};
