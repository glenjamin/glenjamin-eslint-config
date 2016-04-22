/* eslint-env node */

var a = 1;

if (a) a *= a;

function abc(x) {
  if (x === null) return ':()';
  while (x.parentNode) x = x.parentNode;
  return x;
}

var y = function(x) { return x + a; };
y *= a;

abc();
