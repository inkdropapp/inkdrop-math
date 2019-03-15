"use strict";

function locator(value, fromIndex) {
  return value.indexOf('$', fromIndex);
}

const RE_MATH = /^\$((?:\\\$|[^$])+)\$/;

function tokenizer(eat, value, silent) {
  const match = RE_MATH.exec(value);

  if (match) {
    if (silent) {
      return true;
    }

    return eat(match[0])({
      type: 'inlineCode',
      value: match[1].trim(),
      data: {
        hProperties: {
          lang: 'inline_math'
        }
      }
    });
  }
}

tokenizer.locator = locator;
tokenizer.notInLink = true;
module.exports = tokenizer;
//# sourceMappingURL=remark-math-inline-parser.js.map