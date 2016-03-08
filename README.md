# React Pipeline

A task execution pipeline described in JSX.

[![Build Status](https://api.travis-ci.org/mbrio/react-pipeline.svg?branch=master)](https://travis-ci.org/mbrio/react-pipeline)

## Install

```
$ npm install --save react react-pipeline
```

## Example

An example application can be found at
[react-pipeline-example](https://github.com/mbrio/react-pipeline-example).

## Versions

React Pipeline uses semver and will match the versioning of React so developers
know what version to install for their version of React. The exception is React
Pipeline's major version will match React's minor version. At the time of this
writing React is version 0.14.7, this would correspond to 14.7.0 in React
Pipeline. When React releases version 15, they will be migrating their minor
version to major, at which time React Pipeline will match the exactly.

## Roadmap

- Simplify internal API futher. This means that developers should rely on the
  two exported classes that React Pipeline makes available to be stable, but
  any internal classes that are not expored by index.js to be considered
  volatile.
- Update to React v15
- Utilize the `render()` method to output a visual representation
  of the pipeline. This could be used to generate administrative interfaces or
  to visualize the currently executing tasks.

## Introduction

React Pipeline consists of two exported classes, `Task` and `ReactPipeline`.

`Task` is an example class wired with everything available for use within
`ReactPipeline` including a standard `render()` method, an empty `exec()` method
and a `parallelTasks` property.

The `ReactPipeline` class has one static method, `start()`, which starts all of
the tasks. It is important to note that while the `exec()` method is
asynchronous, `ReactPipeline` will default to running each of the child tasks in
series. If a developer wants to run the tasks in parallel, the parental
component must have a property `parallelTasks` set to `true`.

```
import ReactPipeline, { Task } from 'react-pipeline';

// Run tasks in series
ReactPipeline.start(
  <Task>
    <Task />
    <Task />
  </Task>
);

// Run tasks in parallel
ReactPipeline.start(
  <Task parallelTasks={true}>
    <Task />
    <Task />
  </Task>
);
```

The `Task` component is a standard React component configured to be used within
React Pipeline. The pipeline can use any React component, but only components
with an `exec()` method will be run during execution.

In order to implement your task's functionality you need only inherit from
`Task` and override the `exec()` method.  The `exec()` method must return a
Promise.

```
import { Task } from 'react-pipeline';

export default class PauseTask extends Task {
  exec() {
    const duration = this.props.duration || 1000;

    return new Promise((resolve, reject) {
      setTimeout(resolve, duration);
    });
  }
}
```

If inheriting from Task and overriding `render()`, or starting from scratch with
your own component and implementing `render()`, it is very important, if you are
supporting child tasks, to ensure `render()` outputs it's `this.props.children`.
If child tasks are not executing it is because your component is not rendering
it's children.

```
class AwesomeClass {
  exec() {
    return Promise.resolve();
  }

  render() {
    return <div>{this.props.children}</div>
  }
}
```

`Task` objects can have any number of children and their tasks will run in
series once the parent's task is complete. The exception to this rule is when
setting the property `parallelTasks` to `true`, each of it's children's tasks
will be run in parallel.

```
ReactPipeline.start(
  <Task>
    <CreateAWSServer>
      <Geocoding input={rawPath} output={geoPath} />
      <RunPig script={resolveScript} input={geoPath} output={resolvePath} />
      <RunPig script={joinScript} input={resolvePath} output={joinPath} />
      <RunSpark script={mlScript} input={joinPath} output={mlPath} />
      <Task parallelTasks={true}>
        <Upload input={joinPath} output={joinDestination} />
        <Upload input={mlPath} output={mlDestination} />
      </Task>
      <Email to={adminEmail} subject={subject} body="pipeline complete" />
    </CreateAWSServer>
  </Task>
);
```

In the example above the pipeline describes a series of (theoretical) tasks.
The outcome of those tasks are as follows:

- Create an AWS server and pass it's server context onto it's children (after v2
  I would hope this information is passed down via properties instead)
- Download city information from google and output the data to a location
- Resolve the city location with the user profiles
- Join the user profiles with a larger data set
- Run a machine learning algorithm on the joined profile data
- IN PARALLEL
  - Upload the profile data to a location
  - Upload the results of the machine learning to a location
- Email the admin that the pipeline has completed

When creating a custom task it is possible to embed child tasks within it to
create a reusable group of tasks. Using the above example we could combine the
tasks into a reusable group.

```
class GroupTask extends Task {
  render() {
    return (
      <CreateAWSServer>
        <Geocoding input={rawPath} output={geoPath} />
        <RunPig script={resolveScript} input={geoPath} output={resolvePath} />
        <RunPig script={joinScript} input={resolvePath} output={joinPath} />
        <RunSpark script={mlScript} input={joinPath} output={mlPath} />
        <Task parallelTasks={true}>
          <Upload input={joinPath} output={joinDestination} />
          <Upload input={mlPath} output={mlDestination} />
        </Task>
        <Email to={adminEmail} subject={subject} body="pipeline complete" />
        {this.props.children}
      </CreateAWSServer>
    );
  }
}

ReactPipeline.start(
  <GroupTask>
    <LamdaTask />
  </GroupTask>
);
```

The above example combines the previous examples functionality into a reusable
group, and allows for additional tasks to be added after all of it's tasks are
complete.

Finally, when running tasks in series, it is possible to update the properties
on uncompleted tasks by setting the state in the parent. This could be useful
if you are planning on piping the result of one task to the next. This is only
reliable when running tasks in series.

```
class ParentTask extends Task {
  state = {
    lastResult: null
  }

  handleComplete(result) {
    this.setState({ lastResult: result });
  }

  render() {
    return (
      <Task>
        <ReadFile onComplete={this.handleComplete.bind(this)} />
        <CountWords onComplete={this.handleComplete.bind(this)} lastResult={this.state.lastResult} />
        <Top10MostUsedWords onComplete={this.handleComplete.bind(this)} lastResult={this.state.lastResult} />
        <WriteFile onComplete={this.handleComplete.bind(this)} lastResult={this.state.lastResult} />
      </Task>
    )
  }
}
```

In the above example I illustrate how you could use hypothetical tasks,
properties, and parental state to pipe the result of one task to the next. Here
we read in a file, count the words, pick the top 10 most used words, then write
those words out to a file.

## Lifecycle Methods

Currently all lifecycle methods that are supported by `ReactDOMServer` are
supported in React Pipeline, this includes `getDefaultProps()` and
`componentWillMount()`. Along with these lifecycle methods two additional
lifecycle methods have been added `componentWillExec()` and
`componentDidExec()`.  `componentWillExec()` gets called for each `Task`
instance before it's `exec()` method is called or any of it's child tasks are
started. `componentDidExec()` gets called for each `Task` instance after it's
`exec()` method is called and after all of it's child tasks have completed.

## Rationale

For the past four years I have worked primarily on big data projects utilizing
various technologies like Hadoop, Pig, Hive, Spark, etc. An all of these
projects I've needed to execute a number of tasks in order to reach my project
goal. An example would be resolving a user profile's city via their postal code;
join that data to a larger profile data set; wrangle the resolved data set into
a structure I could use for analysis; then run some algorithms on that data for
the final result. Each step in the pipeline may utilize a different technology;
resolving cities from postal codes may require an application written in Python
or Node to fetch information from Google's Geocoding API; joining and wrangling
the data may utilize Pig on Hadoop; and the final analysis may utilize Spark.

In the past I have used Luigi, AWS Data Pipeline, and custom pipeline code to
string these tasks together. On one fateful day I was working on a React
project while some of my data analysis tasks were running when I realized that
describing a pipeline using JSX and executing those tasks under React+Redux
would be intuitive and would allow me to easily write tasks involving server
code in Node.js. Thus React Pipeline was born.

## License

React Pipeline is [BSD licensed](./LICENSE).
