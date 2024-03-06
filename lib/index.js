'use strict';

var inkdrop = require('inkdrop');
var React = require('react');

function ok$1() {}

/**
 * Get the count of the longest repeating streak of `substring` in `value`.
 *
 * @param {string} value
 *   Content to search in.
 * @param {string} substring
 *   Substring to look for, typically one character.
 * @returns {number}
 *   Count of most frequent adjacent `substring`s in `value`.
 */
function longestStreak(value, substring) {
  const source = String(value);
  let index = source.indexOf(substring);
  let expected = index;
  let count = 0;
  let max = 0;
  if (typeof substring !== 'string') {
    throw new TypeError('Expected substring');
  }
  while (index !== -1) {
    if (index === expected) {
      if (++count > max) {
        max = count;
      }
    } else {
      count = 1;
    }
    expected = index + substring.length;
    index = source.indexOf(substring, expected);
  }
  return max;
}

/**
 * @typedef {import('hast').Element} HastElement
 * @typedef {import('hast').ElementContent} HastElementContent
 * @typedef {import('mdast-util-from-markdown').CompileContext} CompileContext
 * @typedef {import('mdast-util-from-markdown').Extension} FromMarkdownExtension
 * @typedef {import('mdast-util-from-markdown').Handle} FromMarkdownHandle
 * @typedef {import('mdast-util-to-markdown').Handle} ToMarkdownHandle
 * @typedef {import('mdast-util-to-markdown').Options} ToMarkdownExtension
 * @typedef {import('../index.js').InlineMath} InlineMath
 * @typedef {import('../index.js').Math} Math
 *
 * @typedef ToOptions
 *   Configuration.
 * @property {boolean | null | undefined} [singleDollarTextMath=true]
 *   Whether to support math (text) with a single dollar (default: `true`).
 *
 *   Single dollars work in Pandoc and many other places, but often interfere
 *   with “normal” dollars in text.
 *   If you turn this off, you can still use two or more dollars for text math.
 */


/**
 * Create an extension for `mdast-util-from-markdown`.
 *
 * @returns {FromMarkdownExtension}
 *   Extension for `mdast-util-from-markdown`.
 */
function mathFromMarkdown() {
  return {
    enter: {
      mathFlow: enterMathFlow,
      mathFlowFenceMeta: enterMathFlowMeta,
      mathText: enterMathText
    },
    exit: {
      mathFlow: exitMathFlow,
      mathFlowFence: exitMathFlowFence,
      mathFlowFenceMeta: exitMathFlowMeta,
      mathFlowValue: exitMathData,
      mathText: exitMathText,
      mathTextData: exitMathData
    }
  };

  /**
   * @this {CompileContext}
   * @type {FromMarkdownHandle}
   */
  function enterMathFlow(token) {
    /** @type {HastElement} */
    const code = {
      type: 'element',
      tagName: 'code',
      properties: {
        className: ['language-math', 'math-display']
      },
      children: []
    };
    this.enter({
      type: 'math',
      meta: null,
      value: '',
      data: {
        hName: 'pre',
        hChildren: [code]
      }
    }, token);
  }

  /**
   * @this {CompileContext}
   * @type {FromMarkdownHandle}
   */
  function enterMathFlowMeta() {
    this.buffer();
  }

  /**
   * @this {CompileContext}
   * @type {FromMarkdownHandle}
   */
  function exitMathFlowMeta() {
    const data = this.resume();
    const node = this.stack[this.stack.length - 1];
    ok$1(node.type === 'math');
    node.meta = data;
  }

  /**
   * @this {CompileContext}
   * @type {FromMarkdownHandle}
   */
  function exitMathFlowFence() {
    // Exit if this is the closing fence.
    if (this.data.mathFlowInside) return;
    this.buffer();
    this.data.mathFlowInside = true;
  }

  /**
   * @this {CompileContext}
   * @type {FromMarkdownHandle}
   */
  function exitMathFlow(token) {
    const data = this.resume().replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, '');
    const node = this.stack[this.stack.length - 1];
    ok$1(node.type === 'math');
    this.exit(token);
    node.value = data;
    // @ts-expect-error: we defined it in `enterMathFlow`.
    const code = /** @type {HastElement} */node.data.hChildren[0];
    ok$1(code.type === 'element');
    ok$1(code.tagName === 'code');
    code.children.push({
      type: 'text',
      value: data
    });
    this.data.mathFlowInside = undefined;
  }

  /**
   * @this {CompileContext}
   * @type {FromMarkdownHandle}
   */
  function enterMathText(token) {
    this.enter({
      type: 'inlineMath',
      value: '',
      data: {
        hName: 'code',
        hProperties: {
          className: ['language-math', 'math-inline']
        },
        hChildren: []
      }
    }, token);
    this.buffer();
  }

  /**
   * @this {CompileContext}
   * @type {FromMarkdownHandle}
   */
  function exitMathText(token) {
    const data = this.resume();
    const node = this.stack[this.stack.length - 1];
    ok$1(node.type === 'inlineMath');
    this.exit(token);
    node.value = data;
    const children = /** @type {Array<HastElementContent>} */
    // @ts-expect-error: we defined it in `enterMathFlow`.
    node.data.hChildren;
    children.push({
      type: 'text',
      value: data
    });
  }

  /**
   * @this {CompileContext}
   * @type {FromMarkdownHandle}
   */
  function exitMathData(token) {
    this.config.enter.data.call(this, token);
    this.config.exit.data.call(this, token);
  }
}

