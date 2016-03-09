jest.mock('../../src/ReactPipelineChildReconciler');

const ReactPipelineDOMComponent = require('../../src/ReactPipelineDOMComponent').default;
const ReactPipelineChildReconciler = require('../../src/ReactPipelineChildReconciler').default;

describe('ReactPipelineDOMComponent', () => {
  describe('_reconcilerInstantiateChildren', () => {
    it('should call our custom instantiateChildren method', () => {
      const context = {};
     
      ReactPipelineDOMComponent.prototype
        ._reconcilerInstantiateChildren.call(context);
      expect(ReactPipelineChildReconciler.instantiateChildren).toBeCalled();
    });

    it('should call our custom instantiateChildren method', () => {
      const context = { _currentElement: { _owner: {} } };
     
      ReactPipelineDOMComponent.prototype
        ._reconcilerInstantiateChildren.call(context);
      expect(ReactPipelineChildReconciler.instantiateChildren).toBeCalled();
    });

    it('should call our custom instantiateChildren method', () => {
      const prevEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      const context = { _currentElement: { _owner: {} } };
      
      ReactPipelineDOMComponent.prototype
        ._reconcilerInstantiateChildren.call(context);
      expect(ReactPipelineChildReconciler.instantiateChildren).toBeCalled();

      process.env.NODE_ENV = prevEnv;
    });
  });
});
