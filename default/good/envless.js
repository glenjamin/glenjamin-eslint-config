function stuff() {
  return { a: 1 };
}

stuff();

definedLater();

function definedLater() {
  return 1 + 1;
}
