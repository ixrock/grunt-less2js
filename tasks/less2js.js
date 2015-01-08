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

module.exports = function (grunt) {

  grunt.registerMultiTask('less2js', function () {
    var lessVars = {};
    var options = this.options({
      banner: '// DO NOT EDIT! GENERATED AUTOMATICALLY with grunt-less2js',
      format: 'json',  // available values: "json", "ng"
      ignoreWithPrefix: '', // any valid string e.g. "_" would ignore @_base
      ngModule: '',    // angular-js module name (only when format="ng")
      ngConstant: ''   // angular-js injectable constant name (only when format="ng")
    });

    this.files.forEach(function (file) {
      // parse, eval and save less variables
      file.src.forEach(function (src) {
        var content = grunt.file.read(src);
        var parser = new less.Parser({
          syncImport: true,
          paths: path.dirname(path.resolve(src)),
          filename: path.basename(src)
        });

        parser.parse(content, function (err, tree) {
          var env = new less.tree.evalEnv();
          var ruleset = tree.eval(env); // jshint ignore:line
          var prefix = options.ignoreWithPrefix || null;

          ruleset.rules.forEach(function (rule) {
            if (rule.variable) {
              var name = rule.name.substr(1); // remove "@"

              if (!prefix || name.substr(0, prefix.length) !== prefix) {
                var value = rule.value.value[0]; // can be less.tree.Color, less.tree.Expression, etc.
                lessVars[name] = value.toCSS();
              }
            }
          });
        });
      });

      // process and write the data
      var output = JSON.stringify(lessVars, null, 2);
      var outputFile = file.dest;

      if (options.format === 'ng') {
        var ngModule = options.ngModule || outputFile;
        var ngConstant = options.ngConstant || path.basename(outputFile, '.js');
        output = 'angular.module("' + ngModule + '", []).constant("' + ngConstant + '", ' + output + ');';
      }
      if (options.banner && options.format !== 'json') {
        output = [options.banner, output].join('\n');
      }

      grunt.file.write(outputFile, output);
      grunt.log.ok('%s succesfully created!', outputFile);
    });

  });

};
