# grunt-less2js

> Convert some variables.less to JSON to be used in Javascript

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-less2js --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-less2js');
```

## The "less2js" task

### Overview
In your project's Gruntfile, add a section named `less2js` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  less2js: {
    your_target: {
      options: {
        // Task-specific options go here.
      },
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.banner
Type: `String`
Default value: `'// DO NOT EDIT! GENERATED AUTOMATICALLY with grunt-less2js'`

A top banner at the generated file. Only applicable when options.format not `"json"`

#### options.format
Type: `String`
Default value: `'json'`

A type of output file contents. 
Available values: `'json'` (basic valid json), `'ng'` (angular-js module)

#### options.ignoreWithPrefix
Type: `String`
Default value: `''`

If a variable starts with the ignoreWithPrefix, it will be omitted from the JSON file.
For example: `_` would ignore `@_base`.

#### options.ngModule
Type: `String`
Default value: `'%path to output file%'`

A name of output angular.js module
This option actual only with options.format = `'ng'`

#### options.ngConstant
Type: `String`
Default value: `'%output filename without extension%'`

A name of constant service for the output angular.js module
This option actual only with options.format = `'ng'`

### Usage Examples

```
less2js: {
  json: {
    options: {
      format: 'json'
    },
    files: {
      'test/output/variables.json': 'test/input/variables.less'
    }
  },
  angular: {
    options: {
      format: 'ng',
      ngModule: 'myModule',
      ngConstant: 'myConfig'
    },
    src: 'test/input/variables.less',
    dest: 'test/output/variables.js'
  }
}
```
