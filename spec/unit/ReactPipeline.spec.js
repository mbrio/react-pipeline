jest.dontMock('../../lib');
jest.dontMock('../../lib/PipelineElement');
jest.dontMock('../../lib/ReactPipeline');
jest.dontMock('../../lib/Task');
jest.dontMock('../../lib/Pipeline');
jest.dontMock('../TestTask');
jest.dontMock('../EmptyReactComponent');

import React from 'react';

const ReactPipeline = require('../../lib/ReactPipeline').default;
const Task = require('../../lib/Task').default;
const Pipeline = require('../../lib/Pipeline').default;
const TestTask = require('../TestTask').default;
const EmptyReactComponent = require('../EmptyReactComponent').default;

describe('PipelineElement', () => {
  describe('start', () => {
    it('fails with invalid element', (done) => {
      ReactPipeline.start({})
        .then(fail)
        .catch(err => {
          expect(err.message).toMatch(/start\(\)/);
          expect(err.message).toMatch(/valid/);
          done();
        });
    });

    it('fails with invalid child element', (done) => {
      ReactPipeline.start(<Pipeline><EmptyReactComponent/></Pipeline>)
        .then(fail)
        .catch(err => {
          expect(err.message).toMatch(/start\(\)/);
          expect(err.message).toMatch(/valid/);
          done();
        });
    });

    it('executes empty pipeline', (done) => {
      ReactPipeline.start(<Pipeline/>)
        .then(data => {
          expect(data).toBe('<div></div>');
          done();
        })
        .catch(fail);
    });

    it('executes child tasks', async (done) => {
      const mockCallback = jest.genMockFunction();
      ReactPipeline.start(
        <Pipeline><TestTask callback={mockCallback} /></Pipeline>
      ).then(data => {
          expect(data).toBe('<div><div></div></div>');
          expect(mockCallback.mock.calls.length).toBe(1);

          done();
        })
        .catch(fail);
    });

    it('executes multiple levels of child tasks', async (done) => {
      const mockCallback = jest.genMockFunction();
      ReactPipeline.start(
        <Pipeline><Task><TestTask callback={mockCallback} /></Task></Pipeline>
      ).then(data => {
          expect(data).toBe('<div><div><div></div></div></div>');
          expect(mockCallback.mock.calls.length).toBe(1);

          done();
        })
        .catch(fail);
    });
  });
});
