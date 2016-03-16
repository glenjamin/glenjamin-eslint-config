/* eslint-env node */

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

var rulesets = [
  'default',
  // 'es6',
  // 'react'
];
var results = {};

rulesets.forEach(function(ruleset) {
  results[ruleset] = {
    good: { tests: [], done: false },
    bad: { tests: [], done: false },
  };
  loadTests(ruleset, 'good', function(err, tests) {
    if (err) throw err;
    runTests(ruleset, tests, 'good', checkGood);
  });
  loadTests(ruleset, 'bad', function(err, tests) {
    if (err) throw err;
    runTests(ruleset, tests, 'bad', checkBad);
  });
});

function runTests(ruleset, tests, type, check) {
  execTests(ruleset, tests, function(err, testResults) {
    if (err) throw err;
    var section = results[ruleset][type];
    section.tests = testResults.map(t => check(ruleset, t));
    section.done = true;
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

function checkGood(ruleset, test) {
  var result = test.result;
  if (result instanceof Error) {
    return errored(test);
  }
  var passed = (result.errorCount == 0 && result.warningCount == 0);
  return {
    passed,
    title: test.name,
    summary: passed ? 'Lint passed' : 'Lint failed',
    detail: passed ? [] : result.messages.map(m => ({
      passed: false,
      info: `${m.message} (line ${m.line})`
    }))
  };
}

function checkBad(ruleset, test) {
  var result = test.result;
  if (result instanceof Error) {
    return errored(test);
  }
  var expectations = loadExpectations(ruleset, test.name);
  if (expectations) {
    // return checkBadWithExpectations(test, expectations);
  }
  var passed = (result.errorCount > 0 || result.warningCount > 0);
  return {
    passed,
    title: test.name,
    summary: passed ? 'Lint failed' : 'Lint passed',
    detail: passed ? result.messages.map(m => ({
      passed: null,
      info: `${m.message} (line ${m.line})`
    })) : []
  };
}

function checkBadWithExpectations(test, expectations) {
  return {
    passed: false,
    title: test.name,
    summary: 'TODO',
    detail: expectations.map(x => ({
      passed: false,
      info: x
    }))
  };
}

function errored(test) {
  return {
    passed: false,
    title: test.name,
    summary: String(test.result).trim()
  };
}

function checkDone() {
  if (rulesets.some(rulesetIncomplete)) return;
  reportSummary();
}

/* eslint-disable no-console */
function reportSummary() {
  var code = 0;
  rulesets.forEach(ruleset => {
    console.log(`**** ${ruleset} ****`);
    console.log(`---- good ----`);
    reportTests(results[ruleset].good.tests);
    console.log(`---- bad ----`);
    reportTests(results[ruleset].bad.tests);
    console.log('');
  });
  function reportTests(tests) {
    tests.forEach(function(test) {
      if (!test.passed) code = 1;
      reportTest(test);
    });
  }
  // eslint-disable-next-line no-process-exit
  process.exit(code);
}

function reportTest(test) {
  var headline = `${icon(test.passed)}\t${test.title}`;
  if (test.summary) headline += ` - ${test.summary}`;
  console.log(headline);
  (test.detail || []).forEach(detail => {
    console.log(`\t${icon(detail.passed)}\t${detail.info}`);
  });
}
/* eslint-enable no-console */

function icon(pass) {
  if (pass === null) return '';
  return pass ? '✅' : '❌';
}

function loadExpectations(ruleset, name) {
  try {
    return require(path.join(__dirname, ruleset, name + 'on'));
  } catch (ex) {
    return null;
  }
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
