'use strict';

var grunt = require('grunt');
var _ = require('lodash');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.less2js = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  it_exports_valid_json: function (test) {
    var outputJson = grunt.file.readJSON('test/output/variables.json');
    test.ok(_.isPlainObject(outputJson), 'Export as JSON works fine');
    test.done();
  },
  it_exports_nodejs_module: function (test) {
    var outputJson = require('../test/output/node-vars.js');
    test.ok(_.isPlainObject(outputJson), 'Export as common-js/node-js module works fine');
    test.done();
  },
  it_exports_webjs: function (test) {
    global.window = {};
    require('../test/output/webjs.js');
    test.ok(_.isPlainObject(global.window.less2js), 'Export as webjs module works fine');
    test.done();
  },
  it_names_window_var: function (test) {
    global.window = {};
    require('../test/output/windowVariable.js');
    test.ok(_.isPlainObject(global.window.testVariable), 'Export as custom window variable works fine');
    test.done();
  },
  test_other_options: function(test) {
    var normalJson = grunt.file.readJSON('test/output/variables.json');
    var modifiedJson = require('../test/output/node-vars.js');

    // export data from imported files
    test.ok(modifiedJson.varFromImport, 'Export variables from imported external less-files');

    // ignore with prefix
    test.ok(normalJson._ignoreWithPrefix, 'Test of `options.ignoreWithPrefix = ""`');
    test.ok(_.isUndefined(modifiedJson._ignoreWithPrefix), 'Test of `options.ignoreWithPrefix = "_"`');

    // camel case
    test.ok(normalJson['camel-case'], 'Test of `options.camelCase = false`');
    test.ok(_.isUndefined(normalJson.camelCase), 'Test of `options.camelCase = false`');
    test.ok(modifiedJson.camelCase, 'Test of `options.camelCase = true`');

    // parse numbers
    test.ok(_.isString(normalJson.parsedNumber), 'Test of `options.parseNumbers = false`');
    test.ok(_.isNumber(modifiedJson.parsedNumber), 'Test of `options.parseNumbers = true`');

    // unwrap bad strings
    test.ok(normalJson.unwrappedString === '"string"', 'Test of `options.unwrapStrings = false`');
    test.ok(normalJson.unwrappedString2 === "'string'", 'Test of `options.unwrapStrings = false`');
    test.ok(modifiedJson.unwrappedString === 'string', 'Test of `options.unwrapStrings = true`');
    test.ok(modifiedJson.unwrappedString2 === 'string', 'Test of `options.unwrapStrings = true`');

    // modified vars
    test.ok(normalJson.maxWidth === '50%', 'Test with default (empty) options.modifyVars');
    test.ok(modifiedJson.maxWidth === '100%', 'Test with extra options.modifyVars object');
    test.ok(modifiedJson.helloFromGrunt, 'Test with extra options.modifyVars object');
    test.ok(modifiedJson.darkenRed10Percents === '#cc0000', 'Test with extra options.modifyVars object');

    test.done();
  }
};
