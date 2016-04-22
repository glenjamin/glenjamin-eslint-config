(function() {
  var a;

  function stuff() {
    return { a: 1 };
  }

  stuff();

  definedLater();

  function definedLater() {
    return a + a;
  }
})();
