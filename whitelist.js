// Copyright (C) 2011 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Exports {@code ses.whitelist}, a recursively defined
 * JSON record enumerating all the naming paths in the ES5.1 spec,
 * those de-facto extensions that we judge to be safe, and SES and
 * Dr. SES extensions provided by the SES runtime.
 *
 * <p>Assumes only ES3. Compatible with ES5, ES5-strict, ES2015,
 * ES2016, and anticipated ES2017.
 *
 * //provides ses.whitelist
 * @author Mark S. Miller,
 * @overrides ses, whitelistModule
 */
var ses;

/**
 * <p>Each JSON record enumerates the disposition of the properties on
 * some corresponding primordial object, with the root record
 * representing the global object. For each such record, the values
 * associated with its property names can be
 * <ul>
 * <li>Another record, in which case this property is simply
 *     whitelisted and that next record represents the disposition of
 *     the object which is its value. For example, {@code "Object"}
 *     leads to another record explaining what properties {@code
 *     "Object"} may have and how each such property, if present,
 *     and its value should be tamed.
 * <li>true, in which case this property is simply whitelisted. The
 *     value associated with that property is still traversed and
 *     tamed, but only according to the taming of the objects that
 *     object inherits from. For example, {@code "Object.freeze"} leads
 *     to true, meaning that the {@code "freeze"} property of {@code
 *     Object} should be whitelisted and the value of the property (a
 *     function) should be further tamed only according to the
 *     markings of the other objects it inherits from, like {@code
 *     "Function.prototype"} and {@code "Object.prototype").
 *     If the property is an accessor property, it is not
 *     whitelisted (as invoking an accessor might not be meaningful,
 *     yet the accessor might return a value needing taming).
 * <li>"maybeAccessor", in which case this accessor property is simply
 *     whitelisted and its getter and/or setter are tamed according to
 *     inheritance. If the property is not an accessor property, its
 *     value is tamed according to inheritance.
 * <li>"*", in which case this property on this object is whitelisted,
 *     as is this property as inherited by all objects that inherit
 *     from this object. The values associated with all such properties
 *     are still traversed and tamed, but only according to the taming
 *     of the objects that object inherits from. For example, {@code
 *     "Object.prototype.constructor"} leads to "*", meaning that we
 *     whitelist the {@code "constructor"} property on {@code
 *     Object.prototype} and on every object that inherits from {@code
 *     Object.prototype} that does not have a conflicting mark. Each
 *     of these is tamed as if with true, so that the value of the
 *     property is further tamed according to what other objects it
 *     inherits from.
 * <li>false, which suppression permission inherited via "*".
 * </ul>
 *
 * <p>TODO: We want to do for constructor: something weaker than '*',
 * but rather more like what we do for [[Prototype]] links, which is
 * that it is whitelisted only if it points at an object which is
 * otherwise reachable by a whitelisted path.
 *
 * <p>The members of the whitelist are either
 * <ul>
 * <li>(uncommented) defined by the ES5.1 normative standard text.
 * <li>(ESx) where x is an EcmaScript edition number. Defined by that
 *     edition's normative standard text.
 * <li>(non-determinism) provides a source of non-determinism that
 *     might be used to read side or covert channels. Therefore, these
 *     should generally not be whitelisted.
 * <li>(ES5 Appendix B) common elements of de facto JavaScript
 *     described by the non-normative Appendix B.
 * <li>(Harmless whatwg) extensions documented at
 *     <a href="http://wiki.whatwg.org/wiki/Web_ECMAScript"
 *     >http://wiki.whatwg.org/wiki/Web_ECMAScript</a> that seem to be
 *     harmless. Note that the RegExp constructor extensions on that
 *     page are <b>not harmless</b> and so must not be whitelisted.
 * <li>(ES-Harmony proposal) accepted as "proposal" status for
 *     EcmaScript-Harmony.
 * </ul>
 *
 * <p>With the above encoding, there are some sensible whitelists we
 * cannot express, such as marking a property both with "*" and a JSON
 * record. This is an expedient decision based only on not having
 * encountered such a need. Should we need this extra expressiveness,
 * we'll need to refactor to enable a different encoding.
 *
 * <p>We factor out {@code true} into the variable {@code t} just to
 * get a bit better compression from simple minifiers.
 */
