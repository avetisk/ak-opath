/*global describe, it*/

'use strict';

var Opath = require('../');
var assert = require('assert');
var obj = {
  'home': {
    'avetis': {
      'my projects': {
        'file1.js': 1,
        'file2.js': false,
        '\\': 4,
        'falsePositive': undefined
      },
      '\\\\\\': {
        'good': 'evil',
      }
    },
    'home': {
      'avetis': 'nested'
    }
  }
};

describe('opath = new Opath()', function () {
  it('should throw', function () {
    assert.throws(function () {
      new Opath();
    });
  });
});

describe('opath = new Opath(obj)', function () {
  it('should initialize', function () {
    assert(new Opath(obj) instanceof Function);
  });
  it('should load paths', function () {
    var opath = new Opath(obj);

    assert.throws(function () {
      opath('/home');
    }, 'Invalid path.');

    assert(opath([]) === obj);
    assert(opath(['home']) === obj['home']);
    assert(opath(['home', 'home', 'avetis']) === obj['home']['home']['avetis']);
    assert(opath(['home', 'avetis', 'my projects']) === obj['home']['avetis']['my projects']);
    assert(opath(['home', 'avetis', 'my projects', 'file1.js']) === 1);
    assert(opath(['home', 'avetis', 'my projects', 'file2.js']) === false);
    assert(opath(['home', 'avetis', '\\\\\\']) === obj['home']['avetis']['\\\\\\']);
    assert(opath(['home', 'avetis', '\\\\\\', 'good']) === obj['home']['avetis']['\\\\\\']['good']);
    assert(opath(['home', 'avetis', 'my projects', 'falsePositive']) === undefined);
    assert(opath(['home', 'avetis', 'do-not-exist', 'failMePlease']) === undefined);
  });
  it('should return reference object', function () {
    var opath = new Opath(obj);

    assert(opath.reference === obj);

    assert.throws(function () {
      opath.reference = {};
    });
  });
});
