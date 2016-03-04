import React from 'react';

const ReactPipelineComponent = require('../../src/ReactPipelineComponent').default;
const ReactPipeline = require('../../src/ReactPipeline').default;
const Task = require('../../src/Task').default;

describe('ReactPipelineComponent', () => {
  /* Unfortunately needed for 100% code coverage */
  describe('cnstr', () => {
    it('instantiates', () => {
      expect(new ReactPipelineComponent()).toBeDefined();
    });
  });

  describe('Mixin', () => {
    it('should provide be defined', () => {
      expect(ReactPipelineComponent.Mixin).toBeDefined();
    });
  });

  describe('componentWillExec', () => {
    pit('should execute if defined on component', () => {
      const mockCallback = jest.genMockFunction();

      class InnerTestTask extends Task {
        componentWillExec() {
          mockCallback();
        }
      }

      return ReactPipeline.start(
        <Task>
          <InnerTestTask />
          <InnerTestTask>
            <InnerTestTask />
          </InnerTestTask>
        </Task>
      )
        .then(content => {
          expect(content).toBe('<div><div></div><div><div></div></div></div>');
          expect(mockCallback.mock.calls.length).toBe(3);
        });
    });
    
    pit('should update state', () => {
      const mockCallback = jest.genMockFunction();
      const message = 'Hello, World!';
      let _instance;

      class InnerTestTask extends Task {
        componentWillExec() {
          _instance = this;
          this.setState({ message });
          mockCallback();
        }
      }

      return ReactPipeline.start(<Task><InnerTestTask /></Task>)
        .then(content => {
          expect(content).toBe('<div><div></div></div>');
          expect(mockCallback).toBeCalled();
          expect(_instance.state.message).toBe(message);
        });
    });
  });

  describe('componentDidExec', () => {
    pit('should execute if defined on component', () => {
      const mockCallback = jest.genMockFunction();
      class InnerTestTask extends Task {
        componentDidExec() {
          mockCallback();
        }
      }

      return ReactPipeline.start(<Task><InnerTestTask /></Task>)
        .then(content => {
          expect(content).toBe('<div><div></div></div>');
          expect(mockCallback).toBeCalled();
        });
    });
  });
});
