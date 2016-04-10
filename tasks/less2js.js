/*
 * grunt-less2js
 * https://github.com/ixrock/grunt-less2js
 *
 * Copyright (c) 2014 Roman Karlov (ixrock@gmail.com)
 * Licensed under the MIT license.
 */

'use strict';
var path = require('path');
var less = require('less');
var _ = require('lodash');

module.exports = function (grunt) {

  grunt.registerMultiTask('less2js', function () {
    var lessVars = {};
    var options = this.options({
      banner:              '// DO NOT EDIT! GENERATED AUTOMATICALLY with grunt-less2js',
      format: 'json',       // available values: "json", "ng", "commonjs", "webjs"
      ngModule: '',         // angular-js module name (applicable only when format="ng")
      ngConstant: '',       // angular-js injectable constant name (applicable only when format="ng")
      ignoreWithPrefix: '', // any valid string e.g. "_" would ignore @_base
      camelCase: false,     // convert variable names to camel-case format (@my-var in less => myVar in js)
      parseNumbers: false,  // convert strings that contains only numbers to normal decimal format
      unwrapStrings: false, // remove extra quotes, ex. for @something: 'my string' by default => "'my string'"
      modifyVars: null,     // override output result with predefined set of variables in the task
      windowVariable: 'less2js'  // window (global) variable to assign object of variables to. (applicable only when format="webjs").  
    });

    // parse, eval and save less-variables to js-object
    this.files.forEach(function (file) {
      file.src.forEach(function (src) {
        var content = grunt.file.read(src);
        var parser = new less.Parser({
          syncImport: true,
          paths: path.dirname(path.resolve(src)),
          filename: path.basename(src)
        });

        if (_.isObject(options.modifyVars)) {
          content += _.reduce(options.modifyVars, function (content, value, name) {
            content += '\n@' + name + ':' + value + ';';
            return content;
          }, '');
        }

        parser.parse(content, function (err, tree) {
          if( err !== null ) {
            var message = 'Error in ' + err.filename + ':' + err.line + ' - ' + err.message;
            grunt.fail.warn(message);
          }
          var env = new less.tree.evalEnv();
          var ruleset = tree.eval(env); // jshint ignore:line

          ruleset.rules.forEach(function (rule) {
            if (rule.variable) {
              var name = rule.name.substr(1); // remove "@"
              var value = rule.value.value[0]; // can be less.tree.Color, less.tree.Expression, etc.
              lessVars[name] = value.toCSS();
            }
          });
        });
      });

      // process the data with current options
      if (options.ignoreWithPrefix) {
        _.forEach(lessVars, function (value, name) {
          if (name.indexOf(options.ignoreWithPrefix) === 0) {
            delete lessVars[name];
          }
        });
      }

      if (options.camelCase) {
        lessVars = _.reduce(lessVars, function (lessVars, value, name) {
          lessVars[_.camelCase(name)] = value;
          return lessVars;
        }, {});
      }

      if (options.unwrapStrings) {
        var badStringInString = /^('|").*?\1$/;
        _.forEach(lessVars, function (value, name) {
          if (value.match(badStringInString)) {
            lessVars[name] = value.replace(/^['"]|['"]$/g, '');
          }
        });
      }

      if (options.parseNumbers) {
        var isNumber = /^\d+$/;
        _.forEach(lessVars, function (value, name) {
          if (value.match(isNumber)) {
            lessVars[name] = parseInt(value, 10);
          }
        });
      }

      // final preparations and saving the output
      var output = JSON.stringify(lessVars, null, 2);
      var outputFile = file.dest;
      var outputType = options.format;

      switch (outputType) {
        case 'ng':
          var ngModule = options.ngModule || outputFile;
          var ngConstant = options.ngConstant || path.basename(outputFile, '.js');
          output = 'angular.module("' + ngModule + '", []).constant("' + ngConstant + '", ' + output + ');';
          break;
        case 'commonjs':
          output = 'module.exports = ' + output + ';';
          break;
        case 'webjs':
          output = 'window.' + options.windowVariable + ' = ' + output + ';';
          break;
      }

      if (options.banner && outputType !== 'json') {
        output = [options.banner, output].join('\n');
      }

      grunt.file.write(outputFile, output);
      grunt.log.ok('%s succesfully created!', outputFile);
    });

  });

};