/**
 * Create an extension for `mdast-util-to-markdown`.
 *
 * @param {ToOptions | null | undefined} [options]
 *   Configuration (optional).
 * @returns {ToMarkdownExtension}
 *   Extension for `mdast-util-to-markdown`.
 */
function mathToMarkdown(options) {
  let single = (options || {}).singleDollarTextMath;
  if (single === null || single === undefined) {
    single = true;
  }
  inlineMath.peek = inlineMathPeek;
  return {
    unsafe: [{
      character: '\r',
      inConstruct: 'mathFlowMeta'
    }, {
      character: '\n',
      inConstruct: 'mathFlowMeta'
    }, {
      character: '$',
      after: single ? undefined : '\\$',
      inConstruct: 'phrasing'
    }, {
      character: '$',
      inConstruct: 'mathFlowMeta'
    }, {
      atBreak: true,
      character: '$',
      after: '\\$'
    }],
    handlers: {
      math,
      inlineMath
    }
  };

  /**
   * @type {ToMarkdownHandle}
   * @param {Math} node
   */
  // Note: fixing this code? Please also fix the similar code for code:
  // <https://github.com/syntax-tree/mdast-util-to-markdown/blob/main/lib/handle/code.js>
  function math(node, _, state, info) {
    const raw = node.value || '';
    const tracker = state.createTracker(info);
    const sequence = '$'.repeat(Math.max(longestStreak(raw, '$') + 1, 2));
    const exit = state.enter('mathFlow');
    let value = tracker.move(sequence);
    if (node.meta) {
      const subexit = state.enter('mathFlowMeta');
      value += tracker.move(state.safe(node.meta, {
        after: '\n',
        before: value,
        encode: ['$'],
        ...tracker.current()
      }));
      subexit();
    }
    value += tracker.move('\n');
    if (raw) {
      value += tracker.move(raw + '\n');
    }
    value += tracker.move(sequence);
    exit();
    return value;
  }

  /**
   * @type {ToMarkdownHandle}
   * @param {InlineMath} node
   */
  // Note: fixing this code? Please also fix the similar code for inline code:
  // <https://github.com/syntax-tree/mdast-util-to-markdown/blob/main/lib/handle/inline-code.js>
  function inlineMath(node, _, state) {
    let value = node.value || '';
    let size = 1;
    if (!single) size++;

    // If there is a single dollar sign on its own in the math, use a fence of
    // two.
    // If there are two in a row, use one.
    while (new RegExp('(^|[^$])' + '\\$'.repeat(size) + '([^$]|$)').test(value)) {
      size++;
    }
    const sequence = '$'.repeat(size);

    // If this is not just spaces or eols (tabs don’t count), and either the
    // first and last character are a space or eol, or the first or last
    // character are dollar signs, then pad with spaces.
    if (
    // Contains non-space.
    /[^ \r\n]/.test(value) && (
    // Starts with space and ends with space.
    /^[ \r\n]/.test(value) && /[ \r\n]$/.test(value) ||
    // Starts or ends with dollar.
    /^\$|\$$/.test(value))) {
      value = ' ' + value + ' ';
    }
    let index = -1;

    // We have a potential problem: certain characters after eols could result in
    // blocks being seen.
    // For example, if someone injected the string `'\n# b'`, then that would
    // result in an ATX heading.
    // We can’t escape characters in `inlineMath`, but because eols are
    // transformed to spaces when going from markdown to HTML anyway, we can swap
    // them out.
    while (++index < state.unsafe.length) {
      const pattern = state.unsafe[index];

      // Only look for `atBreak`s.
      // Btw: note that `atBreak` patterns will always start the regex at LF or
      // CR.
      if (!pattern.atBreak) continue;
      const expression = state.compilePattern(pattern);
      /** @type {RegExpExecArray | null} */
      let match;
      while (match = expression.exec(value)) {
        let position = match.index;

        // Support CRLF (patterns only look for one of the characters).
        if (value.codePointAt(position) === 10 /* `\n` */ && value.codePointAt(position - 1) === 13 /* `\r` */) {
          position--;
        }
        value = value.slice(0, position) + ' ' + value.slice(match.index + 1);
      }
    }
    return sequence + value + sequence;
  }

  /**
   * @returns {string}
   */
  function inlineMathPeek() {
    return '$';
  }
}

/**
 * @typedef {import('micromark-util-types').Code} Code
 */


