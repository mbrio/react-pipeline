import ReactCompositeComponent from 'react/lib/ReactCompositeComponent';
import assign from 'react/lib/Object.assign';
import ReactPipelineStartMixin from './ReactPipelineStartMixin';

const ReactCompositeComponentMixin = ReactCompositeComponent.Mixin;

export default class ReactPipelineComponent {
  static Mixin = assign({}, ReactCompositeComponentMixin, ReactPipelineStartMixin);
}
