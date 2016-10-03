// https://en.wikipedia.org/wiki/Backus%E2%80%93Naur_Form

/*
<syntax>         ::= <rule> | <rule> <syntax>
<rule>           ::= <opt-whitespace> "<" <rule-name> ">" <opt-whitespace> "::=" <opt-whitespace> <expression> <RULE_EOL>
<opt-whitespace> ::= " " <opt-whitespace> | ""
<expression>     ::= <list> | <list> <opt-whitespace> "|" <opt-whitespace> <expression>
<RULE_EOL>       ::= <opt-whitespace> <RULE_EOL> | <RULE_EOL> <RULE_EOL>
<list>           ::= <term> | <term> <opt-whitespace> <list>
<term>           ::= <literal> | "<" <rule-name> ">"
<literal>        ::= '"' <text1> '"' | "'" <text2> "'"
<text1>          ::= "" | <RULE_CHARACTER1> <text1>
<text2>          ::= "" | <RULE_CHARACTER2> <text2>
<RULE_CHARACTER>      ::= <RULE_LETTER> | <RULE_DIGIT> | <RULE_SYMBOL>
<RULE_LETTER>         ::= "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z" | "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z"
<RULE_DIGIT>          ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
<RULE_SYMBOL>         ::= "-" | "!" | "#" | "$" | "%" | "&" | "(" | ")" | "*" | "+" | "," | "-" | "." | "/" | ":" | ";" | "<" | "=" | ">" | "?" | "@" | "[" | "\" | "]" | "^" | "_" | "`" | "{" | "|" | "}" | "~"
<RULE_CHARACTER1>     ::= <RULE_CHARACTER> | "'"
<RULE_CHARACTER2>     ::= <RULE_CHARACTER> | '"'
<rule-name>      ::= <RULE_LETTER> | <rule-name> <RULE_CHAR>
<RULE_CHAR>      ::= <RULE_LETTER> | <RULE_DIGIT> | "-"
*/

import { findChildrenByType } from '../SemanticHelpers';

import { IRule, Parser as _Parser, IToken } from '..';

namespace BNF {
  export const RULES: IRule[] = [
    {
      name: 'syntax',
      bnf: [
        ['RULE_EOL*', 'rule+']
      ]
    }, {
      name: 'rule',
      bnf: [
        ['" "*', '"<"', 'rule-name', '">"', '" "*', '"::="', 'firstExpression', 'otherExpression*', '" "*', 'RULE_EOL+', '" "*']
      ]
    }, {
      name: 'firstExpression',
      bnf: [
        ['" "*', 'list']
      ]
    }, {
      name: 'otherExpression',
      bnf: [
        ['" "*', '"|"', '" "*', 'list'],
      ]
    }, {
      name: 'RULE_EOL',
      bnf: [
        ['"\\r"'],
        ['"\\n"']
      ]
    }, {
      name: 'list',
      bnf: [
        ['term', '" "*', 'list'],
        ['term']
      ]
    }, {
      name: 'term',
      bnf: [
        ['literal'],
        ['"<"', 'rule-name', '">"'],
      ]
    }, {
      name: 'literal',
      bnf: [
        [`'"'`, 'RULE_CHARACTER1*', `'"'`],
        [`"'"`, 'RULE_CHARACTER2*', `"'"`],
      ]
    }, {
      name: 'RULE_CHARACTER',
      bnf: [['" "'], ['RULE_LETTER'], ['RULE_DIGIT'], ['RULE_SYMBOL']]
    }, {
      name: 'RULE_LETTER',
      bnf: [
        ['"A"'], ['"B"'], ['"C"'], ['"D"'], ['"E"'], ['"F"'], ['"G"'], ['"H"'], ['"I"'], ['"J"'], ['"K"'], ['"L"'], ['"M"'], ['"N"'], ['"O"'], ['"P"'], ['"Q"'], ['"R"'], ['"S"'], ['"T"'], ['"U"'], ['"V"'], ['"W"'], ['"X"'], ['"Y"'], ['"Z"'], ['"a"'], ['"b"'], ['"c"'], ['"d"'], ['"e"'], ['"f"'], ['"g"'], ['"h"'], ['"i"'], ['"j"'], ['"k"'], ['"l"'], ['"m"'], ['"n"'], ['"o"'], ['"p"'], ['"q"'], ['"r"'], ['"s"'], ['"t"'], ['"u"'], ['"v"'], ['"w"'], ['"x"'], ['"y"'], ['"z"']
      ]
    }, {
      name: 'RULE_DIGIT',
      bnf: [
        ['"0"'], ['"1"'], ['"2"'], ['"3"'], ['"4"'], ['"5"'], ['"6"'], ['"7"'], ['"8"'], ['"9"']
      ]
    }, {
      name: 'RULE_SYMBOL',
      bnf: [
        ['"-"'], ['"_"'], ['"!"'], ['"#"'], ['"$"'], ['"%"'], ['"&"'], ['"("'], ['")"'], ['"*"'], ['"+"'], ['","'], ['"-"'], ['"."'], ['"/"'], ['":"'], ['";"'], ['"<"'], ['"="'], ['">"'], ['"?"'], ['"@"'], ['"["'], ['"\\"'], ['"]"'], ['"^"'], ['"_"'], ['"`"'], ['"{"'], ['"|"'], ['"}"'], ['"~"']
      ]
    }, {
      name: 'RULE_CHARACTER1',
      bnf: [['RULE_CHARACTER'], [`"'"`]]
    }, {
      name: 'RULE_CHARACTER2',
      bnf: [['RULE_CHARACTER'], [`'"'`]]
    }, {
      name: 'rule-name',
      bnf: [['RULE_LETTER', 'RULE_CHAR*']]
    }, {
      name: 'RULE_CHAR',
      bnf: [['RULE_LETTER'], ['RULE_DIGIT'], ['"_"'], ['"-"']]
    }
  ];

  export const parser = new _Parser(RULES, {});

  function getAllTerms(expr: IToken): string[] {
    let terms = findChildrenByType(expr, 'term').map(term => {
      return findChildrenByType(term, 'literal').concat(findChildrenByType(term, 'rule-name'))[0].text;
    });

    findChildrenByType(expr, 'list').forEach(expr => {
      terms = terms.concat(getAllTerms(expr));
    });

    return terms;
  }


  export function getRules(source: string): IRule[] {
    let ast = parser.getAST(source);

    if (!ast) throw new Error('Could not parse ' + source);

    if (ast.errors && ast.errors.length) {
      throw ast.errors[0];
    }

    let rules = findChildrenByType(ast, 'rule');

    let ret = rules.map(rule => {
      let name = findChildrenByType(rule, 'rule-name')[0].text;

      let expressions =
        findChildrenByType(rule, 'firstExpression')
          .concat(findChildrenByType(rule, 'otherExpression'));

      let bnf = [];

      expressions.forEach(expr => {
        bnf.push(getAllTerms(expr));
      });

      return {
        name: name,
        bnf
      };
    });

    if (!ret.some(x => x.name == 'EOL')) {
      ret.push({
        name: 'EOL',
        bnf: [['"\\r\\n"', '"\\r"', '"\\n"']]
      });
    }

    return ret;
  }

  export function Transform(source: TemplateStringsArray): IRule[] {
    return getRules(source.join(''));
  }

  export class Parser extends _Parser {
    constructor(source: string, options) {
      super(getRules(source), options);
    }
  }
}

export default BNF;