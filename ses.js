'use strict';

var fs = require('fs');
var path = require('path');
var vm = require('vm');

var initSES = [
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
].map(function (name) {
    return fs.readFileSync(path.join(__dirname, name), 'utf8');
}).join('\n');

var global = {};
global.console = console;
var context = vm.createContext(global);
var caja = vm.runInContext(initSES, context);

exports.confine = global.cajaVM.confine;
