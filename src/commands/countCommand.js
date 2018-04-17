import {SetCount} from '../generator/countGenerator.js'
export const countIntro = 'Track wordcounts.'

/*
what is my count now?
add XYZ to my count
i got NNN
i have XYZ

"new words"?
300 new words -> adds to total count

*/

const CountInput = countType => {
  return {
    name: `${countType} count`,
    type: 'Number', // TODO validate that a command cannot use this template unless it has the right args inside it (include default param - meaning not required for this, and also has a value)
    units: `${countType}s`,
    description: 'must be >= 0',
    checks: [ arg => arg >= 0 ],
  }
}

const WordCountTemplate = {
  input: [ CountInput('word') ],
  call: (...args) => {
    return new SetCount(args[1], 'word')
  },
  additionalHelp: 'Set your current word count.',
}

export const countCommands = [
  // order is used to resolve commands without conflicts
  // {
  //   vocabulary: [ ['set'], [ 'wc', 'total', 'final', 'wordcount' ], 'Number' ], // TODO implied by version without 'set'?
  //   template: WordCountTemplate,
  //   examples: [
  //
  //   ]
  // },
  {
    vocabulary: [ 'Number', [ 'words' ] ],
    template: WordCountTemplate,
    examples: [
      {
        name: 'natural',
        input: 'I got 1000 words!!!!',
        tags: [ 'natural' ],
        tests: [ {wordCount: 1000} ],
      },
      {
        name: 'basic',
        input: '200 words',
        tags: [ 'basic' ],
        tests: [ {wordCount: 200} ],
      },
    ],
  },
  {
    vocabulary: [ [ 'word' ], [ 'count' ], 'Number' ],
    template: WordCountTemplate,
    examples: [
      {
        name: 'extra words',
        input: 'set word count to 700',
        tags: [ 'natural' ],
        tests: [ {wordCount: 700} ],
      },
      {
        name: 'final',
        input: 'final word count 400',
        tags: [ 'alternate wording' ],
        tests: [ {wordCount: 400} ],
      },
      {
        name: 'total',
        input: 'total word count 300',
        tags: [ 'alternate wording' ],
        tests: [ {wordCount: 300} ],
      },
    ],
  },
  {
    vocabulary: [
      [ 'wc', 'total', 'final', 'wordcount', 'wrote', 'finished' ],
      'Number',
    ],
    template: WordCountTemplate,
    examples: [
      // {
      //     name: 'natural',
      //     input: 'set my count to 500', // TODO 'count' probably does something *slightly* different, given the future feature of specifying type of sprint
      //     tags: ['natural', 'alternate wording'],
      //     tests: [
      //       {wordCount:500}
      //     ]
      //   },
      {
        name: 'natural',
        input: 'i finished with 200',
        tags: [ 'natural', 'alternate wording' ],
        tests: [ {wordCount: 200} ],
      },
      {
        name: 'natural',
        input: 'wrote 640 this time',
        tags: [ 'natural', 'alternate wording' ],
        tests: [ {wordCount: 640} ],
      },
      {
        name: 'wordcount',
        input: 'wordcount 734',
        tags: [ 'alternate wording' ],
        tests: [ {wordCount: 734} ],
      },
      {
        name: 'total',
        input: 'total 300',
        tags: [ 'alternate wording' ],
        tests: [ {wordCount: 300} ],
      },
      {
        name: 'final',
        input: 'final 700',
        tags: [ 'alternate wording' ],
        tests: [ {wordCount: 700} ],
      },
      {
        name: 'straight-forward',
        input: 'wc 230',
        tags: [ 'literal', 'basic' ],
        tests: [
          {
            // previousCount: undefined,
            wordCount: 230,
          },
          // {
          //   // previousTime: '2018-04-15T05:30:00',
          //   // previousCount: 20,
          //   // calledTime: '2018-04-15T06:00:00',
          //   wordCount: 230,
          //   // diff: 210,
          //   // duration: '30 minutes',
          // },
          // {
          //   // previousTime: '2018-04-1505:30:00',
          //   // previousCount: 100,
          //   // calledTime: '2018-04-16T06:00:00',
          //   wordCount: 230,
          //   // diff: 130,
          //   // duration: 'since yesterday',
          // },
        ],
      },
      {
        name: 'natural',
        input: 'I think my wc is 400 rn', // I think my wc should be 200 actually
        tags: [ 'natural' ],
        tests: [
          {
            // previousCount: undefined,
            wordCount: 400,
          },
        ],
      },
      {
        name: 'natural',
        input: 'I think my wc should be 200 actually',
        tags: [ 'natural' ],
        tests: [
          {
            // previousCount: 300,
            wordCount: 200,
            // diff: -100,
          },
        ],
      },
    ],
    // TODO invalidExamples: [],
  },
]
