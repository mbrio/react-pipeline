jest.dontMock('../TestTask');
jest.dontMock('../helper');
jest.dontMock('../EmptyReactComponent');
jest.dontMock('../../package.json');

import React from 'react';

const ReactPipeline = require('../../src/ReactPipeline').default;
const Task = require('../../src/Task').default;
const Pipeline = require('../../src/Pipeline').default;
const TestTask = require('../TestTask').default;
const EmptyReactComponent = require('../EmptyReactComponent').default;
const pkg = require('../../package.json');

describe('PipelineElement', () => {
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

    pit('executes empty pipeline', () => {
      return ReactPipeline.start(<Pipeline/>)
        .then(data => {
          expect(data).toBe('<div></div>');
        });
    });

    pit('executes child tasks', () => {
      const mockCallback = jest.genMockFunction();
      return ReactPipeline.start(
        <Pipeline><TestTask callback={mockCallback} /></Pipeline>
      ).then(data => {
        expect(mockCallback.mock.calls.length).toBe(1);
      });
    });

    pit('executes multiple levels of child tasks', () => {
      const mockCallback = jest.genMockFunction();
      return ReactPipeline.start(
        <Pipeline><Task><TestTask callback={mockCallback} /></Task></Pipeline>
      ).then(data => {
        expect(mockCallback.mock.calls.length).toBe(1);
      });
    });
  });
});
