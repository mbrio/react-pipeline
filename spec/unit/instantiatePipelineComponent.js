import React from 'react';
import ReactNativeComponent from 'react/lib/ReactNativeComponent';

const ReactPipelineComponent = require('../../src/ReactPipelineComponent').default;
const instantiatePipelineComponent = require('../../src/instantiatePipelineComponent');
const Task = require('../../src/Task').default;

describe('instantiatePipelineComponent', () => {
  it('should use custom mixin', () => {
    const c = instantiatePipelineComponent(<Task />, null);
    expect(c._instantiateReactComponent).toBe(instantiatePipelineComponent);;
  });
});
