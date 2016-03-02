jest.dontMock('../../lib-test');
jest.dontMock('../../lib-test/PipelineElement');
jest.dontMock('../../lib-test/Task');
jest.dontMock('../../lib-test/Pipeline');
jest.dontMock('../EmptyReactComponent');
jest.dontMock('../helper');
jest.dontMock('../TestTask');

import React from 'react';

const PipelineElement = require('../../lib-test/PipelineElement').default;
const Task = require('../../lib-test/Task').default;
const Pipeline = require('../../lib-test/Pipeline').default;
const EmptyReactComponent = require('../EmptyReactComponent').default;
const TestTask = require('../TestTask').default;

describe('PipelineElement', () => {
  describe('isValidElement', () => {
    it('instantiates', () => {
      expect(new PipelineElement()).toBeDefined();
    });

    it('fails validation with an object that is null', () => {
      expect(PipelineElement.isValidElement()).toBe(false);
      expect(PipelineElement.isValidElement(null)).toBe(false);
    });

    it('fails validation with an object that is not a pipeline element', () => {
      expect(PipelineElement.isValidElement({})).toBe(false);
      expect(PipelineElement.isValidElement(<EmptyReactComponent />))
        .toBe(false);
    });

    it('fails validation with a child object that is not a pipeline element', () => {
      expect(PipelineElement.isValidElement(<Pipeline><EmptyReactComponent /></Pipeline>))
        .toBe(false);
      expect(PipelineElement.isValidElement(
        <Pipeline><EmptyReactComponent /><EmptyReactComponent /></Pipeline>
      )).toBe(false);
    });

    it('succeeds validation with an object that is a pipeline element', () => {
      expect(PipelineElement.isValidElement(<Pipeline />)).toBe(true);
      expect(PipelineElement.isValidElement(<Task />)).toBe(true);
      expect(PipelineElement.isValidElement(<TestTask />)).toBe(true);
    });

    it('succeeds validation with a child object that is a pipeline element', () => {
      expect(PipelineElement.isValidElement(
        <Pipeline><Task /></Pipeline>
      )).toBe(true);
      expect(PipelineElement.isValidElement(
        <Pipeline><Task /><Task /></Pipeline>
      )).toBe(true);
    });
  });
});
