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
var objChildKey = {
  'children': {
    'home': {
      'children': {
        'avetis': {
          'children': {
            'my projects': {
              'children': {
                'file1.js': 1,
                'file2.js': false,
                '\\': 4,
                'falsePositive': undefined
              }
            },
            '\\\\\\': {
              'children': {
                'good': 'evil',
              }
            }
          }
        },
        'home': {
          'children': {
            'avetis': 'nested'
          }
        }
      }
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

describe('opath = new Opath(obj, childKey)', function () {
  it('should initialize', function () {
    assert(new Opath(objChildKey, 'children') instanceof Function);
  });
  it('should load paths', function () {
    var opath = new Opath(objChildKey, 'children');

    assert.throws(function () {
      opath('/home');
    }, 'Invalid path.');

    assert.strictEqual(opath([]), objChildKey);
    assert.strictEqual(opath(['home']), objChildKey['children']['home']);
    assert.strictEqual(opath(['home', 'home', 'avetis']), objChildKey['children']['home']['children']['home']['children']['avetis']);
    assert.strictEqual(opath(['home', 'avetis', 'my projects']), objChildKey['children']['home']['children']['avetis']['children']['my projects']);
    assert.strictEqual(opath(['home', 'avetis', 'my projects', 'file1.js']), 1);
    assert.strictEqual(opath(['home', 'avetis', 'my projects', 'file2.js']), false);
    assert.strictEqual(opath(['home', 'avetis', '\\\\\\']), objChildKey['children']['home']['children']['avetis']['children']['\\\\\\']);
    assert.strictEqual(opath(['home', 'avetis', '\\\\\\', 'good']), objChildKey['children']['home']['children']['avetis']['children']['\\\\\\']['children']['good']);
    assert.strictEqual(opath(['home', 'avetis', 'my projects', 'falsePositive']), undefined);
    assert.strictEqual(opath(['home', 'avetis', 'do-not-exist', 'failMePlease']), undefined);
    assert.strictEqual(opath(['home', 'avetis', 'my projects', 'falsePositive'], true), undefined);
    assert.strictEqual(opath(['home', 'avetis', 'do-not-exist', 'failMePlease'], true), objChildKey['children']['home']['children']['avetis']['children']['do-not-exist']['children']['failMePlease']);
    assert.notStrictEqual(objChildKey['children']['home']['children']['avetis']['children']['do-not-exist']['children']['failMePlease'], undefined);
  });
  it('should return reference objChildKey', function () {
    var opath = new Opath(objChildKey, 'children');

    assert(opath.reference === objChildKey);

    assert.throws(function () {
      opath.reference = {};
    });
  });
});
