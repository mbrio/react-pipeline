import React from 'react';
import ReactElement from 'react/lib/ReactElement';
import Task from './Task';

/**
 * Validates a pipeline element.
 * @class
 */
export default class PipelineElement {
  /**
   * Determines whether the element is a valid pipeline element. In this case
   * it means that it is a valid ReactElement and it inherits from Task, and
   * that all of it's children are too.
   * @param {?object} element
   * @return {boolean} True if the element is valid otherwise false
   * @final
   */
  static isValidElement(element) {
    if (!ReactElement.isValidElement(element)) { return false; }
    if (!(element.type.prototype instanceof Task || element.type === Task)) {
      return false;
    }

    let hasError = false;
    const childrenCount = React.Children.count(element.props.children);

    if (childrenCount === 1) {
      if (!PipelineElement.isValidElement(element.props.children)) {
        hasError = true;
      }
    } else if (childrenCount > 1) {
      element.props.children.forEach(c => {
        if (!PipelineElement.isValidElement(c)) { hasError = true; }
      });
    }

    return !hasError;
  }
}
