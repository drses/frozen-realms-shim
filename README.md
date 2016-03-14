# SES5

> Secure EcmaScript 5

*:warning: This is not an official, working packaging of Google Caja’s SES.
This is a project attempting to bring SES to Node.js.  There remain a few
surmountable obstacles before we achieve proper confinement.*

SES5 is a tool that allows mutually suspicious programs to share a single
EcmaScript 5 compliant JavaScript context without interfering with each
other.  It does this by freezing everything that is accessible in global
scope, removing interfaces that would allow programs to interfe with
each-other, and providing the ability to evaluate arbitrary code in
isolation.

Usage:

```js
var ses = require('ses5');
ses.confine(`
    log("Hello, Outside World!")
`, {
    log: function log(message) {
        console.log(message);
    }
});
```

```
 Repaired: Non-deletable RegExp statics are a global communication channel
 Repaired: Date.prototype is a global communication channel
 Not repaired: Date.prototype should be a plain object
 Not repaired: RegExp.prototype should be a plain object
 Not repaired: %ThrowTypeError% has normal function properties
 Max Severity: Safe spec violation(1).
 230 Deleted
 215 Frozen harmless
 41 Globals are not readonly data properties
 44 Globals changed inexplicably
 44 Globals wre not made readonly
 1 Skipped
 Max Severity: New symptom(6) is not SES-safe.
 initSES succeeded.
Hello, Outside World!
```
