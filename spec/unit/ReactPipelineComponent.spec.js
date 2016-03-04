import React from 'react';
import ReactNativeComponent from 'react/lib/ReactNativeComponent';

const ReactPipelineComponent = require('../../src/ReactPipelineComponent').default;
const Task = require('../../src/Task').default;

describe('ReactPipelineComponent', () => {
  it('should provide a mixin', () => {
    expect(ReactPipelineComponent.Mixin).toBeDefined();
  });
});
