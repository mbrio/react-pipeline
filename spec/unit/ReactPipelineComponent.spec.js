const ReactPipelineComponent = require('../../src/ReactPipelineComponent').default;

describe('ReactPipelineComponent', () => {
  /* Unfortunately needed for 100% code coverage */
  describe('cnstr', () => {
    it('instantiates', () => {
      expect(new ReactPipelineComponent()).toBeDefined();
    });
  });

  describe('Mixin', () => {
    it('should provide be defined', () => {
      expect(ReactPipelineComponent.Mixin.start).toBeDefined();
    });
  });
});
