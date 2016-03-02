jest.dontMock('../../lib-test');
jest.dontMock('../../lib-test/PipelineElement');
jest.dontMock('../../lib-test/ReactPipeline');
jest.dontMock('../../lib-test/Task');
jest.dontMock('../../lib-test/Pipeline');
jest.dontMock('../../lib-test/ParallelTask');
jest.dontMock('../TestTask');
jest.dontMock('../helper');
jest.dontMock('../ParallelTestTask');
jest.dontMock('../EmptyReactComponent');

import React from 'react';

const ReactPipeline = require('../../lib-test/ReactPipeline').default;
const Task = require('../../lib-test/Task').default;
const Pipeline = require('../../lib-test/Pipeline').default;
const ParallelTask = require('../../lib-test/ParallelTask').default;
const TestTask = require('../TestTask').default;
const ParallelTestTask = require('../ParallelTestTask').default;
const EmptyReactComponent = require('../EmptyReactComponent').default;

describe('ParallelTask', () => {
  describe('start', () => {
    pit('executes own task', () => {
      const mockCallback = jest.genMockFunction().mockImplementation(() => {
        return Promise.resolve();
      });
      const parallel = new ParallelTask({}, {});
      parallel.exec = mockCallback;
      return parallel.start().then(() => {
        expect(mockCallback.mock.calls.length).toBe(1);
      });
    });

    pit('executes child tasks in parallel', () => {
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

      return ReactPipeline.start(
        <Pipeline>
          <ParallelTask>
            <TestTask callback={sleeper(500)} />
            <TestTask callback={sleeper(100)} />
          </ParallelTask>
        </Pipeline>
      ).then(data => {
        expect(mockCallback.mock.calls.length).toBe(2);
      })
      .catch(fail);
    });
  });
});
