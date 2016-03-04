jest.dontMock('../EmptyReactComponent');
jest.dontMock('../helper');
jest.dontMock('../TestTask');

import React from 'react';

const PipelineElement = require('../../src/PipelineElement').default;
const Task = require('../../src/Task').default;
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
      expect(PipelineElement.isValidElement(<Task><EmptyReactComponent /></Task>))
        .toBe(false);
      expect(PipelineElement.isValidElement(
        <Task><EmptyReactComponent /><EmptyReactComponent /></Task>
      )).toBe(false);
    });

    it('succeeds validation with an object that is a pipeline element', () => {
      expect(PipelineElement.isValidElement(<Task />)).toBe(true);
      expect(PipelineElement.isValidElement(<TestTask />)).toBe(true);
    });

    it('succeeds validation with a child object that is a pipeline element', () => {
      expect(PipelineElement.isValidElement(
        <Task><Task /></Task>
      )).toBe(true);
      expect(PipelineElement.isValidElement(
        <Task><Task /><Task /></Task>
      )).toBe(true);
    });
  });
});
