var _ = require('lodash')

//https://codereview.stackexchange.com/questions/52119/calculate-all-possible-combinations-of-an-array-of-arrays-or-strings
const combinations = array => {
  if (!array.length) {
    return []
  }

  // wrap non-array values
  // e.g. ['x',['y','z']] becomes [['x'],['y','z']]
  array = array.map(function(item){
    return item instanceof Array ? item : [ item ]
  })

  // internal recursive function
  function combine(list){
    var prefixes, combinations

    if (list.length === 1) {
      return list[0]
    }

    prefixes = list[0]
    combinations = combine(list.slice(1)) // recurse

    // produce a flat list of each of the current
    // set of values prepended to each combination
    // of the remaining sets.
    return prefixes.reduce(function(memo, prefix){
      return memo.concat(
        combinations.map(function(combination){
          return [ prefix ].concat(combination)
        })
      )
    }, [])
  }

  return combine(array)
}

export const substituteVocabularyArgNames = commandConfig => {
  // TODO test directly?
  const help = _.clone(commandConfig.vocabulary)
  _.each(commandConfig.template.input, input => {
    const name = _.toUpper(input.name) // TODO formatting: bold name with **?
    // sub Number in vocab as a side effect
    const vocabSub = [ `[${name}]` ]
    const index = _.indexOf(help, input.type, _.isEqual)
    _.fill(help, vocabSub, index, index + 1)
  })
  // console.log(help, _.join(help, ' '))
  // return _.join(help, ' ')
  // const permutations = _.map(help, h => {
  //   // console.log('h', h, typeof(h))
  //   if (typeof(h) === 'object'){ return _.size(h)} return 1})
  // console.log(help, permutations)
  // const vocabularyVariations = []
  // _.reduce([1, 2], function(prev, i) {
  //
  //   return _.concat(prev, it);
  // }, []);
  // console.log('halp?', help,combinations(help),
  // _.map(combinations(help), h => {if (typeof(h) ==='string'){return h} return _.join(h, ' ')}) )
  // return _.map(combinations(help), h => {if (typeof(h) ==='string'){return h} return _.join(h, ' ')})
  return _.map(combinations(help), h => _.join(h, ' '))
}

export const substituteInputParamsForHelp = command => {
  // TODO rename command commandConfig?
  // let help = _.clone(command.vocabulary)
  const inputDesc = _.map(command.template.input, input => {
    const name = _.toUpper(input.name) // TODO formatting: bold name with **?
    const units = input.units ? `(${input.units})` : ''
    // sub Number in vocab as a side effect
    // const vocabSub = `[${name}]`
    // const index = _.indexOf(help, input.type)
    // _.fill(help, vocabSub, index, index + 1)
    return _.join(
      _.filter([ name, units, '-', input.description ], it => it),
      ' '
    )
  })
  return _.concat(
    substituteVocabularyArgNames(command).join('\n'),
    inputDesc,
    command.template.additionalHelp
  )
}

export const generateHelpForCommands = commands => {
  return _.reverse(
    _.map(commands, command => {
      return substituteInputParamsForHelp(command).join('\n\t')
    })
  ).join('\n\n')
}

export const generateHelp = (intro, commands) => {
  return [ intro, 'commands:', generateHelpForCommands(commands) ].join('\n\n')
}

export const listExamples = command => {
  // let help = _.clone(command.vocabulary)
  const examples = _.map(command.examples, example => {
    const ex = `\`${example.input}\``
    return _.join([ ex, '-', example.name ], ' ')
  })
  return _.concat(_.head(substituteVocabularyArgNames(command)), examples)
}

export const generateExamplesForCommands = commands => {
  return _.reverse(
    _.map(commands, command => {
      return listExamples(command).join('\n\t')
    })
  ).join('\n\n')
}

export const generateExamples = (commandName, commands) => {
  return [
    `${commandName} examples:`,
    generateExamplesForCommands(commands),
  ].join('\n\n')
}
