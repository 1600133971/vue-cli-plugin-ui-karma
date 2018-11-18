# ☕️ vue-cli-plugin-ui-karma

> ui-karma plugin(ui) for vue-cli 3.x

This adds unit testing support using [Karma](http://karma-runner.github.io/latest/index.html).

## Features

### Implemented
- Run unit tests in headless chrome with `vue-cli-service karma`.
- Add customizable karma conf files for vue project.
- Add demo unit tests for normal vue project and example element-ui unit tests for vue project with element-ui.

## Injected Commands

- **`vue-cli-service karma`**

  run unit tests with karma.

  Options:

  ```
  start               run unit tests against auto-starting karma server
  karma.conf.*.js     runs with a specific karma conf file. (default: karma.conf.js)
  ```

  This command automatically starts a karma server in development mode to run the unit tests against.

## Configuration

We've pre-configured Karma to place most of the unit testing related files under `<projectRoot>/`.

## Installing in an already created project

``` sh
npm install -D vue-cli-plugin-ui-karma
```

## For Karma Statistics in vue-cli 3.x ui, please install vue-cli-addon-ui-karma in npm's global mode.[Unfinished, coming soon...]

``` sh
npm install -g vue-cli-addon-ui-karma
```
