jest.dontMock('../../src');
jest.dontMock('../../src/PipelineElement');
jest.dontMock('../../src/ReactPipeline');
jest.dontMock('../../src/Task');
jest.dontMock('../../src/Pipeline');
jest.dontMock('../helper');
jest.dontMock('../TestTask');

import React from 'react';

const ReactPipeline = require('../../src/ReactPipeline').default;
const Task = require('../../src/Task').default;
const Pipeline = require('../../src/Pipeline').default;
const TestTask = require('../TestTask').default;

describe('Task', () => {
  describe('childContext', () => {
    pit('contains tasks property that inherits from Task, but not necessarily Pipeline', () => {
      const callback = jest.genMockFunction().mockImplementation(function () {
        expect(this.context.tasks).toBeDefined();
        expect(this.context.tasks instanceof Task).toBe(true);
        expect(this.context.tasks instanceof Pipeline).not.toBe(true);
      });

      return ReactPipeline.start(
        <Pipeline><Task><TestTask callback={callback} /></Task></Pipeline>
      ).then(() => {
        expect(callback).toBeCalled();
      });
    });
  });

  describe('context', () => {
    pit('contains tasks property that inherits from Task', () => {
      const callback = jest.genMockFunction().mockImplementation(function () {
        expect(this.context.tasks).toBeDefined();
        expect(this.context.tasks instanceof Task).toBe(true);
      });

      return ReactPipeline.start(
        <Pipeline><Task><TestTask callback={callback} /></Task></Pipeline>
      ).then(() => {
        expect(callback).toBeCalled();
      });
    });

    pit('contains pipeline property that inherits from Pipeline', () => {
      const callback = jest.genMockFunction().mockImplementation(function () {
        expect(this.context.pipeline).toBeDefined();
        expect(this.context.pipeline instanceof Pipeline).toBe(true);
      });

      return ReactPipeline.start(
        <Pipeline><Task><TestTask callback={callback} /></Task></Pipeline>
      ).then(() => {
        expect(callback).toBeCalled();
      });
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
      const task = new TestTask({}, {});

      task.registerTask();
      expect(mockContext.enqueue).not.toBeCalled();

      task.registerTask(null);
      expect(mockContext.enqueue).not.toBeCalled();

      task.registerTask({});
      expect(mockContext.enqueue).not.toBeCalled();
    });

    it('registers start with parental task manager if valid context', () => {
      const mockContext = { enqueue: jest.genMockFunction() };
      const task = new TestTask({}, {});

      task.registerTask({ tasks: mockContext });
      expect(mockContext.enqueue).toBeCalled();
    });
  });
 
  describe('enqueue', () => {
    it('adds a function to the task queue', () => {
      const mockCallback = jest.genMockFunction();
      const task = new TestTask({}, {});

      expect(task.tasks.length).toBe(0);
      task.enqueue(mockCallback);
      expect(task.tasks.length).toBe(1);
    });
  });
 
  describe('start', () => {
    describe('componentWillExec', () => {
      it('should execute if defined on component', () => {
        const mockCallback = jest.genMockFunction();
        const task = new TestTask({}, {});

        task.componentWillExec = mockCallback;
        task.start();

        expect(mockCallback).toBeCalled();
      });
    });

    describe('componentDidExec', () => {
      pit('should execute if defined on component', () => {
        const mockCallback = jest.genMockFunction();
        const task = new TestTask({}, {});

        task.componentDidExec = mockCallback;
        return task.start().then(() => {
          expect(mockCallback).toBeCalled();
        });
      });

      pit('should execute if defined on component', () => {
        const mockCallback = jest.genMockFunction();
        const task = new TestTask({}, {});

        task.enqueue(mockCallback);
        task.componentDidExec = mockCallback;
        return task.start().then(() => {
          expect(mockCallback.mock.calls.length).toBe(2);
        });
      });
    });

    pit('should execute exec', () => {
      const mockCallback = jest.genMockFunction().mockImplementation(() => {
        return Promise.resolve();
      });
      const task = new TestTask({}, {});

      task.exec = mockCallback;
      return task.start().then(() => {
        expect(mockCallback).toBeCalled();
      });
    });

    pit('should execute queued tasks', () => {
      const mockCallback = jest.genMockFunction();
      const task = new TestTask({}, {});

      task.enqueue(mockCallback);
      return task.start().then(() => {
        expect(mockCallback).toBeCalled();
      });
    });
  });

  describe('render', () => {
    pit('should render basic content', () => {
      return ReactPipeline.start(<Pipeline><Task /></Pipeline>)
        .then(content => {
          expect(content).toBe('<div><div></div></div>');
        });
    });
  });
});
