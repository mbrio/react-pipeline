import React from 'react';

const ReactPipeline = require('../../src/ReactPipeline').default;
const Task = require('../../src/Task').default;

describe('ReactPipelineRenderingTransaction', () => {
  describe('getTransactionWrappers', () => {
    pit('should execute all lifecycle methods', () => {
      const mockFn = jest.genMockFunction();
      class MountTask extends Task {
        componentDidMount = mockFn;
        componentWillMount = mockFn;
        componentWillUnmount = mockFn;
      }

      return ReactPipeline.start(<Task><MountTask /></Task>)
        .then(() => {
          expect(mockFn.mock.calls.length).toBe(3);
        });
    });
  });
});
