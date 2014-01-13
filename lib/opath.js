'use strict';

var has = Object.prototype.hasOwnProperty.call.bind(Object.prototype.hasOwnProperty);

/**
 * @param {String|Array} path
 * @param {Object} obj
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
 * Export `opath`
 *
 * @param {Object} obj
 * @return {Function}
 */
module.exports = function (obj) {
  if (! obj) {
    throw new Error('Invalid argument.');
  }

  var fn = opath.bind(null, obj);

  Object.defineProperty(fn, 'reference', {
    'get': function () {
      return obj;
    },
    'enumarable': true
  });

  return fn;
};