/**
 * Check whether a character code is a markdown line ending.
 *
 * A **markdown line ending** is the virtual characters M-0003 CARRIAGE RETURN
 * LINE FEED (CRLF), M-0004 LINE FEED (LF) and M-0005 CARRIAGE RETURN (CR).
 *
 * In micromark, the actual character U+000A LINE FEED (LF) and U+000D CARRIAGE
 * RETURN (CR) are replaced by these virtual characters depending on whether
 * they occurred together.
 *
 * @param {Code} code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
function markdownLineEnding(code) {
  return code !== null && code < -2;
}

/**
 * Check whether a character code is a markdown space.
 *
 * A **markdown space** is the concrete character U+0020 SPACE (SP) and the
 * virtual characters M-0001 VIRTUAL SPACE (VS) and M-0002 HORIZONTAL TAB (HT).
 *
 * In micromark, the actual character U+0009 CHARACTER TABULATION (HT) is
 * replaced by one M-0002 HORIZONTAL TAB (HT) and between 0 and 3 M-0001 VIRTUAL
 * SPACE (VS) characters, depending on the column at which the tab occurred.
 *
 * @param {Code} code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
function markdownSpace(code) {
  return code === -2 || code === -1 || code === 32;
}

/**
 * @typedef {import('micromark-util-types').Effects} Effects
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenType} TokenType
 */


// To do: implement `spaceOrTab`, `spaceOrTabMinMax`, `spaceOrTabWithOptions`.

/**
 * Parse spaces and tabs.
 *
 * There is no `nok` parameter:
 *
 * *   spaces in markdown are often optional, in which case this factory can be
 *     used and `ok` will be switched to whether spaces were found or not
 * *   one line ending or space can be detected with `markdownSpace(code)` right
 *     before using `factorySpace`
 *
 * ###### Examples
 *
 * Where `␉` represents a tab (plus how much it expands) and `␠` represents a
 * single space.
 *
 * ```markdown
 * ␉
 * ␠␠␠␠
 * ␉␠
 * ```
 *
 * @param {Effects} effects
 *   Context.
 * @param {State} ok
 *   State switched to when successful.
 * @param {TokenType} type
 *   Type (`' \t'`).
 * @param {number | undefined} [max=Infinity]
 *   Max (exclusive).
 * @returns {State}
 *   Start state.
 */
function factorySpace(effects, ok, type, max) {
  const limit = max ? max - 1 : Number.POSITIVE_INFINITY;
  let size = 0;
  return start;

  /** @type {State} */
  function start(code) {
    if (markdownSpace(code)) {
      effects.enter(type);
      return prefix(code);
    }
    return ok(code);
  }

  /** @type {State} */
  function prefix(code) {
    if (markdownSpace(code) && size++ < limit) {
      effects.consume(code);
      return prefix;
    }
    effects.exit(type);
    return ok(code);
  }
}

/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */

/** @type {Construct} */
const mathFlow = {
  tokenize: tokenizeMathFenced,
  concrete: true
};

