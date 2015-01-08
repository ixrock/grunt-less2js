'use strict';

var grunt = require('grunt');

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

var mockJson = {
  "otherValue": "10px",
  "otherColor": "#ff0000",
  "baseColor": "#000000",
  "hexColor": "#445566",
  "rgbaColor": "rgba(255, 0, 0, 0.5)",
  "lightColor": "#404040",
  "fontSize": "1em",
  "someValue": "25",
  "blurRadius": "5px",
  "doubleRadius": "10px",
  "maxWidth": "50%",
  "boxShadow": "0 0 5px #000000",
  "someText": "'Some value is 25'",
  "fontBase": "1em Helvetica Neue, Arial, sans-serif"
};

exports.less2js = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  test_json_output: function(test) {
    var json = grunt.file.readJSON('test/output/variables.json');

    test.ok(json.hasOwnProperty('otherColor'), 'File import() works fine');

    Object.keys(mockJson).forEach(function (key) {
        test.strictEqual(json[key], mockJson[key], 'Test json-value: '+ key);
    });

    test.done();
  },
  test_ignore_prefix: function(test) {
    var json = grunt.file.readJSON('test/output/variables.json');

    test.ok(!json.hasOwnProperty('_inverse'));

    test.done();
  }
};
