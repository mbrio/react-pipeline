import React from 'react';
import ReactNativeComponent from 'react/lib/ReactNativeComponent';

const ReactPipelineComponent = require('../../src/ReactPipelineComponent').default;
const Task = require('../../src/Task').default;

describe('ReactPipelineComponent', () => {
  /* Unfortunately needed for 100% code coverage */
  describe('cnstr', () => {
    it('instantiates', () => {
      expect(new ReactPipelineComponent()).toBeDefined();
    });
  });

  describe('Mixin', () => {
    it('should provide be defined', () => {
      expect(ReactPipelineComponent.Mixin).toBeDefined();
    });
  });
});
