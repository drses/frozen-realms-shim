// Options: --free-variable-checker --require --validate
/*global require cajaVM*/

// To start SES under nodejs
// Adapted from https://gist.github.com/3669482

// Running the following command in a directory with the SES sources
//    $ node ses-usage.js
// Should print something like
//     Max Severity: Safe spec violation(1).
//     414 Apparently fine
//     24 Deleted
//     1 Skipped
//     Max Severity: Safe spec violation(1).
//     initSES succeeded.
//    seven: 7

const ses5 = require('./ses5');

var testCases = `
(${function() {
  "use strict";

  cajaVM.log('seven: ' + cajaVM.confine('x + y', {x: 3, y: 4}));
}}())
`;

ses5.confine(testCases, {});
