jest.dontMock('../../lib');
jest.dontMock('../../lib/PipelineElement');
jest.dontMock('../../lib/ReactPipeline');
jest.dontMock('../../lib/Task');
jest.dontMock('../../lib/Pipeline');
jest.dontMock('../TestTask');

import React from 'react';

const ReactPipeline = require('../../lib/ReactPipeline').default;
const Pipeline = require('../../lib/Pipeline').default;
const TestTask = require('../TestTask').default;

describe('PipelineElement', () => {
  describe('run', () => {
    it('fails with invalid element', (done) => {
      ReactPipeline.run({})
        .then(fail)
        .catch(done);
    });

    it('executes empty pipeline', (done) => {
      ReactPipeline.run(<Pipeline/>)
        .then(data => {
          expect(data).toBe('<div></div>');
          done();
        })
        .catch(fail);
    });

    it('executes child tasks', async (done) => {
      ReactPipeline.run(<Pipeline><TestTask/></Pipeline>)
        .then(data => {
          expect(data).toBe('<div><div></div></div>');
          done();
        })
        .catch(fail);
    });
  });
});
