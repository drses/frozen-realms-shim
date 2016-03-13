// Options: --free-variable-checker --require --validate
/*global module require*/

// To start SES under nodejs
// Adapted from https://gist.github.com/3669482


module.exports = (function(){
  "use strict";
  
  var prelude = `
var ses = ses || {};
// This severity is too high for any use other than development.
ses.maxAcceptableSeverityName = 'NEW_SYMPTOM';
`;

  var FS = require("fs");
  var VM = require("vm");
  
  var sesFiles = [
    "logger.js",
    "repair-framework.js",
    "repairES5.js",
    "WeakMap.js",
    "StringMap.js",
    "whitelist.js",
    "atLeastFreeVarNames.js",
    "startSES.js",
    "hookupSES.js",
  ];
  
  var sesPlusFiles = [
    "logger.js",
    "repair-framework.js",
    "repairES5.js",
    "WeakMap.js",
    "debug.js",
    "StringMap.js",
    "whitelist.js",
    "atLeastFreeVarNames.js",
    "startSES.js",
    "ejectorsGuardsTrademarks.js",
    "hookupSESPlus.js",
  ];
  
  var initSESPlus = prelude + sesPlusFiles.map(function (path) {
    return FS.readFileSync(path, 'utf8');
  }).join('\n') + `
cajaVM.confine;
`;
  
  var global = {};
  global.console = console;
  global.global = global;
  var context = VM.createContext(global);
  var confine = VM.runInContext(initSESPlus, context);

  return { confine };
}());