/** @type {Construct} */
const nonLazyContinuation = {
  tokenize: tokenizeNonLazyContinuation,
  partial: true
};

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeMathFenced(effects, ok, nok) {
  const self = this;
  const tail = self.events[self.events.length - 1];
  const initialSize = tail && tail[1].type === 'linePrefix' ? tail[2].sliceSerialize(tail[1], true).length : 0;
  let sizeOpen = 0;
  return start;

  /**
   * Start of math.
   *
   * ```markdown
   * > | $$
   *     ^
   *   | \frac{1}{2}
   *   | $$
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter('mathFlow');
    effects.enter('mathFlowFence');
    effects.enter('mathFlowFenceSequence');
    return sequenceOpen(code);
  }

  /**
   * In opening fence sequence.
   *
   * ```markdown
   * > | $$
   *      ^
   *   | \frac{1}{2}
   *   | $$
   * ```
   *
   * @type {State}
   */
  function sequenceOpen(code) {
    if (code === 36) {
      effects.consume(code);
      sizeOpen++;
      return sequenceOpen;
    }
    if (sizeOpen < 2) {
      return nok(code);
    }
    effects.exit('mathFlowFenceSequence');
    return factorySpace(effects, metaBefore, 'whitespace')(code);
  }

  /**
   * In opening fence, before meta.
   *
   * ```markdown
   * > | $$asciimath
   *       ^
   *   | x < y
   *   | $$
   * ```
   *
   * @type {State}
   */

  function metaBefore(code) {
    if (code === null || markdownLineEnding(code)) {
      return metaAfter(code);
    }
    effects.enter('mathFlowFenceMeta');
    effects.enter('chunkString', {
      contentType: 'string'
    });
    return meta(code);
  }

  /**
   * In meta.
   *
   * ```markdown
   * > | $$asciimath
   *        ^
   *   | x < y
   *   | $$
   * ```
   *
   * @type {State}
   */
  function meta(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit('chunkString');
      effects.exit('mathFlowFenceMeta');
      return metaAfter(code);
    }
    if (code === 36) {
      return nok(code);
    }
    effects.consume(code);
    return meta;
  }

  /**
   * After meta.
   *
   * ```markdown
   * > | $$
   *       ^
   *   | \frac{1}{2}
   *   | $$
   * ```
   *
   * @type {State}
   */
  function metaAfter(code) {
    // Guaranteed to be eol/eof.
    effects.exit('mathFlowFence');
    if (self.interrupt) {
      return ok(code);
    }
    return effects.attempt(nonLazyContinuation, beforeNonLazyContinuation, after)(code);
  }

  /**
   * After eol/eof in math, at a non-lazy closing fence or content.
   *
   * ```markdown
   *   | $$
   * > | \frac{1}{2}
   *     ^
   * > | $$
   *     ^
   * ```
   *
   * @type {State}
   */
  function beforeNonLazyContinuation(code) {
    return effects.attempt({
      tokenize: tokenizeClosingFence,
      partial: true
    }, after, contentStart)(code);
  }

  /**
   * Before math content, definitely not before a closing fence.
   *
   * ```markdown
   *   | $$
   * > | \frac{1}{2}
   *     ^
   *   | $$
   * ```
   *
   * @type {State}
   */
  function contentStart(code) {
    return (initialSize ? factorySpace(effects, beforeContentChunk, 'linePrefix', initialSize + 1) : beforeContentChunk)(code);
  }

  /**
   * Before math content, after optional prefix.
   *
   * ```markdown
   *   | $$
   * > | \frac{1}{2}
   *     ^
   *   | $$
   * ```
   *
   * @type {State}
   */
  function beforeContentChunk(code) {
    if (code === null) {
      return after(code);
    }
    if (markdownLineEnding(code)) {
      return effects.attempt(nonLazyContinuation, beforeNonLazyContinuation, after)(code);
    }
    effects.enter('mathFlowValue');
    return contentChunk(code);
  }

  /**
   * In math content.
   *
   * ```markdown
   *   | $$
   * > | \frac{1}{2}
   *      ^
   *   | $$
   * ```
   *
   * @type {State}
   */
  function contentChunk(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit('mathFlowValue');
      return beforeContentChunk(code);
    }
    effects.consume(code);
    return contentChunk;
  }

  /**
   * After math (ha!).
   *
   * ```markdown
   *   | $$
   *   | \frac{1}{2}
   * > | $$
   *       ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    effects.exit('mathFlow');
    return ok(code);
  }

  /** @type {Tokenizer} */
  function tokenizeClosingFence(effects, ok, nok) {
    let size = 0;
    /**
     * Before closing fence, at optional whitespace.
     *
     * ```markdown
     *   | $$
     *   | \frac{1}{2}
     * > | $$
     *     ^
     * ```
     */
    return factorySpace(effects, beforeSequenceClose, 'linePrefix', self.parser.constructs.disable.null.includes('codeIndented') ? undefined : 4);

    /**
     * In closing fence, after optional whitespace, at sequence.
     *
     * ```markdown
     *   | $$
     *   | \frac{1}{2}
     * > | $$
     *     ^
     * ```
     *
     * @type {State}
     */
    function beforeSequenceClose(code) {
      effects.enter('mathFlowFence');
      effects.enter('mathFlowFenceSequence');
      return sequenceClose(code);
    }

    /**
     * In closing fence sequence.
     *
     * ```markdown
     *   | $$
     *   | \frac{1}{2}
     * > | $$
     *      ^
     * ```
     *
     * @type {State}
     */
    function sequenceClose(code) {
      if (code === 36) {
        size++;
        effects.consume(code);
        return sequenceClose;
      }
      if (size < sizeOpen) {
        return nok(code);
      }
      effects.exit('mathFlowFenceSequence');
      return factorySpace(effects, afterSequenceClose, 'whitespace')(code);
    }

    /**
     * After closing fence sequence, after optional whitespace.
     *
     * ```markdown
     *   | $$
     *   | \frac{1}{2}
     * > | $$
     *       ^
     * ```
     *
     * @type {State}
     */
    function afterSequenceClose(code) {
      if (code === null || markdownLineEnding(code)) {
        effects.exit('mathFlowFence');
        return ok(code);
      }
      return nok(code);
    }
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeNonLazyContinuation(effects, ok, nok) {
  const self = this;
  return start;

  /** @type {State} */
  function start(code) {
    if (code === null) {
      return ok(code);
    }
    effects.enter('lineEnding');
    effects.consume(code);
    effects.exit('lineEnding');
    return lineStart;
  }

  /** @type {State} */
  function lineStart(code) {
    return self.parser.lazy[self.now().line] ? nok(code) : ok(code);
  }
}

/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 * @typedef {import('micromark-util-types').Previous} Previous
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Token} Token
 *
 * @typedef Options
 *   Configuration.
 * @property {boolean | null | undefined} [singleDollarTextMath=true]
 *   Whether to support math (text) with a single dollar (default: `true`).
 *
 *   Single dollars work in Pandoc and many other places, but often interfere
 *   with “normal” dollars in text.
 *   If you turn this off, you can use two or more dollars for text math.

 */

/**
 * @param {Options | null | undefined} [options={}]
 *   Configuration (default: `{}`).
 * @returns {Construct}
 *   Construct.
 */
