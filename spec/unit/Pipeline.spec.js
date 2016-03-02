jest.dontMock('../../lib');
jest.dontMock('../../lib/PipelineElement');
jest.dontMock('../../lib/ReactPipeline');
jest.dontMock('../../lib/Task');
jest.dontMock('../../lib/Pipeline');
jest.dontMock('../helper');
jest.dontMock('../TestTask');

import React from 'react';

const ReactPipeline = require('../../lib/ReactPipeline').default;
const Task = require('../../lib/Task').default;
const Pipeline = require('../../lib/Pipeline').default;
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
