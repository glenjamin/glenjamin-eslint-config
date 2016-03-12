module.exports = {
    "extends": "eslint:recommended",
    "rules": {
        "camelcase": 0,
        "comma-dangle": 0,
        "comma-spacing": 2,
        "consistent-return": 2,
        "curly": [2, "multi-line"],
        "dot-notation": [2, { "allowKeywords": true }],
        "eol-last": 2,
        "eqeqeq": 0,
        "handle-callback-err": [2, "^err"],
        "key-spacing": [2, { "beforeColon": false, "afterColon": true }],
        "keyword-spacing": 2,
        "max-depth": [2, 5],
        "max-len": [2, 80, 4],
        "new-cap": 0,
        "new-parens": 2,
        "no-alert": 2,
        "no-array-constructor": 2,
        "no-caller": 2,
        "no-catch-shadow": 2,
        "no-console": 2, // opt-in per file if needed
        "no-else-return": 2,
        "no-eq-null": 2,
        "no-eval": 2,
        "no-extend-native": 2,
        "no-extra-bind": 2,
        "no-extra-parens": [2, "functions"],
        "no-implied-eval": 2,
        "no-iterator": 2,
        "no-label-var": 2,
        "no-labels": 2,
        "no-lone-blocks": 2,
        "no-lonely-if": 2,
        "no-loop-func": 2,
        "no-mixed-requires": [2, true],
        "no-multi-spaces": 2,
        "no-multi-str": 2,
        "no-native-reassign": 2,
        "no-new": 2,
        "no-new-func": 2,
        "no-new-object": 2,
        "no-new-wrappers": 2,
        "no-octal-escape": 2,
        "no-path-concat": 0,
        "no-process-exit": 2, // opt-in per file if needed
        "no-proto": 2,
        "no-return-assign": 2,
        "no-script-url": 2,
        "no-sequences": 2,
        "no-shadow": 2,
        "no-shadow-restricted-names": 2,
        "no-spaced-func": 2,
        "no-trailing-spaces": 2,
        "no-undef-init": 2,
        "no-underscore-dangle": 2,
        "no-unused-expressions": 2,
        "no-unused-vars": [2, "all"],
        "no-use-before-define": [2, "nofunc"],
        "no-with": 2,
        "quotes": 0,
        "semi": 2,
        "semi-spacing": [2, {"before": false, "after": true}],
        "space-infix-ops": 2,
        "space-unary-ops": [2, { "words": true, "nonwords": false }],
        "strict": 0,
        "yoda": [2, "never"],
    }
};