function mathText(options) {
  const options_ = options || {};
  let single = options_.singleDollarTextMath;
  if (single === null || single === undefined) {
    single = true;
  }
  return {
    tokenize: tokenizeMathText,
    resolve: resolveMathText,
    previous
  };

  /**
   * @this {TokenizeContext}
   * @type {Tokenizer}
   */
  function tokenizeMathText(effects, ok, nok) {
    let sizeOpen = 0;
    /** @type {number} */
    let size;
    /** @type {Token} */
    let token;
    return start;

    /**
     * Start of math (text).
     *
     * ```markdown
     * > | $a$
     *     ^
     * > | \$a$
     *      ^
     * ```
     *
     * @type {State}
     */
    function start(code) {
      effects.enter('mathText');
      effects.enter('mathTextSequence');
      return sequenceOpen(code);
    }

    /**
     * In opening sequence.
     *
     * ```markdown
     * > | $a$
     *     ^
     * ```
     *
     * @type {State}
     */

    function sequenceOpen(code) {
      if (code === 36) {
        effects.consume(code);
        sizeOpen++;
        return sequenceOpen;
      }

      // Not enough markers in the sequence.
      if (sizeOpen < 2 && !single) {
        return nok(code);
      }
      effects.exit('mathTextSequence');
      return between(code);
    }

    /**
     * Between something and something else.
     *
     * ```markdown
     * > | $a$
     *      ^^
     * ```
     *
     * @type {State}
     */
    function between(code) {
      if (code === null) {
        return nok(code);
      }
      if (code === 36) {
        token = effects.enter('mathTextSequence');
        size = 0;
        return sequenceClose(code);
      }

      // Tabs don’t work, and virtual spaces don’t make sense.
      if (code === 32) {
        effects.enter('space');
        effects.consume(code);
        effects.exit('space');
        return between;
      }
      if (markdownLineEnding(code)) {
        effects.enter('lineEnding');
        effects.consume(code);
        effects.exit('lineEnding');
        return between;
      }

      // Data.
      effects.enter('mathTextData');
      return data(code);
    }

    /**
     * In data.
     *
     * ```markdown
     * > | $a$
     *      ^
     * ```
     *
     * @type {State}
     */
    function data(code) {
      if (code === null || code === 32 || code === 36 || markdownLineEnding(code)) {
        effects.exit('mathTextData');
        return between(code);
      }
      effects.consume(code);
      return data;
    }

    /**
     * In closing sequence.
     *
     * ```markdown
     * > | `a`
     *       ^
     * ```
     *
     * @type {State}
     */

    function sequenceClose(code) {
      // More.
      if (code === 36) {
        effects.consume(code);
        size++;
        return sequenceClose;
      }

      // Done!
      if (size === sizeOpen) {
        effects.exit('mathTextSequence');
        effects.exit('mathText');
        return ok(code);
      }

      // More or less accents: mark as data.
      token.type = 'mathTextData';
      return data(code);
    }
  }
}

/** @type {Resolver} */
function resolveMathText(events) {
  let tailExitIndex = events.length - 4;
  let headEnterIndex = 3;
  /** @type {number} */
  let index;
  /** @type {number | undefined} */
  let enter;

  // If we start and end with an EOL or a space.
  if ((events[headEnterIndex][1].type === 'lineEnding' || events[headEnterIndex][1].type === 'space') && (events[tailExitIndex][1].type === 'lineEnding' || events[tailExitIndex][1].type === 'space')) {
    index = headEnterIndex;

    // And we have data.
    while (++index < tailExitIndex) {
      if (events[index][1].type === 'mathTextData') {
        // Then we have padding.
        events[tailExitIndex][1].type = 'mathTextPadding';
        events[headEnterIndex][1].type = 'mathTextPadding';
        headEnterIndex += 2;
        tailExitIndex -= 2;
        break;
      }
    }
  }

  // Merge adjacent spaces and data.
  index = headEnterIndex - 1;
  tailExitIndex++;
  while (++index <= tailExitIndex) {
    if (enter === undefined) {
      if (index !== tailExitIndex && events[index][1].type !== 'lineEnding') {
        enter = index;
      }
    } else if (index === tailExitIndex || events[index][1].type === 'lineEnding') {
      events[enter][1].type = 'mathTextData';
      if (index !== enter + 2) {
        events[enter][1].end = events[index - 1][1].end;
        events.splice(enter + 2, index - enter - 2);
        tailExitIndex -= index - enter - 2;
        index = enter + 2;
      }
      enter = undefined;
    }
  }
  return events;
}

/**
 * @this {TokenizeContext}
 * @type {Previous}
 */
function previous(code) {
  // If there is a previous code, there will always be a tail.
  return code !== 36 || this.events[this.events.length - 1][1].type === 'characterEscape';
}

/**
 * @typedef {import('micromark-util-types').Extension} Extension
 * @typedef {import('./math-text.js').Options} Options
 */


/**
 * Create an extension for `micromark` to enable math syntax.
 *
 * @param {Options | null | undefined} [options={}]
 *   Configuration (default: `{}`).
 * @returns {Extension}
 *   Extension for `micromark` that can be passed in `extensions`, to
 *   enable math syntax.
 */
