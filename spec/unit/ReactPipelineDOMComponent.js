import React from 'react';

const ReactPipeline = require('../../src/ReactPipeline').default;
const ReactPipelineDOMComponent = require('../../src/ReactPipelineDOMComponent').default;
const Task = require('../../src/Task').default;

describe('ReactPipelineDOMComponent', () => {
  describe('_reconcilerInstantiateChildren', () => {
    pit('should instantiate children', () => {
      let parentInst, childInst;

      class ParentTask extends Task {
        componentWillMount() {
          parentInst = this;
        }
      }

      class MountTask extends Task {
        componentWillMount() {
          childInst = this;
        }
      }

      return ReactPipeline.start(<ParentTask><MountTask /></ParentTask>)
        .then(content => {
          expect(parentInst).toBeDefined();
          expect(childInst).toBeDefined();
        });
    });

    pit('should instantiate children in production', () => {
      const origEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      let parentInst, childInst;

      class ParentTask extends Task {
        componentWillMount() {
          parentInst = this;
        }
      }

      class MountTask extends Task {
        componentWillMount() {
          childInst = this;
        }
      }

      return ReactPipeline.start(<ParentTask><MountTask /></ParentTask>)
        .then(content => {
          expect(parentInst).toBeDefined();
          expect(childInst).toBeDefined();
          process.env.NODE_ENV = origEnv;
        });
    });
  });
});
