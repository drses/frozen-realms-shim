// Options: --free-variable-checker --require --validate
/*global module require global cajaVM*/

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
//    hi

const ses5 = require('./ses5');

var testCases = `
(${function() {
  "use strict";

  try {
    Object.prototype.hasOwnProperty = 7;
  } catch (er) {
    cajaVM.log(er);
  }
  cajaVM.log(Object.prototype.hasOwnProperty);

  cajaVM.log(cajaVM.confine('x + y', {x: 3, y: 4}));
}}())
`;

ses5.confine(testCases, {});