function math(options) {
  return {
    flow: {
      [36]: mathFlow
    },
    text: {
      [36]: mathText(options)
    }
  };
}

/// <reference types="mdast-util-math" />
/// <reference types="remark-parse" />
/// <reference types="remark-stringify" />


/** @type {Readonly<Options>} */
const emptyOptions = {};

/**
 * Add support for math.
 *
 * @param {Readonly<Options> | null | undefined} [options]
 *   Configuration (optional).
 * @returns {undefined}
 *   Nothing.
 */
function remarkMath(options) {
  // @ts-expect-error: TS is wrong about `this`.
  // eslint-disable-next-line unicorn/no-this-assignment
  const self = /** @type {Processor} */this;
  const settings = options || emptyOptions;
  const data = self.data();
  const micromarkExtensions = data.micromarkExtensions || (data.micromarkExtensions = []);
  const fromMarkdownExtensions = data.fromMarkdownExtensions || (data.fromMarkdownExtensions = []);
  const toMarkdownExtensions = data.toMarkdownExtensions || (data.toMarkdownExtensions = []);
  micromarkExtensions.push(math(settings));
  fromMarkdownExtensions.push(mathFromMarkdown());
  toMarkdownExtensions.push(mathToMarkdown(settings));
}

/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Parent} Parent
 */


/**
 * Generate an assertion from a test.
 *
 * Useful if you’re going to test many nodes, for example when creating a
 * utility where something else passes a compatible test.
 *
 * The created function is a bit faster because it expects valid input only:
 * a `node`, `index`, and `parent`.
 *
 * @param {Test} test
 *   *   when nullish, checks if `node` is a `Node`.
 *   *   when `string`, works like passing `(node) => node.type === test`.
 *   *   when `function` checks if function passed the node is true.
 *   *   when `object`, checks that all keys in test are in node, and that they have (strictly) equal values.
 *   *   when `array`, checks if any one of the subtests pass.
 * @returns {Check}
 *   An assertion.
 */
const convert =
// Note: overloads in JSDoc can’t yet use different `@template`s.
/**
 * @type {(
 *   (<Condition extends string>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & {type: Condition}) &
 *   (<Condition extends Props>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Condition) &
 *   (<Condition extends TestFunction>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Predicate<Condition, Node>) &
 *   ((test?: null | undefined) => (node?: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node) &
 *   ((test?: Test) => Check)
 * )}
 */

/**
 * @param {Test} [test]
 * @returns {Check}
 */
function (test) {
  if (test === null || test === undefined) {
    return ok;
  }
  if (typeof test === 'function') {
    return castFactory(test);
  }
  if (typeof test === 'object') {
    return Array.isArray(test) ? anyFactory(test) : propsFactory(test);
  }
  if (typeof test === 'string') {
    return typeFactory(test);
  }
  throw new Error('Expected function, string, or object as test');
};

/**
 * @param {Array<Props | TestFunction | string>} tests
 * @returns {Check}
 */
function anyFactory(tests) {
  /** @type {Array<Check>} */
  const checks = [];
  let index = -1;
  while (++index < tests.length) {
    checks[index] = convert(tests[index]);
  }
  return castFactory(any);

  /**
   * @this {unknown}
   * @type {TestFunction}
   */
  function any(...parameters) {
    let index = -1;
    while (++index < checks.length) {
      if (checks[index].apply(this, parameters)) return true;
    }
    return false;
  }
}

/**
 * Turn an object into a test for a node with a certain fields.
 *
 * @param {Props} check
 * @returns {Check}
 */
function propsFactory(check) {
  const checkAsRecord = /** @type {Record<string, unknown>} */check;
  return castFactory(all);

  /**
   * @param {Node} node
   * @returns {boolean}
   */
  function all(node) {
    const nodeAsRecord = /** @type {Record<string, unknown>} */
    /** @type {unknown} */node;

    /** @type {string} */
    let key;
    for (key in check) {
      if (nodeAsRecord[key] !== checkAsRecord[key]) return false;
    }
    return true;
  }
}

/**
 * Turn a string into a test for a node with a certain type.
 *
 * @param {string} check
 * @returns {Check}
 */
function typeFactory(check) {
  return castFactory(type);

  /**
   * @param {Node} node
   */
  function type(node) {
    return node && node.type === check;
  }
}

/**
 * Turn a custom test into a test for a node that passes that test.
 *
 * @param {TestFunction} testFunction
 * @returns {Check}
 */
function castFactory(testFunction) {
  return check;

  /**
   * @this {unknown}
   * @type {Check}
   */
  function check(value, index, parent) {
    return Boolean(looksLikeANode(value) && testFunction.call(this, value, typeof index === 'number' ? index : undefined, parent || undefined));
  }
}
function ok() {
  return true;
}

/**
 * @param {unknown} value
 * @returns {value is Node}
 */
function looksLikeANode(value) {
  return value !== null && typeof value === 'object' && 'type' in value;
}

/**
 * @param {string} d
 * @returns {string}
 */
