# React Pipeline

A task execution pipeline described in JSX.

[![Build Status](https://api.travis-ci.org/mbrio/React Pipeline.svg?branch=master)](https://travis-ci.org/mbrio/React Pipeline)

## Install

```
$ npm install --save react react-pipeline
```

## Example

An example application can be found at
[React Pipeline-example](https://github.com/mbrio/React Pipeline-example).

## Versions

React Pipeline uses semver and will match the versioning of React so developers
know what version to install for their version of React. The exception is React
Pipeline's major version will match React's minor version, until React migrates
their minor versions to major versions. At the time of this writing React is
version 0.14.7, this would correspond to 14.7.0 in React Pipeline. When React
ups it's version to 15, they will be migrating their minor version to major, at
which time React Pipeline will match the React versioning exactly.

## Roadmap

- Migrate to a runtime that mirrors the `ReactDOM.render` as
  opposed to `ReactDOMServer.renderToString`. The `ReactDOM` implementation is
  more of a living application that is affected over time whereas
  `ReactDOMServer` is more of a static implementation.
- Utilize the `render` method to output a visual representation
  of the pipeline. This could be used to generate administrative interfaces or
  to visualize the currently executing tasks.

## Introduction

The pipeline consists of one React component, `Task`; and the `ReactPipeline`
class whice is used to start the task pipeline, and mirrors the functionality of
`ReactDOMServer`.

The `Task` component is a standard React component configured to be used within
React Pipeline. The pipeline can use any React component, but only components
with an `exec` method will be run during execution.

In order to implement your task's functionality you need only inherit from
`Task` and override the `exec` method.  The `exec` method must return a Promise.

```
export default class PauseTask extends Task {
  exec() {
    const duration = this.props.duration || 1000;

    return new Promise((resolve, reject) {
      setTimeout(resolve, duration);
    });
  }
}
```

If inheriting from Task and overriding `render`, or starting from scratch with
your own component and implementing `render`, it is very important, if you are
supporting child tasks, to ensure `render` outputs it's `this.props.children`.
If child tasks are not executing it is because your component is not rendering
it's children.

```
export default class AwesomeClass {
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
setting the property `parallelTasks` to true, each of it's children's tasks will
be run in parallel.

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

## Lifecycle Methods

Currently all lifecycle methods that are supported by `ReactDOMServer` are
supported in React Pipeline, this includes `getDefaultProps` and
`componentWillMount`. Along with these lifecycle methods two additional
lifecycle methods have been added `componentWillExec` and `componentDidExec`.
`componentWillExec` gets called for each `Task` instance before it's `exec`
method is called or any of it's child tasks are started. `componentDidExec` gets
called for each `Task` instance after it's `exec` method is called and after all
of it's child tasks have completed.

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
