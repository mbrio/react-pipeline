import React from 'react';
import instantiateReactComponent from 'react/lib/instantiateReactComponent'
import ReactDOMServer from 'react-dom/server';
import Pipeline from './src/Pipeline';
import TestTask from './src/TestTask';
import ParallelTask from './src/ParallelTask';
import Task from './src/Task';
import ReactPipeline from './src/ReactPipeline';

export default async function main() {
  await ReactPipeline.render(
    <Pipeline>
      <Task>
        <ParallelTask>
          <TestTask id={1} />
          <TestTask id={2} />
        </ParallelTask>
      </Task>
      <Task>
        <ParallelTask>
          <TestTask id={4} />
          <TestTask id={5} />
        </ParallelTask>
      </Task>
    </Pipeline>
  );
}
