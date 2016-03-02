jest.dontMock('../../lib-test');
jest.dontMock('../../lib-test/PipelineElement');
jest.dontMock('../../lib-test/ReactPipeline');
jest.dontMock('../../lib-test/Task');
jest.dontMock('../../lib-test/Pipeline');
jest.dontMock('../helper');
jest.dontMock('../TestTask');

import React from 'react';

const ReactPipeline = require('../../lib-test/ReactPipeline').default;
const Task = require('../../lib-test/Task').default;
const Pipeline = require('../../lib-test/Pipeline').default;
const TestTask = require('../TestTask').default;

describe('Pipeline', () => {
  describe('childContext', () => {
    pit('contains pipeline property that inherits from Pipeline', () => {
      function callback() {
        expect(this.context.pipeline).toBeDefined();
        expect(this.context.pipeline instanceof Pipeline).toBe(true);
      };

      return ReactPipeline.start(
        <Pipeline><TestTask callback={callback} /></Pipeline>
      );
    });

    pit('contains tasks property that inherits from Pipeline', () => {
      function callback() {
        expect(this.context.tasks).toBeDefined();
        expect(this.context.tasks instanceof Pipeline).toBe(true);
      };

      return ReactPipeline.start(
        <Pipeline><TestTask callback={callback} /></Pipeline>
      );
    });
  });
});
