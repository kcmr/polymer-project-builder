# Polymer Project Builder

[![Build Status](https://travis-ci.com/BBVAEngineering/polymer-project-builder.svg?branch=master)](https://travis-ci.com/BBVAEngineering/polymer-project-builder)
[![GitHub version](https://badge.fury.io/gh/BBVAEngineering%2Fpolymer-project-builder.svg)](https://badge.fury.io/gh/BBVAEngineering%2Fpolymer-project-builder)
[![NPM version](https://badge.fury.io/js/polymer-project-builder.svg)](https://badge.fury.io/js/polymer-project-builder)
[![Dependency Status](https://david-dm.org/BBVAEngineering/polymer-project-builder.svg)](https://david-dm.org/BBVAEngineering/polymer-project-builder)
[![codecov](https://codecov.io/gh/BBVAEngineering/polymer-project-builder/branch/master/graph/badge.svg)](https://codecov.io/gh/BBVAEngineering/polymer-project-builder)
[![Greenkeeper badge](https://badges.greenkeeper.io/BBVAEngineering/polymer-project-builder.svg)](https://greenkeeper.io/)

Polymer Project Builder is a command line tool to generate a single bundled file optimized for production from a set of HTML imports using [`polymer build`](https://polymer-library.polymer-project.org/2.0/docs/apps/build-for-production). 

It is meant to be used in projects that don't match a typical Polymer project structure, for instance, where a shell is not present, or simply where the default output of the `polymer build` command does not fit well.

It also adds additional build options like **autoprefixer**, **HTML and JavaScript splitting** for [CSP (Content Security Policy)](https://developers.google.com/web/fundamentals/security/csp/) and the ability to change the **bundle file name** and the **destiny path**.

## Installation and usage

Install:

```
npm i polymer-project-builder
```

Build a project ([configuration file required](#configuration)):

```
build-polymer-project
```

## Configuration

Polymer Project Builder requires a configuration file called `.polymerprojectrc` placed in the directory where the command is executed or in a parent directory. File paths are relative to the working directory.

### Differences from `polymer.json` specification

The configuration file follows the [`polymer.json` specification](https://polymer-library.polymer-project.org/2.0/docs/tools/polymer-json) with some differences:

- `shell` is not required.
- `entrypoint` can be the main entrypoint of an application (`index.html`) or a file that only contains HTML imports that should be bundled into a single file. For the first case, the file should contain at least one HTML import.
- `dest` allows to set the destiny path. This property is not present in the original `polymer.json` spec and the destiny path is set to `build/[build-name | default]`.
- `bundleFileName` allows to set the name for the HTML bundled file. Defaults to `entrypoint` if not set.
- `build` (`Object`) instead of `builds` (`Array`). Polymer Project Builder generates **only one build**.

### Build options

The `build` property in the configuration file accepts an object with the [same options for a build using `polymer build`](https://polymer-library.polymer-project.org/2.0/docs/tools/polymer-json#builds) plus two additional properties:

- `csp` (`Boolean`) Set to `true` to separate JavaScript from HTML. The generated JavaScript file will have the same name that the bundled file with `.js` extension.
- `autoprefixer` (`Object`) An object with [autoprefixer options](https://github.com/postcss/autoprefixer#options) like `browsers`, `cascade`, etc.

### Example configuration file

```json
{
  "entrypoint": "elements.html",
  "bundleFileName": "bundled.html",
  "extraDependencies": [
    "bower_components/webcomponentsjs/**"
  ],
  "moduleResolution": "none",
  "dest": "dist/assets",
  "build": {
    "csp": true,
    "js": {
      "minify": true,
      "compile": true
    },
    "css": {
      "minify": false,
      "autoprefixer": {
        "browsers": [
          "chrome >= 30",
          "firefox >= 32",
          "ios >= 9",
          "last 1 edge versions"
        ]
      }
    },
    "html": {
      "minify": true
    }
  }
}
```

# Contribute

If you want to contribute, please read the [CONTRIBUTING.md](CONTRIBUTING.md).


# Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/BBVAEngineering/polymer-project-builder/tags).


# Authors

See the list of [contributors](https://github.com/BBVAEngineering/polymer-project-builder/graphs/contributors) who participated in this project.


# License

This project is licensed under the [MIT License](LICENSE.md).
