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
          expect(mockCallback.mock.calls.length).toBe(3);
        });
    });
    
    pit('should execute with no children', () => {
      const mockCallback = jest.genMockFunction();

      class InnerTestTask extends Task {
        componentWillExec() {
          mockCallback();
        }
      }

      return ReactPipeline.start(<InnerTestTask />)
        .then(content => {
          expect(mockCallback).toBeCalled();
        });
    });

    pit('should execute from standard React element', () => {
      return ReactPipeline.start(<div />)
        .then(content => {
          expect(content).toBe('<div></div>');
        });
    });

    pit('should execute children from standard React element', () => {
      const mockCallback = jest.genMockFunction();

      class InnerTestTask extends Task {
        componentWillExec() {
          mockCallback();
        }
      }

      return ReactPipeline.start(<div><InnerTestTask /></div>)
        .then(content => {
          expect(mockCallback).toBeCalled();
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
          expect(mockCallback).toBeCalled();
        });
    });
  });
});
