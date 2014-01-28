'use strict';

var has = Object.prototype.hasOwnProperty.call.bind(Object.prototype.hasOwnProperty);

/**
 * @param {Object} obj
 * @param {Array} path
 * @return {Mixed}
 */
var opath = function (obj, path) {
  var key = '';

  if (! Array.isArray(path)) {
    throw new Error('Invalid path.');
  }

  for (var i = 0, len = path.length; i < len; i += 1) {
    key = path[i];

    if (! has(obj, key)) {
      return;
    }

    obj = obj[key];
  }

  return obj;
};

/**
 * @param {Object} obj
 * @param {String} childKey
 * @param {Array} path
 * @return {Mixed}
 */
var opathChildKey = function (obj, childKey, path, createChildren) {
  var key = '';

  if (! Array.isArray(path)) {
    throw new Error('Invalid path.');
  }

  for (var i = 0, len = path.length; i < len; i += 1) {
    key = path[i];
    obj = obj[childKey];

    if (! has(obj, key)) {
      if (! createChildren) {
        return;
      }

      obj[key] = {};
      obj[key][childKey] = {};
    }

    obj = obj[key];
  }

  return obj;
};

/**
 * Export `opath`
 *
 * @param {Object} obj
 * @param {String} childKey (optional)
 * @return {Function}
 */
module.exports = function (obj, childKey) {
  if (! obj) {
    throw new Error('Invalid argument.');
  }

  var fn;

  if (childKey) {
    fn = opathChildKey.bind(null, obj, childKey);
  } else {
    fn = opath.bind(null, obj);
  }

  Object.defineProperty(fn, 'reference', {
    'get': function () {
      return obj;
    },
    'enumarable': true
  });

  return fn;
};
