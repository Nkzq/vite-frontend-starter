/*
 * @preserve dataset polyfill for IE < 11. See https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset and http://caniuse.com/#search=dataset
 *
 * @author ShirtlessKirk copyright 2015
 * @license WTFPL (http://www.wtfpl.net/txt/copying)
 */
/* eslint-disable */
/* global define: false, module: false */
/* jslint nomen: true, regexp: true, unparam: true */
(function datasetModule(global, definition) { // non-exporting module magic dance
  'use strict';

  var
    amd = 'amd',
    exports = 'exports'; // keeps the method names for CommonJS / AMD from being compiled to single character variable

  if (typeof define === 'function' && define[amd]) {
    define(function definer() {
      return definition(global);
    });
  } else if (typeof module === 'function' && module[exports]) {
    module[exports] = definition(global);
  } else {
    definition(global);
  }
}(window, function datasetPolyfill(global) {
  'use strict';

  var
    attribute,
    attributes,
    counter,
    dash,
    dataRegEx,
    document = global.document,
    hasEventListener,
    length,
    match,
    mutationSupport,
    test = document.createElement('_'),
    DOMAttrModified = 'DOMAttrModified';

  function clearDataset(event) {
    delete event.target._datasetCache;
  }

  function toCamelCase(string) {
    return string.replace(dash, function (m, letter) {
      return letter.toUpperCase();
    });
  }

  function getDataset() {
    var
      dataset = {};

    attributes = this.attributes;
    for (counter = 0, length = attributes.length; counter < length; counter += 1) {
      attribute = attributes[counter];
      match = attribute.name.match(dataRegEx);
      if (match) {
        dataset[toCamelCase(match[1])] = attribute.value;
      }
    }

    return dataset;
  }

  function mutation() {
    if (hasEventListener) {
      test.removeEventListener(DOMAttrModified, mutation, false);
    } else {
      test.detachEvent('on' + DOMAttrModified, mutation);
    }

    mutationSupport = true;
  }

  if (test.dataset !== undefined) {
    return;
  }
  /* eslint-disable */
  dash = /\-([a-z])/ig;
  dataRegEx = /^data\-(.+)/;
  hasEventListener = !!document.addEventListener;
  mutationSupport = false;

  if (hasEventListener) {
    test.addEventListener(DOMAttrModified, mutation, false);
  } else {
    test.attachEvent('on' + DOMAttrModified, mutation);
  }

  // trigger event (if supported)
  test.setAttribute('foo', 'bar');

  Object.defineProperty(global.Element.prototype, 'dataset', {
    get: mutationSupport ?
      function get() {
        if (!this._datasetCache) {
          this._datasetCache = getDataset.call(this);
        }

        return this._datasetCache;
      } : getDataset
  });

  if (mutationSupport && hasEventListener) { // < IE9 supports neither
    document.addEventListener(DOMAttrModified, clearDataset, false);
  }
}));