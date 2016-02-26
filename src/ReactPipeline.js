import invariant from 'invariant';
import PipelineElement from './PipelineElement';
import RenderDOMServer from 'react-dom/server';

export default class ReactPipeline {
  static async render(element) {
    invariant(
      PipelineElement.isValidElement(element),
      'render(): You must pass a valid PipelineElement.'
    );

    const markup = RenderDOMServer.renderToStaticMarkup(element);
    await element.type.__pipeline.run();
  }
}
