/*
 * grunt-less2js
 * https://github.com/ixrock/grunt-less2js
 *
 * Copyright (c) 2014 Roman Karlov
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['test/output']
    },

    // Configuration to be run (and then tested).
    less2js: {
      json: {
        options: {
          format: 'json' // by default,
        },
        files: {
          'test/output/variables.json': 'test/input/variables.less'
        }
      },
      angular: {
        options: {
          format: 'ng', // angular-js v1.x
          ngModule: 'myModule', // by default = path to the destination file
          ngConstant: 'myConfig' // by default = name of the destination file without extension
        },
        src: 'test/input/variables.less',
        dest: 'test/output/angular-vars.js'
      },
      nodejs: {
        options: {
          format: 'commonjs', // common-js, node-js
          ignoreWithPrefix: '_',
          camelCase: true,
          parseNumbers: true,
          unwrapStrings: true,
          modifyVars: {
            maxWidth: '100%',
            helloFromGrunt: true,
            darkenRed10Percents: 'darken(red, 10%)'
          }
        },
        src: 'test/input/variables.less',
        dest: 'test/output/node-vars.js'
      },
      webjs: {
        options: {
          format: 'webjs'
        },
        src: 'test/input/variables.less',
        dest: 'test/output/webjs.js'
      },
      windowVariable: {
        options: {
          format: 'webjs',  
          windowVariable: 'testVariable'
        },
        src: 'test/input/variables.less',
        dest: 'test/output/windowVariable.js'
      }
      
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'less2js', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