function color(d) {
  return d;
}

/**
 * @typedef {import('unist').Node} UnistNode
 * @typedef {import('unist').Parent} UnistParent
 */


/** @type {Readonly<ActionTuple>} */
const empty = [];

/**
 * Continue traversing as normal.
 */
const CONTINUE = true;

/**
 * Stop traversing immediately.
 */
const EXIT = false;

/**
 * Do not traverse this node’s children.
 */
const SKIP = 'skip';

/**
 * Visit nodes, with ancestral information.
 *
 * This algorithm performs *depth-first* *tree traversal* in *preorder*
 * (**NLR**) or if `reverse` is given, in *reverse preorder* (**NRL**).
 *
 * You can choose for which nodes `visitor` is called by passing a `test`.
 * For complex tests, you should test yourself in `visitor`, as it will be
 * faster and will have improved type information.
 *
 * Walking the tree is an intensive task.
 * Make use of the return values of the visitor when possible.
 * Instead of walking a tree multiple times, walk it once, use `unist-util-is`
 * to check if a node matches, and then perform different operations.
 *
 * You can change the tree.
 * See `Visitor` for more info.
 *
 * @overload
 * @param {Tree} tree
 * @param {Check} check
 * @param {BuildVisitor<Tree, Check>} visitor
 * @param {boolean | null | undefined} [reverse]
 * @returns {undefined}
 *
 * @overload
 * @param {Tree} tree
 * @param {BuildVisitor<Tree>} visitor
 * @param {boolean | null | undefined} [reverse]
 * @returns {undefined}
 *
 * @param {UnistNode} tree
 *   Tree to traverse.
 * @param {Visitor | Test} test
 *   `unist-util-is`-compatible test
 * @param {Visitor | boolean | null | undefined} [visitor]
 *   Handle each node.
 * @param {boolean | null | undefined} [reverse]
 *   Traverse in reverse preorder (NRL) instead of the default preorder (NLR).
 * @returns {undefined}
 *   Nothing.
 *
 * @template {UnistNode} Tree
 *   Node type.
 * @template {Test} Check
 *   `unist-util-is`-compatible test.
 */
function visitParents(tree, test, visitor, reverse) {
  /** @type {Test} */
  let check;
  if (typeof test === 'function' && typeof visitor !== 'function') {
    reverse = visitor;
    // @ts-expect-error no visitor given, so `visitor` is test.
    visitor = test;
  } else {
    // @ts-expect-error visitor given, so `test` isn’t a visitor.
    check = test;
  }
  const is = convert(check);
  const step = reverse ? -1 : 1;
  factory(tree, undefined, [])();

  /**
   * @param {UnistNode} node
   * @param {number | undefined} index
   * @param {Array<UnistParent>} parents
   */
  function factory(node, index, parents) {
    const value = /** @type {Record<string, unknown>} */
    node && typeof node === 'object' ? node : {};
    if (typeof value.type === 'string') {
      const name =
      // `hast`
      typeof value.tagName === 'string' ? value.tagName :
      // `xast`
      typeof value.name === 'string' ? value.name : undefined;
      Object.defineProperty(visit, 'name', {
        value: 'node (' + color(node.type + (name ? '<' + name + '>' : '')) + ')'
      });
    }
    return visit;
    function visit() {
      /** @type {Readonly<ActionTuple>} */
      let result = empty;
      /** @type {Readonly<ActionTuple>} */
      let subresult;
      /** @type {number} */
      let offset;
      /** @type {Array<UnistParent>} */
      let grandparents;
      if (!test || is(node, index, parents[parents.length - 1] || undefined)) {
        // @ts-expect-error: `visitor` is now a visitor.
        result = toResult(visitor(node, parents));
        if (result[0] === EXIT) {
          return result;
        }
      }
      if ('children' in node && node.children) {
        const nodeAsParent = /** @type {UnistParent} */node;
        if (nodeAsParent.children && result[0] !== SKIP) {
          offset = (reverse ? nodeAsParent.children.length : -1) + step;
          grandparents = parents.concat(nodeAsParent);
          while (offset > -1 && offset < nodeAsParent.children.length) {
            const child = nodeAsParent.children[offset];
            subresult = factory(child, offset, grandparents)();
            if (subresult[0] === EXIT) {
              return subresult;
            }
            offset = typeof subresult[1] === 'number' ? subresult[1] : offset + step;
          }
        }
      }
      return result;
    }
  }
}

/**
 * Turn a return value into a clean result.
 *
 * @param {VisitorResult} value
 *   Valid return values from visitors.
 * @returns {Readonly<ActionTuple>}
 *   Clean result.
 */
function toResult(value) {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === 'number') {
    return [CONTINUE, value];
  }
  return value === null || value === undefined ? empty : [value];
}

/**
 * @typedef {import('unist').Node} UnistNode
 * @typedef {import('unist').Parent} UnistParent
 * @typedef {import('unist-util-visit-parents').VisitorResult} VisitorResult
 */


