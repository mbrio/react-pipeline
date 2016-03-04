import React from 'react';
import ReactNativeComponent from 'react/lib/ReactNativeComponent';

const ReactPipelineInjection = require('../../src/ReactPipelineInjection').default;
const ReactPipelineComponent = require('../../src/ReactPipelineComponent').default;

describe('ReactPipelineInjection', () => {
  describe('cnstr', () => {
    it('should instantiate', () => {
      expect(new ReactPipelineInjection()).toBeDefined();
    });
  });

  describe('inject', () => {
    it('should inject custom React configuration', () => {
      ReactPipelineInjection.inject();
      const c = ReactNativeComponent.createInternalComponent({
        type: 'div',
        props: {}
      });

      expect(c instanceof ReactPipelineComponent).toBe(true);
    });
  });
});
