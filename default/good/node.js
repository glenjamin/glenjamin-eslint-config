/* eslint-env node */
var a = 1;
var b = 2;

var fs = require('fs');

fs.readdir('.', function(err, files) {
  if (err) throw err;
  if (files == a || files == b) {
    fs.something(a + b);
  }
});