/**
 * Visit nodes.
 *
 * This algorithm performs *depth-first* *tree traversal* in *preorder*
 * (**NLR**) or if `reverse` is given, in *reverse preorder* (**NRL**).
 *
 * You can choose for which nodes `visitor` is called by passing a `test`.
 * For complex tests, you should test yourself in `visitor`, as it will be
 * faster and will have improved type information.
 *
 * Walking the tree is an intensive task.
 * Make use of the return values of the visitor when possible.
 * Instead of walking a tree multiple times, walk it once, use `unist-util-is`
 * to check if a node matches, and then perform different operations.
 *
 * You can change the tree.
 * See `Visitor` for more info.
 *
 * @overload
 * @param {Tree} tree
 * @param {Check} check
 * @param {BuildVisitor<Tree, Check>} visitor
 * @param {boolean | null | undefined} [reverse]
 * @returns {undefined}
 *
 * @overload
 * @param {Tree} tree
 * @param {BuildVisitor<Tree>} visitor
 * @param {boolean | null | undefined} [reverse]
 * @returns {undefined}
 *
 * @param {UnistNode} tree
 *   Tree to traverse.
 * @param {Visitor | Test} testOrVisitor
 *   `unist-util-is`-compatible test (optional, omit to pass a visitor).
 * @param {Visitor | boolean | null | undefined} [visitorOrReverse]
 *   Handle each node (when test is omitted, pass `reverse`).
 * @param {boolean | null | undefined} [maybeReverse=false]
 *   Traverse in reverse preorder (NRL) instead of the default preorder (NLR).
 * @returns {undefined}
 *   Nothing.
 *
 * @template {UnistNode} Tree
 *   Node type.
 * @template {Test} Check
 *   `unist-util-is`-compatible test.
 */
function visit(tree, testOrVisitor, visitorOrReverse, maybeReverse) {
  /** @type {boolean | null | undefined} */
  let reverse;
  /** @type {Test} */
  let test;
  /** @type {Visitor} */
  let visitor;
  if (typeof testOrVisitor === 'function' && typeof visitorOrReverse !== 'function') {
    test = undefined;
    visitor = testOrVisitor;
    reverse = visitorOrReverse;
  } else {
    // @ts-expect-error: assume the overload with test was given.
    test = testOrVisitor;
    // @ts-expect-error: assume the overload with test was given.
    visitor = visitorOrReverse;
    reverse = maybeReverse;
  }
  visitParents(tree, test, overload, reverse);

  /**
   * @param {UnistNode} node
   * @param {Array<UnistParent>} parents
   */
  function overload(node, parents) {
    const parent = parents[parents.length - 1];
    const index = parent ? parent.children.indexOf(node) : undefined;
    return visitor(node, index, parent);
  }
}

const remarkMath2Code = () => {
  return tree => {
    visit(tree, {
      type: 'math'
    }, element => {
      element.type = 'code';
      element.lang = 'math';
      element.data.hChildren = undefined;
      element.data.hName = undefined;
      element.data.hProperties = {
        lang: 'math'
      };
    });
    visit(tree, {
      type: 'inlineMath'
    }, element => {
      element.type = 'inlineCode';
      element.lang = 'inline_math';
      element.data.hChildren = undefined;
      element.data.hName = undefined;
      element.data.hProperties = {
        lang: 'inline_math'
      };
    });
  };
};

console.log('module.paths:', module.paths);
const MATH_MODE_INFO = {
  name: 'math',
  mime: 'text/x-latex',
  mode: 'stex',
  ext: [],
  alias: ['inline_math']
};
const ReactMath = /*#__PURE__*/React.lazy(() => Promise.resolve().then(function () { return require('./react-math-BqpappuS.js'); }));
module.exports = {
  activate() {
    if (inkdrop.markdownRenderer) {
      inkdrop.markdownRenderer.remarkPlugins.push(remarkMath);
      inkdrop.markdownRenderer.remarkPlugins.push(remarkMath2Code);
      inkdrop.markdownRenderer.remarkCodeComponents.math = ReactMath;
      inkdrop.markdownRenderer.remarkCodeComponents.inline_math = ReactMath;
    }
    if (inkdrop.CodeMirror) {
      inkdrop.CodeMirror.modeInfo.push(MATH_MODE_INFO);
    }
  },
  deactivate() {
    if (inkdrop.markdownRenderer) {
      inkdrop.markdownRenderer.remarkPlugins = inkdrop.markdownRenderer.remarkPlugins.filter(plugin => remarkMath !== plugin);
      inkdrop.markdownRenderer.remarkPlugins = inkdrop.markdownRenderer.remarkPlugins.filter(plugin => ![remarkMath, remarkMath2Code].includes(plugin));
      inkdrop.markdownRenderer.remarkCodeComponents.math = null;
      inkdrop.markdownRenderer.remarkCodeComponents.inline_math = null;
    }
    if (inkdrop.CodeMirror) {
      const {
        modeInfo
      } = inkdrop.CodeMirror;
      const i = modeInfo.indexOf(MATH_MODE_INFO);
      if (i >= 0) modeInfo.splice(i, 1);
    }
  }
};
//# sourceMappingURL=index.js.map
