jest.dontMock('../../lib/PipelineElement');
jest.dontMock('../../lib/Task');
jest.dontMock('../../lib/Pipeline');
jest.dontMock('../EmptyReactComponent');

import React from 'react';

const PipelineElement = require('../../lib/PipelineElement').default;
const Task = require('../../lib/Task').default;
const Pipeline = require('../../lib/Pipeline').default;
const EmptyReactComponent = require('../EmptyReactComponent').default;

describe('PipelineElement', () => {
  describe('isValidElement', () => {
    it('fails validation with an object that is null', () => {
      expect(PipelineElement.isValidElement()).toBe(false);
      expect(PipelineElement.isValidElement(null)).toBe(false);
    });

    it('fails validation with an object that is not a pipeline element', () => {
      expect(PipelineElement.isValidElement({})).toBe(false);
      expect(PipelineElement.isValidElement(<EmptyReactComponent />)).toBe(false);
    });

    it('succeeds validation with an object that is a pipeline element', () => {
      expect(PipelineElement.isValidElement(<Pipeline />)).toBe(true);
      expect(PipelineElement.isValidElement(<Task />)).toBe(true);
    });
  });
});


// expect(true).toBe(true);
//   await ReactPipeline.run(
//     <Pipeline>
//       <ParallelTask>
//         <TestTask id={1} />
//         <TestTask id={2} />
//       </ParallelTask>
//       <ParallelTask>
//         <TestTask id={4} />
//         <TestTask id={5} />
//       </ParallelTask>
//     </Pipeline>
//   );
