
jest.dontMock('../TestTask');
jest.dontMock('../helper');
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
    it('should execute if defined on component', () => {
    });
  });
});
