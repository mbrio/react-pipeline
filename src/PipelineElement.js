import React from 'react';
import ReactElement from 'react/lib/ReactElement';
import Task from './Task';

export default class PipelineElement {
  static isValidElement(element) {
    if (!ReactElement.isValidElement(element)) { return false; }

    let hasError = false;
    const childrenCount = React.Children.count(element.props.children);

    if (childrenCount === 1) {
      if (!PipelineElement.isValidElement(element.props.children)) { hasError = true; }
    } else if (childrenCount > 1) {
      element.props.children.forEach(c => {
        if (!PipelineElement.isValidElement(c)) { hasError = true; }
      });
    }

    return !hasError && (element.type.prototype instanceof Task || element.type === Task);
  }
}
