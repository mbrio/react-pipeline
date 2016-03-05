import React from 'react';
import ReactNativeComponent from 'react/lib/ReactNativeComponent';

const ReactPipelineComponent = require('../../src/ReactPipelineComponent').default;
const instantiatePipelineComponent = require('../../src/instantiatePipelineComponent');
const Task = require('../../src/Task').default;

/**
 * A note about unit tests for this file, the source code supplied in this
 * version is a copy from the raw react code with only a single line changed
 * so that instantiations use our custom mixin. I will not build tests for
 * code that is already tested within the react package.
 */
describe('instantiatePipelineComponent', () => {
  it('should use custom mixin', () => {
    const c = instantiatePipelineComponent(<Task />, null);
    expect(c._instantiateReactComponent).toBe(instantiatePipelineComponent);;
  });

  it('should use custom mixin', () => {
    const c = instantiatePipelineComponent(<Task />, null);
    expect(c._instantiateReactComponent).toBe(instantiatePipelineComponent);;
    expect(c.start).toBeDefined();
  });
});
