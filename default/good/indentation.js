// I don't really care all that much
// but figure i'd better pick something

/* eslint-env node */
/* eslint-disable no-magic-numbers */

var x;

function a(b) {
  return b;
}

switch (a()) {
  case 'x':
    x *= 1;
    break;
  default:
    x *= 2;
}

if (x > 7) {
  if (x == 2) {
    x -= 3;
  }
} else {
  x += 7;
}

a('abc', {
  blah: 'blah',
  and: 'more'
});

a(
  'abc',
  'xyz',
  x
);
