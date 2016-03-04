jest.dontMock('../helper');
jest.dontMock('../TestTask');

import React from 'react';

const ReactPipeline = require('../../src/ReactPipeline').default;
const Task = require('../../src/Task').default;
const Pipeline = require('../../src/Pipeline').default;
const TestTask = require('../TestTask').default;

describe('Task', () => {
  describe('context', () => {
    pit('contains pipeline property that inherits from Pipeline', () => {
      const callback = jest.genMockFunction().mockImplementation(function () {
        expect(this.context.pipeline).toBeDefined();
        expect(this.context.pipeline instanceof Pipeline).toBe(true);
      });

      return ReactPipeline.start(
        <Pipeline><Task><TestTask callback={callback} /></Task></Pipeline>
      ).then(() => {
        expect(callback).toBeCalled();
      });
    });
  });

  describe('start', () => {
    pit('should execute exec', () => {
      const mockCallback = jest.genMockFunction().mockImplementation(() => {
        return Promise.resolve();
      });
      class InnerTestTask extends TestTask {
        exec() { return mockCallback(); }
      }

      return ReactPipeline.start(<Pipeline><InnerTestTask /></Pipeline>)
        .then(content => {
          expect(mockCallback).toBeCalled();
        });
    });
  });
  
  describe('render', () => {
    pit('should render basic content', () => {
      return ReactPipeline.start(<Pipeline><Task><Task /></Task><Task /></Pipeline>)
        .then(content => {
          expect(content).toBe('<div><div><div></div></div><div></div></div>');
        });
    });
  });
});
