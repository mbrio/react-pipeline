# react-pipeline

A task execution pipeline described in JSX.

[![Build Status](https://api.travis-ci.org/mbrio/react-pipeline.svg?branch=master)](https://travis-ci.org/mbrio/react-pipeline)

## Install

```
$ npm install --save react react-pipeline
```

## Example

An example application can be found at
[react-pipeline-example](https://github.com/mbrio/react-pipeline-example).

## Alpha Warning

The current implementation works well and is currently feature complete for my
plans for version 1. I wanted the API to be incredibly simple, utilizing as few
components as I could in order to meet my goals. My warning the internal
implementation will change. I am not 100% happy with my current implementation,
and you should not rely on `context.tasks` to be available in future releases.

My current implementation makes available `context.tasks` which is a pointer to
the parent `Task` instance, when a `Task` is instantiated it enqueue's it's
`start` method with it's parent `Task` through this context variable. This is
not utilizing the internals of React the way it should, and feels like a hack to
me.

What I plan on changing is depricating `context.tasks`, `Task.registerTask`, and
`Task.enqueue`; and replacing them by executing the `start` method in the same
way other lifecycle calls are made.

The `ReactPipeline` class utilizes code from `ReactDOMServer.renderToString` to
setup and execute tasks. I tried to mirror how and when the `Task.start` method
was executed in comparison to `componentWillMount`. This works well on the root
component, but not on it's children.

## Roadmap

I have three potential goals for *react-pipeline*:

- The first is to get out of alpha by restructuring the internals to mirror
  React lifecycle methods. [v1.0.0]
- The second is to migrate to a runtime that mirrors the `ReactDOM.render` as
  opposed to `ReactDOMServer.renderToString`. The `ReactDOM` implementation is
  more of a living application that is affected over time whereas
  `ReactDOMServer` is more of a static implementation. [v2.0.0]
- The third is to utilize the `render` method to output a visual representation
  of the pipeline. This could be used to generate administrative interfaces or
  to visualize the currently executing tasks. [v3.0.0]

## Introduction

The pipeline consists of three React components: `Task`, `Pipeline`, and 
`ParallelTask`. Along with these components there is `PipelineElement` which
will mirror the functionality of `ReactElement`, but currently is relegated to
element validation; and `ReactPipeline` which is used to start the task
pipeline, and mirrors the functionality of `ReactDOMServer`.

The `Task` component is the base class for all *react-pipeline* components; both
`Pipeline` and `ParallelTask` inherit from it. In order to implement your task's
functionality you need only inherit from `Task` and override the `exec` method.
The `exec` method must return a promise.

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

A pipeline's root component must be `Pipeline`, or inherited from `Pipeline`.
`Task` objects can have any number of children and their tasks will run in
series once the parent's task is complete. The exception to this rule is when
using `ParallelTask`, each of it's children's tasks will be run in parallel.

```
ReactPipeline.start(
  <Pipeline>
    <CreateAWSServer>
      <Geocoding input={rawPath} output={geoPath} />
      <RunPig script={resolveScript} input={geoPath} output={resolvePath} />
      <RunPig script={joinScript} input={resolvePath} output={joinPath} />
      <RunSpark script={mlScript} input={joinPath} output={mlPath} />
      <ParallelTask>
        <Upload input={joinPath} output={joinDestination} />
        <Upload input={mlPath} output={mlDestination} />
      </ParallelTask>
      <Email to={adminEmail} subject={subject} body="pipeline complete" />
    </CreateAWSServer>
  </Pipeline>
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
code in Node.js. Thus *react-pipeline* was born.

## License

*react-pipeline* is [BSD licensed](./LICENSE).
