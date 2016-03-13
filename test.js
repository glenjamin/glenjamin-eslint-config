var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

var rulesets = ['default', 'es6', 'react'];
var results = {};

rulesets.forEach(function(ruleset) {
  results[ruleset] = {
    good: { tests: [], done: false },
    bad: { tests: [], done: false },
  };
  loadTests(ruleset, 'good', function(err, tests) {
    if (err) throw err;
    runTests(ruleset, tests, 'good');
  });
  loadTests(ruleset, 'bad', function(err, tests) {
    if (err) throw err;
    runTests(ruleset, tests, 'bad');
  });
});

function runTests(ruleset, tests, type) {
  execTests(ruleset, tests, function(err, testResults) {
    if (err) throw err;
    results[ruleset][type].tests = testResults;
    results[ruleset][type].done = true;
    checkDone();
  });
}

function execTests(ruleset, tests, callback) {
  var testResults = tests.map(name => ({ name, result: null }));
  testResults.forEach(test => {
    execTest(ruleset, test.name, (err, testResult) => {
      test.result = err || testResult;
      checkRulesetComplete();
    });
  });
  checkRulesetComplete();
  function checkRulesetComplete() {
    if (testResults.some(t => !t.result)) return;
    callback(null, testResults);
  }
}

function execTest(ruleset, name, callback) {
  var rulesetDir = path.join(__dirname, ruleset);
  var nodeModulesBin = path.join(rulesetDir, 'node_modules/.bin');
  exec(`eslint -f json --max-warnings 0 ${name}`, {
    cwd: rulesetDir,
    env: { PATH: `${nodeModulesBin}:${process.env.PATH}` },
  }, (err, stdout) => {
    try {
      var json = JSON.parse(stdout);
      return callback(null, json[0]);
    } catch (ex) {
      if (err) return callback(err);
      return callback(new Error("Unknown error"));
    }
  });
}

function checkDone() {
  if (rulesets.some(rulesetIncomplete)) return;
  var code = 0;
  /* eslint-disable no-console */
  rulesets.forEach(ruleset => {
    console.log(`**** ${ruleset} ****`);
    console.log(`---- good ----`);
    results[ruleset].good.tests.forEach(function(test) {
      var r = test.result;
      var pass = (r.errorCount == 0 && r.warningCount == 0);
      if (!pass) code = 1;
      console.log(`${icon(pass)}\t${test.name} - ${formatResult(r)}`);
    });
    console.log(`---- bad ----`);
    results[ruleset].bad.tests.forEach(function(test) {
      var r = test.result;
      var pass = (r.errorCount > 0 || r.warningCount > 0);
      if (!pass) code = 1;
      console.log(`${icon(pass)}\t${test.name} - ${formatResult(r)}`);
    });
    console.log('');
  });
  /* eslint-enable no-console */
  // eslint-disable-next-line no-process-exit
  process.exit(code);
}

function icon(pass) {
  return pass ? '✅' : '❌';
}

function formatResult(result) {
  if (result instanceof Error) return String(result);
  if (result.errorCount == 0 && result.warningCount == 0) {
    return 'Linting passed';
  }
  return result.messages
    .map(m => `${m.ruleId}: ${m.message} (line ${m.line})`)
    .join(', ');
}

function rulesetIncomplete(ruleset) {
  return !(
    results[ruleset].good.done
    &&
    results[ruleset].bad.done
  );
}

function loadTests(ruleset, type, callback) {
  var dir = path.join(__dirname, ruleset, type);
  fs.readdir(dir, function(err, files) {
    if (err) return callback(err);
    return callback(null,
      files
        .filter(x => /\.js$/.test(x))
        .map(x => path.join(type, x)));
  });
}
