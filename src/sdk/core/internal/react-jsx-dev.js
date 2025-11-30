/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";
const REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element");
const REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
const REACT_SOURCE_KEY = Symbol.for("react.source");

function jsxProdMod(type, config, maybeKey, isStaticChildren, source) {
  var key = null;
  void 0 !== maybeKey && (key = "" + maybeKey);
  void 0 !== config.key && (key = "" + config.key);
  if ("key" in config) {
    maybeKey = {};
    for (var propName in config)
      "key" !== propName && (maybeKey[propName] = config[propName]);
  } else maybeKey = config;
  config = maybeKey.ref;
  const result = {
    $$typeof: REACT_ELEMENT_TYPE,
    type: type,
    key: key,
    ref: void 0 !== config ? config : null,
    props: maybeKey
  };
  if (source) Object.defineProperty(maybeKey, REACT_SOURCE_KEY, {
    value: () => source,
    configurable: true,
    enumerable: true,
  });
  return result;
}

export const Fragment = REACT_FRAGMENT_TYPE;
export const jsx = jsxProdMod;
export const jsxDEV = jsxProdMod;
export const jsxs = jsxProdMod;
