var ses = require('./ses');
ses.confine(`
    log("Hello, Outside World!")
`, {
    log: function log(message) {
        console.log(message);
    }
});
