import React from 'react';
import instantiateReactComponent from 'react/lib/instantiateReactComponent'
import ReactDOMServer from 'react-dom/server';
import { ReactPipeline, Pipeline, ParallelTask } from './src';
import TestTask from './src/TestTask';

export default async function main() {
  await ReactPipeline.run(
    <Pipeline>
      <ParallelTask>
        <TestTask id={1} />
        <TestTask id={2} />
      </ParallelTask>
      <ParallelTask>
        <TestTask id={4} />
        <TestTask id={5} />
      </ParallelTask>
    </Pipeline>
  );
}
