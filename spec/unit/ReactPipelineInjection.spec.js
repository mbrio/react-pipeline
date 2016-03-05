import React from 'react';

const ReactPipelineInjection = require('../../src/ReactPipelineInjection').default;

describe('PipelineInjection', () => {
  /* Unfortunately needed for 100% code coverage */
  describe('cnstr', () => {
    it ('instantiates', () => {
      expect(new ReactPipelineInjection()).toBeDefined();
    });
  });
});
