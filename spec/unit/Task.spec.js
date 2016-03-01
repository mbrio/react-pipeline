jest.dontMock('../../lib');
jest.dontMock('../../lib/PipelineElement');
jest.dontMock('../../lib/ReactPipeline');
jest.dontMock('../../lib/Task');
jest.dontMock('../../lib/Pipeline');
jest.dontMock('../TestTask');

import React from 'react';

const ReactPipeline = require('../../lib/ReactPipeline').default;
const Task = require('../../lib/Task').default;
const Pipeline = require('../../lib/Pipeline').default;
const TestTask = require('../TestTask').default;

describe('Task', () => {
  describe('childContext', () => {
    it('contains tasks property that inherits from Task, but not necessarily Pipeline', (done) => {
      function callback() {
        expect(this.context.tasks).toBeDefined();
        expect(this.context.tasks instanceof Task).toBe(true);
        expect(this.context.tasks instanceof Pipeline).not.toBe(true);
        done();
      };

      ReactPipeline.start(
        <Pipeline><Task><TestTask callback={callback} /></Task></Pipeline>
      );
    });
  });

  describe('context', () => {
    it('contains tasks property that inherits from Task', (done) => {
      function callback() {
        expect(this.context.tasks).toBeDefined();
        expect(this.context.tasks instanceof Task).toBe(true);
        done();
      };

      ReactPipeline.start(
        <Pipeline><Task><TestTask callback={callback} /></Task></Pipeline>
      );
    });

    it('contains pipeline property that inherits from Pipeline', (done) => {
      function callback() {
        expect(this.context.pipeline).toBeDefined();
        expect(this.context.pipeline instanceof Pipeline).toBe(true);
        done();
      };

      ReactPipeline.start(
        <Pipeline><Task><TestTask callback={callback} /></Task></Pipeline>
      );
    });
  });

  describe('Task', () => {
    it('registers start with parental task manager', () => {
      const mockContext = { enqueue: jest.genMockFunction() };
      const task = new TestTask({}, { tasks: mockContext });

      expect(mockContext.enqueue).toBeCalled();
    });
  });
  
  describe('registerTask', () => {
    it('does not register start with parental task manager if invalid context', () => {
      const mockContext = { enqueue: jest.genMockFunction() };
      const task = new TestTask();

      task.registerTask();
      expect(mockContext.enqueue).not.toBeCalled();
      
      task.registerTask(null);
      expect(mockContext.enqueue).not.toBeCalled();

      task.registerTask({});
      expect(mockContext.enqueue).not.toBeCalled();
    });

    it('registers start with parental task manager if valid context', () => {
      const mockContext = { enqueue: jest.genMockFunction() };
      const task = new TestTask();

      task.registerTask({ tasks: mockContext });
      expect(mockContext.enqueue).toBeCalled();
    });
  });
  
  describe('enqueue', () => {
    it('adds a function to the task queue', () => {
      const mockCallback = jest.genMockFunction();
      const task = new TestTask();

      expect(task.tasks.length).toBe(0);
      task.enqueue(mockCallback);
      expect(task.tasks.length).toBe(1);
    });
  });
  
  describe('start', () => {
    describe('componentWillExec', () => {
      it('should execute if defined on component', () => {
        const mockCallback = jest.genMockFunction();
        const task = new TestTask();

        task.componentWillExec = mockCallback;
        task.start();
        
        expect(mockCallback).toBeCalled();
      });
    });
    
    describe('componentDidExec', (done) => {
      it('should execute if defined on component', () => {
        const mockCallback = jest.genMockFunction();
        const task = new TestTask();

        task.componentDidExec = mockCallback;
        task.start().then(() => {
          expect(mockCallback).toBeCalled();
          done();
        });
      });
    });

    it('should execute exec', () => {
      const mockCallback = jest.genMockFunction();
      const task = new TestTask();

      task.exec = mockCallback;
      task.start();
      
      expect(mockCallback).toBeCalled();
    });

    it('should execute queued tasks', () => {
      const mockCallback = jest.genMockFunction();
      const task = new TestTask();

      task.enqueue(mockCallback);
      task.start().then(() => {
        expect(mockCallback).toBeCalled();
      });
    });
  });

  describe('render', () => {
    it('should render basic content', (done) => {
      ReactPipeline.start(<Pipeline><Task /></Pipeline>)
        .then(content => {
          expect(content).toBe('<div><div></div></div>');
          done();
        });
    });
  });
});
