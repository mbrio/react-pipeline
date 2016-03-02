jest.dontMock('../../lib');
jest.dontMock('../../src/PipelineElement');
jest.dontMock('../../src/ReactPipeline');
jest.dontMock('../../src/Task');
jest.dontMock('../../src/Pipeline');
jest.dontMock('../TestTask');
jest.dontMock('../EmptyReactComponent');

import React from 'react';

const ReactPipeline = require('../../src/ReactPipeline').default;
const Task = require('../../src/Task').default;
const Pipeline = require('../../src/Pipeline').default;
const TestTask = require('../TestTask').default;
const EmptyReactComponent = require('../EmptyReactComponent').default;

describe('PipelineElement', () => {
  describe('start', () => {
    it('fails with invalid element', () => {
      function failing() {
        ReactPipeline.start({});
      }

      expect(failing).toThrow();
    });

    it('fails with invalid child element', () => {
      function failing() {
        ReactPipeline.start(<Pipeline><EmptyReactComponent/></Pipeline>);
      }

      expect(failing).toThrow();
    });

    it('executes empty pipeline', (done) => {
      ReactPipeline.start(<Pipeline/>)
        .then(data => {
          expect(data).toBe('<div></div>');
          done();
        })
        .catch(fail);
    });

    it('executes child tasks', (done) => {
      const mockCallback = jest.genMockFunction();
      ReactPipeline.start(
        <Pipeline><TestTask callback={mockCallback} /></Pipeline>
      ).then(data => {
          expect(mockCallback.mock.calls.length).toBe(1);

          done();
        })
        .catch(fail);
    });

    it('executes multiple levels of child tasks', (done) => {
      const mockCallback = jest.genMockFunction();
      ReactPipeline.start(
        <Pipeline><Task><TestTask callback={mockCallback} /></Task></Pipeline>
      ).then(data => {
          expect(mockCallback.mock.calls.length).toBe(1);

          done();
        })
        .catch(fail);
    });
  });
});
