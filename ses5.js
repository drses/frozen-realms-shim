// Options: --free-variable-checker --require --validate
/*global module require*/

// To start SES under nodejs
// Adapted from https://gist.github.com/3669482


module.exports = (function(){
  "use strict";
  
  var FS = require("fs");
  var VM = require("vm");
  
  var sesFiles = [
    "cheat.js", // XXX
    "logger.js",
    "repair-framework.js",
    "repairES5.js",
    "whitelist.js",
    "atLeastFreeVarNames.js",
    "startSES.js",
    "hookupSES.js",
  ];
  
  var sesPlusFiles = [
    "cheat.js", // XXX
    "logger.js",
    "repair-framework.js",
    "repairES5.js",
    "debug.js",
    "whitelist.js",
    "atLeastFreeVarNames.js",
    "startSES.js",
    "ejectorsGuardsTrademarks.js",
    "hookupSESPlus.js",
  ];
  
  var initSESPlus = sesPlusFiles.map(function (path) {
    return FS.readFileSync(path, 'utf8');
  }).join('\n') + `
cajaVM;
`;
  
  var global = {};
  global.console = console;
  var context = VM.createContext(global);
  var cajaVM = VM.runInContext(initSESPlus, context);

  return cajaVM;
}());