(function whitelistModule() {
  "use strict";

  if (!ses) { ses = {}; }

  var t = true;
  var TypedArrayWhitelist;  // defined and used below

  // Organized by the order of appearance start at section 17
  // https://tc39.github.io/ecma262/#sec-ecmascript-standard-built-in-objects
  ses.whitelist = {
    // 18.1 #sec-value-properties-of-the-global-object
    Infinity: t,
    NaN: t,
    undefined: t,

    // 18.2 #sec-function-properties-of-the-global-object
    // eval: t,                      // Whitelisting under separate control
                                     // by TAME_GLOBAL_EVAL in startSES.js
    isFinite: t,
    isNaN: t,
    parseFloat: t,
    parseInt: t,
    decodeURI: t,
    decodeURIComponent: t,
    encodeURI: t,
    encodeURIComponent: t,

    Object: {
      // 19.1.2 #sec-properties-of-the-object-constructor
      // assign: t,                  // ES2015 no symbols yet
      create: t,
      defineProperties: t,           // ES2016?
      defineProperty: t,
      freeze: t,
      getOwnPropertyDescriptor: t,
      getOwnPropertyNames: t,
      // getOwnPropertySymbols       // ES2015 no symbols yet
      getPrototypeOf: t,
      is: t,                         // ES2015
      isExtensible: t,
      isFrozen: t,
      isSealed: t,
      keys: t,
      preventExtensions: t,
      seal: t,
      // setPrototypeOf              // ES2016, not yet

      // If any new methods are added here that may reveal the
      // HIDDEN_NAME within WeakMap.js, such as the proposed
      // getOwnPropertyDescriptors or getPropertyDescriptors, then
      // extend WeakMap.js to monkey patch these to avoid revealing
      // HIDDEN_NAME.
      getPropertyDescriptor: t,      // ES-Harmony proposal
      getPropertyNames: t,           // ES-Harmony proposal

      // 19.1.3 #sec-properties-of-the-object-prototype-object
      prototype: {
        constructor: '*',
        hasOwnProperty: t,
        isPrototypeOf: t,
        propertyIsEnumerable: t,
        toLocaleString: '*',
        toString: '*',
        valueOf: t,

        // B.2.2 #sec-additional-properties-of-the-object.prototype-object
        // __proto__                 // ES2015 not yet

        // ES2017?. These are redefined in startSES.js in terms of
        // standard methods, so that we can be confident they
        // introduce no non-standard possibilities.
        __defineGetter__: t,
        __defineSetter__: t,
        __lookupGetter__: t,
        __lookupSetter__: t,

        // There are only here to support repair_THROWING_THAWS_FROZEN_OBJECT,
        // which repairs Safari-only bug
        // https://bugs.webkit.org/show_bug.cgi?id=141878 by
        // preemptively adding these properties to any objects that
        // are about to become non-extensible. When these are already
        // present, then the Safari bug does not add them.
        line: '*',
        column: '*',
        sourceUrl: '*',
        stack: '*'
      }
    },
    Function: {
      // 19.2.3 #sec-properties-of-the-function-prototype-object
      prototype: {
        apply: t,
        bind: t,
        call: t,
        // [Symbol.hasInstance]      // ES2015? No symbols yet

        // 19.2.4 #sec-function-instances
        length: '*',
        name: '*',                   // ES2015
        prototype: '*',

        // non-std. Do we still need this?
        arity: '*'                   // non-std, deprecated in favor of length
      }
    },
    Boolean: {
      // 19.3.3 #sec-properties-of-the-boolean-prototype-object
      prototype: {
        valueOf: t
      }
    },
    // 19.4 #sec-symbol-objects
    // Symbol: {...}                 // ES2015 no symbols yet
    Error: {
      // 19.5.3 #sec-properties-of-the-error-prototype-object
      prototype: {
        // 19.5.6.3 #sec-properties-of-the-nativeerror-prototype-objects
        name: '*',
        message: '*'
      }
    },
    // In ES6 the *Error "subclasses" of Error inherit from Error,
    // since constructor inheritance generally mirrors prototype
    // inheritance. As explained at
    // https://code.google.com/p/google-caja/issues/detail?id=1963 ,
    // debug.js hides away the Error constructor itself, and so needs
    // to rewire these "subclass" constructors. Until we have a more
    // general mechanism, please maintain this list of whitelisted
    // subclasses in sync with the list in debug.js of subclasses to
    // be rewired.
    EvalError: {
      prototype: t
    },
    RangeError: {
      prototype: t
    },
    ReferenceError: {
      prototype: t
    },
    SyntaxError: {
      prototype: t
    },
    TypeError: {
      prototype: t
    },
    URIError: {
      prototype: t
    },
    Number: {
      // 20.1.2 #sec-properties-of-the-number-constructor
      EPSILON: t,                    // ES2015?
      isFinite: t,                   // ES2015
      isInteger: t,                  // ES2015
      isNaN: t,                      // ES2015
      isSafeInteger: t,              // ES2015
      MAX_SAFE_INTEGER: t,           // ES2015
      MAX_VALUE: t,
      MIN_SAFE_INTEGER: t,           // ES2015
      MIN_VALUE: t,
      NaN: t,
      NEGATIVE_INFINITY: t,
      parseFloat: t,                 // ES2015
      parseInt: t,                   // ES2015
      POSITIVE_INFINITY: t,

      // 20.1.3 #sec-properties-of-the-number-prototype-object
      prototype: {
        toExponential: t,
        toFixed: t,
        toPrecision: t,
        valueOf: t
      }
    },
    Math: {
      // 20.2.1 #sec-value-properties-of-the-math-object
      E: t,
      LN10: t,
      LN2: t,
      LOG10E: t,
      LOG2E: t,
      PI: t,
      SQRT1_2: t,
      SQRT2: t,
      // [Symbol.toStringTag]        // ES2015 no symbols yet

      // 20.2.2 #sec-function-properties-of-the-math-object
      abs: t,
      acos: t,
      acosh: t,                      // ES2015
      asin: t,
      asinh: t,                      // ES2015
      atan: t,
      atanh: t,                      // ES2015
      atan2: t,
      cbrt: t,                       // ES2015
      ceil: t,
      clz32: t,                      // ES2015
      cos: t,
      exp: t,
      expm1: t,                      // ES2015
      floor: t,
      fround: t,                     // ES2015
      hypot: t,                      // ES2015
      imul: t,                       // ES2015
      log: t,
      log1p: t,                      // ES2015
      log10: t,                      // ES2015
      log2: t,                       // ES2015
      max: t,
      min: t,
      pow: t,
      // random: t,                  // source of non-determinism
      round: t,
      sign: t,                       // ES2015
      sin: t,
      sinh: t,                       // ES2015
      sqrt: t,
      tan: t,
      tanh: t,                       // ES2015
      trunc: t                       // ES2015
    },
    // 20.3.2 #sec-date-constructor
    // 'new Date()' is a source of non-determinism, i.e., Date constructor
    // called as a constructor with no arguments.
    // 'Date(...)' is a source of non-determinism, i.e., Date constructor
    // called as a function with any arguments.
    Date: {
      // 20.3.3 #sec-properties-of-the-date-constructor
      // now: t,                     // source of non-determinism
      parse: t,
      UTC: t,

      // 20.3.4 #sec-properties-of-the-date-prototype-object
      // Note: coordinate this list with maintanence of repairES5.js
      prototype: {
        getDate: t,
        getDay: t,
        getFullYear: t,
        getHours: t,
        getMilliseconds: t,
        getMinutes: t,
        getMonth: t,
        getSeconds: t,
        getTime: t,
        getTimezoneOffset: t,
        getUTCDate: t,
        getUTCDay: t,
        getUTCFullYear: t,
        getUTCHours: t,
        getUTCMilliseconds: t,
        getUTCMinutes: t,
        getUTCMonth: t,
        getUTCSeconds: t,

        setDate: t,
        setFullYear: t,
        setHours: t,
        setMilliseconds: t,
        setMinutes: t,
        setMonth: t,
        setSeconds: t,
        setTime: t,
        setUTCDate: t,
        setUTCFullYear: t,
        setUTCHours: t,
        setUTCMilliseconds: t,
        setUTCMinutes: t,
        setUTCMonth: t,
        setUTCSeconds: t,

        toDateString: t,
        toISOString: t,
        toJSON: t,
        toLocaleDateString: t,
        toLocaleString: t,
        toLocaleTimeString: t,
        toTimeString: t,
        toUTCString: t,
        valueOf: t,
        // [Symbol.toPrimitive]      // ES2015 no symbols yet

        // B.2.4 #sec-additional-properties-of-the-date.prototype-object
        getYear: t,                  // ES5 Appendix B
        setYear: t,                  // ES5 Appendix B
        toGMTString: t               // ES5 Appendix B
      }
    },
    String: {
      // 21.1.2 #sec-properties-of-the-string-constructor
      fromCharCode: t,
      fromCodePoint: t,              // ES2015
      raw: t,                        // ES2015

      // 21.3 #sec-properties-of-the-string-prototype-object
      prototype: {
        charAt: t,
        charCodeAt: t,
        concat: t,
        endsWith: t,                 // ES2015?
        includes: t,                 // ES2016
        indexOf: t,
        lastIndexOf: t,
        localeCompare: t,
        match: t,
        normalize: t,                // ES2015?
        repeat: t,                   // ES2015?
        replace: t,
        search: t,
        slice: t,
        split: t,
        startsWith: t,               // ES2015?
        substring: t,
        toLocaleLowerCase: t,
        toLocaleUpperCase: t,
        toLowerCase: t,
        toUpperCase: t,
        trim: t,
        valueOf: t,
        // [Symbol.iterator]         // ES2015 no symbols yet

        // 21.1.4 #sec-properties-of-string-instances
        length: '*',

        // B.2.3 #sec-additional-properties-of-the-string.prototype-object
        substr: t,                   // ES5 Appendix B
        anchor: t,                   // ES2015 Annex B
        big: t,                      // ES2015 Annex B
        blink: t,                    // ES2015 Annex B
        bold: t,                     // ES2015 Annex B
        fixed: t,                    // ES2015 Annex B
        fontcolor: t,                // ES2015 Annex B
        fontsize: t,                 // ES2015 Annex B
        italics: t,                  // ES2015 Annex B
        link: t,                     // ES2015 Annex B
        small: t,                    // ES2015 Annex B
        strike: t,                   // ES2015 Annex B
        sub: t,                      // ES2015 Annex B
        sup: t,                      // ES2015 Annex B

        trimLeft: t,                 // non-standard
        trimRight: t                 // non-standard
      }
    },
    // 21.2.3 #sec-regexp-constructor
    RegExp: {
      // 21.2.4 #sec-properties-of-the-regexp-constructor
      // [Symbol.species]            // ES2015 no symbols yet

      // 21.2.5 #sec-properties-of-the-regexp-prototype-object
      prototype: {
        exec: t,
        flags: 'maybeAccessor',
        global: 'maybeAccessor',
        ignoreCase: 'maybeAccessor',
        // [Symbol.match]            // ES2015 no symbols yet
        multiline: 'maybeAccessor',
        // [Symbol.replace]          // ES2015 no symbols yet
        // [Symbol.search]           // ES2015 no symbols yet
        source: 'maybeAccessor',
        // [Symbol.split]            // ES2015 no symbols yet
        sticky: 'maybeAccessor',     // ES2015?
        test: t,
        unicode: 'maybeAccessor',
        options: '*',                // non-std

        // 21.2.6 #sec-properties-of-regexp-instances
        lastIndex: '*'

        // B.2.5 #sec-additional-properties-of-the-regexp.prototype-object
        // compile                   // ES2015 DO NOT ENABLE
      }
    },
    Array: {
      // 22.1.2 #sec-properties-of-the-array-constructor
      from: t,                       // ES2015
      isArray: t,
      of: t,                         // ES2015
      // [Symbol.species]            // ES2015 no symbols yet

      // 22.1.3 #sec-properties-of-the-array-prototype-object
      prototype: {
        concat: t,
        copyWithin: t,               // ES2015
        entries: t,                  // ES2015
        every: t,
        fill: t,                     // ES2015
        filter: t,
        find: t,                     // ES2015
        findIndex: t,                // ES2015
        forEach: t,
        includes: t,                 // ES2016?
        indexOf: t,
        join: t,
        keys: t,                     // ES2015?
        lastIndexOf: t,
        map: t,
        pop: t,
        push: t,
        reduce: t,
        reduceRight: t,
        reverse: t,
        shift: t,
        slice: t,
        some: t,
        sort: t,
        splice: t,
        unshift: t,
        values: t,                   // ES2015
        // [Symbol.iterator]         // ES2015 no symbols yet
        // [Symbol.unscopables]      // ES2015 no symbols yet

        // 22.1.4 #sec-properties-of-array-instances
        length: '*'
      }
    },
    // 23.1 #sec-map-objects
    // Map: {...}                    // ES2015 not yet
    // 23.2 #sec-set-objects
    // Set: {...}                    // ES2015 not yet
    WeakMap: {                       // ES2015
      // 23.3.3 #sec-properties-of-the-weakmap-prototype-object
      prototype: {
        // Note: coordinate this list with maintenance of repairES5.js
        'delete': t,
        get: t,
        has: t,
        set: t
      }
    },
    // 23.4.3 #sec-properties-of-the-weakset-prototype-object
    // Set: {...}                    // ES2015 not yet

    // 24 #sec-structured-data
    // 24.3 #sec-json-object
    JSON: {
      parse: t,
      stringify: t
    },
    ///////////////// Standard Starting in ES6 //////////////////
    ArrayBuffer: {                   // Khronos Typed Arrays spec; ops are safe
      length: t,  // does not inherit from Function.prototype on Chrome
      name: t,  // ditto
      isView: t,
      prototype: {
        byteLength: 'maybeAccessor',
        slice: t
      }
    },
    Int8Array: TypedArrayWhitelist,
    Uint8Array: TypedArrayWhitelist,
    Uint8ClampedArray: TypedArrayWhitelist,
    Int16Array: TypedArrayWhitelist,
    Uint16Array: TypedArrayWhitelist,
    Int32Array: TypedArrayWhitelist,
    Uint32Array: TypedArrayWhitelist,
    Float32Array: TypedArrayWhitelist,
    Float64Array: TypedArrayWhitelist,
    DataView: {                      // Typed Arrays spec
      length: t,  // does not inherit from Function.prototype on Chrome
      name: t,  // ditto
      prototype: {
        buffer: 'maybeAccessor',
        byteOffset: 'maybeAccessor',
        byteLength: 'maybeAccessor',
        getInt8: t,
        getUint8: t,
        getInt16: t,
        getUint16: t,
        getInt32: t,
        getUint32: t,
        getFloat32: t,
        getFloat64: t,
        setInt8: t,
        setUint8: t,
        setInt16: t,
        setUint16: t,
        setInt32: t,
        setUint32: t,
        setFloat32: t,
        setFloat64: t
      }
    },
    // 25.4 #sec-promise-objects
    // Promise: {...}                // ES2015 not yet
    // 26.1 #sec-reflect-object
    Reflect: {                       // ES2015
      apply: t,
      confine: t,                    // Added by SES
      construct: t,
      defineProperty: t,
      deleteProperty: t,
      enumerate: t,                  // standard?
      get: t,
      getOwnPropertyDescriptor: t,
      getPrototypeOf: t,
      has: t,
      hasOwn: t,                     // standard?
      isExtensible: t,
      ownKeys: t,
      preventExtensions: t,
      set: t,
      setPrototypeOf: t
    },

    // 26.2 #sec-proxy-objects
    // As of this writing, the WeakMap emulation in WeakMap.js relies
    // on the unguessability and undiscoverability of HIDDEN_NAME, a
    // secret property name. However, on a platform with built-in
    // Proxies, if whitelisted but not properly monkey patched,
    // proxies could be used to trap and thereby discover
    // HIDDEN_NAME. So until we (TODO(erights)) write the needed
    // monkey patching of proxies, we omit them from our whitelist.
    //
    // We have an additional reason to omit Proxy from the whitelist
    // for now.  The makeBrandTester in repairES5 uses Allen's trick
    // at
    // https://esdiscuss.org/topic/tostringtag-spoofing-for-null-and-undefined#content-59
    // , but testing reveals that, on FF 35.0.1, a proxy on an exotic
    // object X will pass this brand test when X will. This is fixed
    // as of FF Nightly 38.0a1.
    //
    // Proxy: {...}                  // ES2015 not yet
    
    // B.2.1 #sec-additional-properties-of-the-global-object
    escape: t,                       // ES5 Appendix B
    unescape: t,                     // ES5 Appendix B



    cajaVM: {                        // Caja support
      // The accessible intrinsics which are not reachable by own
      // property name traversal are listed here so that they are
      // processed by the whitelist, although this also makes them
      // accessible by this path.  See
      // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-well-known-intrinsic-objects
      // Of these, ThrowTypeError is the only one from ES5. All the
      // rest were introduced in ES6.
      anonIntrinsics: {
        ThrowTypeError: {},
        IteratorPrototype: {
          // Technically, for SES-on-ES5, we should not need to
          // whitelist 'next'. However, browsers are accidentally
          // relying on it
          // https://bugs.chromium.org/p/v8/issues/detail?id=4769#
          // https://bugs.webkit.org/show_bug.cgi?id=154475
          // and we will be whitelisting it as we transition to ES6
          // anyway, so we unconditionally whitelist it now.

          // 25.1.1.2 #sec-iterator-interface
          next: '*',
          constructor: false
        },
        // 21.1.5.2 #sec-%stringiteratorprototype%-object
        StringIteratorPrototype: {},
        // 22.1.5.2 #sec-%arrayiteratorprototype%-object
        ArrayIteratorPrototype: {},
        // 23.1.5.2 #sec-%mapiteratorprototype%-object
        // MapIteratorPrototype: {},  // ES2015 not yet
        // 23.2.5.2 #sec-%setiteratorprototype%-object
        // SetIteratorPrototype: {},  // ES2015 not yet

        // The %GeneratorFunction% intrinsic is the constructor of
        // generator functions, so %GeneratorFunction%.prototype is
        // the %Generator% intrinsic, which all generator functions
        // inherit from. A generator function is effectively the
        // constructor of its generator instances, so, for each
        // generator function (e.g., "g1" on the diagram at
        // http://people.mozilla.org/~jorendorff/figure-2.png )
        // its .prototype is a prototype that its instances inherit
        // from. Paralleling this structure, %Generator%.prototype,
        // i.e., %GeneratorFunction%.prototype.prototype, is the
        // object that all these generator function prototypes inherit
        // from. The .next, .return and .throw that generator
        // instances respond to are actually the builtin methods they
        // inherit from this object.
        GeneratorFunction: {
          prototype: {
            prototype: {
              // 25.3.1 #sec-properties-of-generator-prototype
              next: '*',
              'return': '*',
              'throw': '*'
            }
          }
        },

        // 22.2 #sec-typedarray-objects
        TypedArray: TypedArrayWhitelist = {  // ES2015
          // 22.2.2 #sec-properties-of-the-%typedarray%-intrinsic-object
          from: t,
          of: t,
          // [Symbol.species]        // ES2015 no symbols yet

          // 22.2.3 #sec-properties-of-the-%typedarrayprototype%-object
          prototype: {
            buffer: 'maybeAccessor',
            byteLength: 'maybeAccessor',
            byteOffset: 'maybeAccessor',
            copyWithin: t,
            entries: t,
            every: t,
            fill: t,
            filter: t,
            find: t,
            findIndex: t,
            forEach: t,
            indexOf: t,
            includes: t,             // ES2016?
            join: t,
            keys: t,
            lastIndexOf: t,
            length: 'maybeAccessor',
            map: t,
            reduce: t,
            reduceRight: t,
            reverse: t,
            set: '*',
            slice: t,
            some: t,
            sort: t,
            subarray: '*',
            values: t,
            // [Symbol.iterator]     // ES2015 no symbols yet
            
            // 22.2.6 #sec-properties-of-typedarray-prototype-objects
            BYTES_PER_ELEMENT: '*'
          },

          // 22.2.5 # sec-properties-of-the-typedarray-constructors
          length: '*',  // does not inherit from Function.prototype on Chrome
          name: '*',  // ditto
          BYTES_PER_ELEMENT: '*'
        },
        // 26.3 #sec-module-namespace-objects
        // ES2015 not yet
      },

      log: t,
      tamperProof: t,
      constFunc: t,
      Nat: t,
      def: t,
      is: t,

      compileExpr: t,
      confine: t,
      compileModule: t,              // experimental
      compileProgram: t,             // Cannot be implemented in just ES5.1.
      eval: t,
      Function: t,

      sharedImports: t,
      makeImports: t,
      copyToImports: t,

      GuardT: {
        coerce: t
      },
      makeTableGuard: t,
      Trademark: {
        stamp: t
      },
      guard: t,
      passesGuard: t,
      stamp: t,
      makeSealerUnsealerPair: t,

      makeArrayLike: {
        canBeFullyLive: t
      }
    },
    StringMap: {  // A specialized approximation of ES-Harmony's Map.
      prototype: {} // Technically, the methods should be on the prototype,
                    // but doing so while preserving encapsulation will be
                    // needlessly expensive for current usage.
    }


  };
})();
