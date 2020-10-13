/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module remark:parse:tokenize:code-fenced
 * @fileoverview Tokenise fenced code.
 */
'use strict';
/* Dependencies. */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var trim = require('trim-trailing-lines');
/* Expose. */


var _default = fencedCode;
/* Characters */

exports.default = _default;
var C_NEWLINE = '\n';
var C_TAB = '\t';
var C_SPACE = ' ';
var C_TILDE = '~';
var C_TICK = '$';
/* Constants */

var MIN_FENCE_COUNT = 2;
var CODE_INDENT_COUNT = 4;
/**
 * Tokenise fenced code.
 *
 * @property {Function} locator.
 * @param {function(string)} eat - Eater.
 * @param {string} value - Rest of content.
 * @param {boolean?} [silent] - Whether this is a dry run.
 * @return {Node?|boolean} - `code` node.
 */

function fencedCode(eat, value, silent) {
  var self = this;
  var settings = self.options;
  var length = value.length + 1;
  var index = 0;
  var subvalue = '';
  var fenceCount;
  var marker;
  var character;
  var queue;
  var content;
  var exdentedContent;
  var closing;
  var exdentedClosing;
  var now;

  if (!settings.gfm) {
    return;
  }
  /* Eat the fence. */


  character = value.charAt(index);

  if (character !== C_TILDE && character !== C_TICK) {
    return;
  }

  index++;
  marker = character;
  fenceCount = 1;
  subvalue += character;

  while (index < length) {
    character = value.charAt(index);

    if (character !== marker) {
      break;
    }

    subvalue += character;
    fenceCount++;
    index++;
  }

  if (fenceCount < MIN_FENCE_COUNT) {
    return;
  }
  /* Eat spacing before flag. */


  while (index < length) {
    character = value.charAt(index);

    if (character !== C_SPACE && character !== C_TAB) {
      break;
    }

    subvalue += character;
    index++;
  }
  /* Eat flag. */


  queue = '';

  while (index < length) {
    character = value.charAt(index);

    if (character === C_NEWLINE || character === C_TILDE || character === C_TICK) {
      break;
    }

    queue += character;
    index++;
  }

  character = value.charAt(index);

  if (character && character !== C_NEWLINE) {
    return;
  }

  if (silent) {
    return true;
  }

  now = eat.now();
  now.column += subvalue.length;
  now.offset += subvalue.length;

  if (queue) {
    subvalue += queue;
  }

  queue = closing = exdentedClosing = content = exdentedContent = '';
  /* Eat content. */

  while (index < length) {
    character = value.charAt(index);
    content += closing;
    exdentedContent += exdentedClosing;
    closing = exdentedClosing = '';

    if (character !== C_NEWLINE) {
      content += character;
      exdentedClosing += character;
      index++;
      continue;
    }
    /* Add the newline to `subvalue` if its the first
     * character.  Otherwise, add it to the `closing`
     * queue. */


    if (content) {
      closing += character;
      exdentedClosing += character;
    } else {
      subvalue += character;
    }

    queue = '';
    index++;

    while (index < length) {
      character = value.charAt(index);

      if (character !== marker) {
        break;
      }

      queue += character;
      index++;
    }

    closing += queue;
    exdentedClosing += queue;

    if (queue.length < fenceCount) {
      continue;
    }

    queue = '';

    while (index < length) {
      character = value.charAt(index);

      if (character !== C_SPACE && character !== C_TAB) {
        break;
      }

      closing += character;
      exdentedClosing += character;
      index++;
    }

    if (!character || character === C_NEWLINE) {
      break;
    }
  }

  subvalue += content + closing;
  return eat(subvalue)({
    type: 'code',
    lang: 'math',
    value: trim(exdentedContent)
  });
}