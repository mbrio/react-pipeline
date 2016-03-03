jest.dontMock('../../src');
jest.dontMock('../../src/ReactPipelineComponent');

import React from 'react';
import ReactNativeComponent from 'react/lib/ReactNativeComponent';

const ReactPipelineComponent = require('../../src/ReactPipelineComponent').default;

describe('ReactPipelineComponent', () => {
  describe('cnstr', () => {
    it('should instantiate', () => {
      expect(new ReactPipelineComponent('div')).toBeDefined();
    });
  });
});
