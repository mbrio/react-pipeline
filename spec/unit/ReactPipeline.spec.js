jest.dontMock('../TestTask');
jest.dontMock('../helper');
jest.dontMock('../EmptyReactComponent');
jest.dontMock('../../package.json');

import React from 'react';

const ReactPipeline = require('../../src/ReactPipeline').default;
const Task = require('../../src/Task').default;
const TestTask = require('../TestTask').default;
const EmptyReactComponent = require('../EmptyReactComponent').default;
const pkg = require('../../package.json');

describe('PipelineElement', () => {
  /* Unfortunately needed for 100% code coverage */
  describe('cnstr', () => {
    it ('instantiates', () => {
      expect(new ReactPipeline()).toBeDefined();
    });
  });

  describe('version', () => {
    it ('should match the version in package.json', () => {
      expect(ReactPipeline.version).toBeDefined();
      expect(ReactPipeline.version).toBe(pkg.version);
    });
  });

  describe('start', () => {
    it('fails with invalid element', () => {
      function failing() { ReactPipeline.start({}); }

      expect(failing).toThrow();
    });

    it('fails with invalid element', () => {
      const prevEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      function failing() { ReactPipeline.start({}); }

      expect(failing).toThrow();
      process.env.NODE_ENV = prevEnv;
    });

    pit('executes empty pipeline', () => {
      const mockCallback = jest.genMockFunction();
      class InnerTask extends Task {
        componentDidExec = mockCallback
      }

      return ReactPipeline.start(<InnerTask/>)
        .then(() => {
          expect(mockCallback).toBeCalled();
        });
    });

    pit('executes dom components', () => {
      return ReactPipeline.start(<div/>);
    });

    describe('has child tasks', () => {
      pit('executes child tasks', () => {
        const mockCallback = jest.genMockFunction();
        return ReactPipeline.start(
          <Task><TestTask callback={mockCallback} /></Task>
        ).then(() => {
          expect(mockCallback).toBeCalled();
        });
      });

      pit('executes child tasks within dom components', () => {
        const mockCallback = jest.genMockFunction();
        return ReactPipeline.start(
          <div><TestTask callback={mockCallback} /></div>
        ).then(() => {
          expect(mockCallback).toBeCalled();
        });
      });

      pit('executes multiple levels of child tasks', () => {
        const mockCallback = jest.genMockFunction();
        return ReactPipeline.start(
          <Task><Task><TestTask callback={mockCallback} /></Task></Task>
        ).then(() => {
          expect(mockCallback).toBeCalled();
        });
      });

      pit('executes multiple levels of child tasks when parental element has no exec', () => {
        const mockCallback = jest.genMockFunction();
        return ReactPipeline.start(
          <Task>
            <EmptyReactComponent>
              <TestTask callback={mockCallback} />
            </EmptyReactComponent>
          </Task>
        ).then(() => {
          expect(mockCallback).toBeCalled();
        });
      });
    });
  });
});
