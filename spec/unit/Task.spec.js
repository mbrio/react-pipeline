jest.dontMock('../helper');
jest.dontMock('../TestTask');

import React from 'react';

const ReactPipeline = require('../../src/ReactPipeline').default;
const Task = require('../../src/Task').default;
const TestTask = require('../TestTask').default;

describe('Task', () => {
  describe('start', () => {
    pit('should execute exec', () => {
      const mockCallback = jest.genMockFunction().mockImplementation(() => {
        return Promise.resolve();
      });
      class InnerTestTask extends TestTask {
        exec() { return mockCallback(); }
      }

      return ReactPipeline.start(<Task><InnerTestTask /></Task>)
        .then(() => {
          expect(mockCallback).toBeCalled();
        });
    });
  });

  describe('parallelTasks', () => {
    it('executes child tasks in parallel', () => {
      const mockCallback = jest.genMockFunction();
      const sleeper = (dur) => {
        return () => {
          return new Promise((resolve) => {
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
      };

      return ReactPipeline.start(
        <Task parallelTasks={true}>
          <TestTask callback={sleeper(500)} />
          <TestTask callback={sleeper(100)} />
        </Task>
      ).then(() => {
        expect(mockCallback.mock.calls.length).toBe(2);
      });
    });
  });
  
  describe('render', () => {
    pit('should render basic content', () => {
      return ReactPipeline.start(<Task><Task><Task /></Task><Task /></Task>)
        .then(content => {
          expect(content).toBe('<div><div><div></div></div><div></div></div>');
        });
    });
  });
});
