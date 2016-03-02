jest.dontMock('../../src');
jest.dontMock('../../src/PipelineElement');
jest.dontMock('../../src/ReactPipeline');
jest.dontMock('../../src/Task');
jest.dontMock('../../src/Pipeline');
jest.dontMock('../../src/ParallelTask');
jest.dontMock('../TestTask');
jest.dontMock('../ParallelTestTask');
jest.dontMock('../EmptyReactComponent');

import React from 'react';

const ReactPipeline = require('../../src/ReactPipeline').default;
const Task = require('../../src/Task').default;
const Pipeline = require('../../src/Pipeline').default;
const ParallelTask = require('../../src/ParallelTask').default;
const TestTask = require('../TestTask').default;
const ParallelTestTask = require('../ParallelTestTask').default;
const EmptyReactComponent = require('../EmptyReactComponent').default;

describe('ParallelTask', () => {
  describe('start', () => {
    it('executes own task', (done) => {
      const mockCallback = jest.genMockFunction();
      ReactPipeline.start(
        <Pipeline><ParallelTestTask callback={mockCallback} /></Pipeline>
      ).then(data => {
          expect(mockCallback.mock.calls.length).toBe(1);

          done();
        })
        .catch(fail);
    });

    it('executes child tasks in parallel', (done) => {
      const mockCallback = jest.genMockFunction();
      const sleeper = (dur) => {
        return () => {
          return new Promise((resolve, reject) => {
            expect(mockCallback).not.toBeCalled();

            setTimeout(() => {
              mockCallback();
              resolve();
            }, dur);

            if (setTimeout.mock.calls.length === 2) {
              jest.runOnlyPendingTimers();
            }
          });
        };
      }

      ReactPipeline.start(
        <Pipeline>
          <ParallelTask>
            <TestTask callback={sleeper(500)} />
            <TestTask callback={sleeper(100)} />
          </ParallelTask>
        </Pipeline>
      ).then(data => {
          expect(mockCallback.mock.calls.length).toBe(2);

          done();
        })
        .catch(fail);
    });
  });
});
