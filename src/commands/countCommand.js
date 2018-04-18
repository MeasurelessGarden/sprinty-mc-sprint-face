import {setCount, addCount} from '../generator/countGenerator.js'

export const countIntro = 'Track wordcounts.'

/*
what is my count now?
add XYZ to my count
i got NNN
i have XYZ

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

const AddWordCountTemplate = {
  input: [ CountInput('word') ],
  call: (count, previousCount) => {
    return addCount(count, previousCount, 'word')
  },
  additionalHelp: 'Add to your current word count.',
}

const WordCountTemplate = {
  input: [ CountInput('word') ],
  call: (count, previousCount) => {
    // TODO do I want SetCount to use previous count??
    return setCount(count, 'word')
  },
  additionalHelp: 'Set your current word count.',
}

export const countCommands = [
  // order is used to resolve commands without conflicts
  {
    vocabulary: [ 'Number', [ 'new' ], [ 'words' ] ],
    template: AddWordCountTemplate,
    examples: [
      {
        name: 'natural',
        input: '1000 new words!!!!',
        tags: [ 'natural' ],
        tests: [
          {
            previous: 0,
            wordCount: 1000,
            delta: 1000,
          },
          {
            previous: undefined,
            wordCount: 1000,
            delta: 1000,
          },
          {
            previous: 500,
            wordCount: 1500,
            delta: 1000,
          },
        ],
      },
      {
        name: 'basic',
        input: '200 new words',
        tags: [ 'basic' ],
        tests: [
          {
            previous: 0,
            wordCount: 200,
            delta: 200,
          },
          {
            previous: undefined,
            wordCount: 200,
            delta: 200,
          },
          {
            previous: 500,
            wordCount: 700,
            delta: 200,
          },
        ],
      },
    ],
  },
  {
    vocabulary: [ [ 'add' ], 'Number', [ 'words' ] ],
    template: AddWordCountTemplate,
    examples: [
      {
        name: 'natural',
        input: 'add 1000 words!!!!',
        tags: [ 'natural' ],
        tests: [
          {
            previous: 0,
            wordCount: 1000,
            delta: 1000,
          },
          {
            previous: undefined,
            wordCount: 1000,
            delta: 1000,
          },
          {
            previous: 500,
            wordCount: 1500,
            delta: 1000,
          },
        ],
      },
      {
        name: 'basic',
        input: 'add 200 words',
        tags: [ 'basic' ],
        tests: [
          {
            previous: 0,
            wordCount: 200,
            delta: 200,
          },
          {
            previous: undefined,
            wordCount: 200,
            delta: 200,
          },
          {
            previous: 500,
            wordCount: 700,
            delta: 200,
          },
        ],
      },
      {
        name: 'misleading',
        input: 'add -200 words',
        tags: [ 'confusing' ],
        tests: [
          {
            previous: 0,
            wordCount: 200,
            delta: 200,
          },
        ],
      },
    ],
  },
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
