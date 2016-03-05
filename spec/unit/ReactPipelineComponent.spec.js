import React from 'react';

const ReactPipelineComponent = require('../../src/ReactPipelineComponent').default;
const ReactPipeline = require('../../src/ReactPipeline').default;
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
      expect(ReactPipelineComponent.Mixin.start).toBeDefined();
    });
  });
});
