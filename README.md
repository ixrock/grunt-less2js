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
Available values: `'json'` (basic valid json), `'ng'` (angular-js module), `'commonjs'` (node-js module), 
`webjs` (js to assign to window variable; see also `windowVariable` below) 

#### options.ignoreWithPrefix
Type: `String`
Default value: `''`

If a variable starts with the ignoreWithPrefix, it will be omitted from the JSON file.
For example: `_` would ignore `@_base`.

#### options.camelCase
Type: `Boolean`
Default value: `false`

Converts variable name into the camel-case format which is most convenient to use inside JSON/JS.
Examples: @--foo-bar => fooBar, @_foo-bar => fooBar, @_--FooBarEXT => fooBarExt 

#### options.parseNumbers
Type: `Boolean`
Default value: `false`

All data-types exported from less files are strings.
The option converts string-numbers into ordinary decimal numbers (base 10).

#### options.unwrapStrings
Type: `Boolean`
Default value: `false`

Less variables, defined as @myVar: "looks like a string" by default will be imported with redundant quotes.
To avoid this crap, don't use quotes or enable this option to remove quotes from the beginning and end of the output string.

#### options.modifyVars
Type: `Object`
Default value: `null`

Allows to modify (override or add) variables to resulted output json (after getting through all other passed options).

#### options.ngModule
Type: `String`
Default value: `'%path to output file%'`

A name of output angular.js module
This option applicable only with options.format = `'ng'`

#### options.ngConstant
Type: `String`
Default value: `'%output filename without extension%'`

A name of constant service for the output angular.js module
This option applicable only with options.format = `'ng'`

#### options.windowVariable
Type: `String`
Default value: `less2js`

The name of key on the global `window` to load the generated variables object.  
This option applicable only with options.format = `'webjs'`

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
  },
  node: {
    options: {
      format: 'commonjs',
      ignoreWithPrefix: '_',
      camelCase: true,
      parseNumbers: true,
      unwrapStrings: true,
      modifyVars: {
        maxWidth: '100%',
        helloFromGrunt: 'darken(red, 10%)'
      }
    },
    src: 'test/input/variables.less',
    dest: 'test/output/node-vars.js'
  }
}
```
