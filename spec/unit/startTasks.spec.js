import React from 'react';

const ReactPipeline = require('../../src/ReactPipeline').default;
const Task = require('../../src/Task').default;
const startTasks = require('../../src/startTasks').default;

describe('startTasks', () => {
  describe('start', () => {
    pit('ensure child properties are updated after tasks have completed', () => {
      const mockCallback = jest.genMockFunction();

      class ParentTask extends Task {
        state = {
          prevMessage: null
        };

        constructor(props, context) {
          super(props, context);
          this.handleComplete = ::this.handleComplete;
        }

        handleComplete(message) {
          this.setState({ prevMessage: message });
        }

        render() {
          return(
            <Task>
              <ChildTask onComplete={this.handleComplete} />
              <ChildTask message={this.state.prevMessage} />
            </Task>
          );
        }
      }

      class ChildTask extends Task {
        static propTypes = {
          message: React.PropTypes.string,
          onComplete: React.PropTypes.func
        };

        componentWillExec() {
          if (this.props.message) { mockCallback(this.props.message); }
        }

        exec() {
          if(this.props.onComplete) { this.props.onComplete('a message'); }
          return Promise.resolve();
        }
      }

      return ReactPipeline.start(<ParentTask />).then(() => {
        expect(mockCallback.mock.calls[0][0]).toBe('a message');
      });
    });

    describe('when there is a component instance', () => {
      pit('should update state before executing children', () => {
        const mockCallback = jest.genMockFunction();

        class ChildTask extends Task {
          componentWillMount() { mockCallback(this.props.serverUrl); }
          componentWillExec() { mockCallback(this.props.serverUrl); }

          exec() {
            mockCallback();
            return Promise.resolve();
          }
        }

        class ParentTask extends Task {
          state = { serverUrl: null };
          exec() {
            this.setState({serverUrl: 'example.com'});
            return Promise.resolve();
          }
          render() { return (<ChildTask serverUrl={this.state.serverUrl} />); }
        }

        return ReactPipeline.start(<ParentTask><div></div></ParentTask>).then(() => {
          expect(mockCallback.mock.calls.length).toBe(3);
          expect(mockCallback.mock.calls[0][0]).toBe(null);
          expect(mockCallback.mock.calls[1][0]).toBe('example.com');
        });
      });

      pit('should call componentWillExec if it exists on the instance', () => {
        const mockCallback = jest.genMockFunction();
        const mock = {
          _instance: { componentWillExec: mockCallback }
        };

        return startTasks.call(mock).then(() => {
          expect(mockCallback).toBeCalled();
        });
      });

      pit('should call exec if it exists on the instance', () => {
        const mockCallback = jest.genMockFunction()
          .mockImplementation(() => Promise.resolve());
        const mock = {
          _instance: { exec: mockCallback }
        };

        return startTasks.call(mock).then(() => {
          expect(mockCallback).toBeCalled();
        });
      });

      describe('when has no children', () => {
        describe('when exec is defined', () => {
          pit('should call componentDidExec if it exists on the instance', () => {
            const mockCallback = jest.genMockFunction();
            const mockExec = jest.genMockFunction()
              .mockImplementation(() => Promise.resolve());
            const mock = {
              _instance: {
                exec: mockExec,
                componentDidExec: mockCallback
              }
            };

            return startTasks.call(mock).then(() => {
              expect(mockCallback).toBeCalled();
              expect(mockExec).toBeCalled();
            });
          });
        });

        describe('when exec is not defined', () => {
          pit('should call componentDidExec if it exists on the instance', () => {
            const mockCallback = jest.genMockFunction();
            const mock = {
              _instance: {
                componentDidExec: mockCallback
              }
            };

            return startTasks.call(mock).then(() => {
              expect(mockCallback).toBeCalled();
            });
          });
        });

        describe('when run child tasks serially', () => {
          it('should reject', done => {
            const mockStart = jest.genMockFunction()
              .mockImplementation(() => Promise.reject(new Error('error')));
            const mock = {
              _renderedComponent: {
                _renderedChildren: {
                  test: {
                    _instance: { exec: mockStart }
                  }
                }
              },
              _instance: {
                props: { }
              }
            };

            startTasks.call(mock).then(() => {
              fail();
            }).catch(err => {
              expect(err.message).toBe('error');
              expect(mockStart).toBeCalled();
              done();
            });
          });

          pit('should run child tasks', () => {
            const mockStart = jest.genMockFunction()
              .mockImplementation(() => Promise.resolve());
            const mock = {
              _renderedComponent: {
                _renderedChildren: {
                  test: {
                    _instance: { exec: mockStart }
                  }
                }
              },
              _instance: {
                props: { }
              }
            };

            return startTasks.call(mock).then(() => {
              expect(mockStart).toBeCalled();
            });
          });

          pit('should call componentDidExec if it exists on the instance', () => {
            const mockCallback = jest.genMockFunction();
            const mockStart = jest.genMockFunction()
              .mockImplementation(() => Promise.resolve());
            const mock = {
              _renderedComponent: {
                _renderedChildren: {
                  test: {
                    _instance: { exec: mockStart }
                  }
                }
              },
              _instance: {
                props: {},
                componentDidExec: mockCallback
              }
            };

            return startTasks.call(mock).then(() => {
              expect(mockCallback).toBeCalled();
              expect(mockStart).toBeCalled();
            });
          });
        });

        describe('when run child tasks in parallel', () => {
          it('should reject', done => {
            const mockStart = jest.genMockFunction()
              .mockImplementation(() => Promise.reject(new Error('error')));
            const mock = {
              _renderedComponent: {
                _renderedChildren: {
                  test: {
                    _instance: { exec: mockStart }
                  }
                }
              },
              _instance: {
                props: { parallelTasks: true }
              }
            };

            startTasks.call(mock).then(() => {
              fail();
            }).catch(err => {
              expect(err.message).toBe('error');
              expect(mockStart).toBeCalled();
              done();
            });
          });

          pit('should run child tasks', () => {
            const mockStart = jest.genMockFunction()
              .mockImplementation(() => Promise.resolve());
            const mock = {
              _renderedComponent: {
                _renderedChildren: {
                  test: {
                    _instance: { exec: mockStart }
                  }
                }
              },
              _instance: {
                props: { parallelTasks: true }
              }
            };

            return startTasks.call(mock).then(() => {
              expect(mockStart).toBeCalled();
            });
          });

          pit('should run child tasks', () => {
            const mockStart = jest.genMockFunction()
              .mockImplementation(() => Promise.resolve());
            const mockCallback = jest.genMockFunction();
            const mock = {
              _renderedComponent: {
                _renderedChildren: {
                  test: {
                    _instance: { exec: mockStart }
                  }
                }
              },
              _instance: {
                props: { parallelTasks: true },
                componentDidExec: mockCallback
              }
            };

            return startTasks.call(mock).then(() => {
              expect(mockStart).toBeCalled();
              expect(mockCallback).toBeCalled();
            });
          });
        });
      });
    });

    describe('when there is no component instance', () => {
      describe('when has children', () => {
        describe('when run child tasks serially', () => {
          pit('should run child tasks', () => {
            const mockStart = jest.genMockFunction()
              .mockImplementation(() => Promise.resolve());
            const mock = {
              _renderedChildren: {
                test: {
                  _instance: { exec: mockStart }
                }
              }
            };

            return startTasks.call(mock).then(() => {
              expect(mockStart).toBeCalled();
            });
          });
        });

        describe('when run child tasks in parallel', () => {
          pit('should run child tasks', () => {
            const mockStart = jest.genMockFunction()
              .mockImplementation(() => Promise.resolve());
            const mock = {
              _renderedChildren: {
                test: {
                  _instance: { exec: mockStart }
                }
              }
            };

            return startTasks.call(mock).then(() => {
              expect(mockStart).toBeCalled();
            });
          });
        });
      });
    });
  });
});
