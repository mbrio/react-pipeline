import React from 'react'; //eslint-disable-line no-unused-vars

const ReactPipelineInjection = require('../../src/ReactPipelineInjection').default;

describe('PipelineInjection', () => {
  /* Unfortunately needed for 100% code coverage */
  describe('cnstr', () => {
    it ('instantiates', () => {
      expect(new ReactPipelineInjection()).toBeDefined();
    });
  });
});
