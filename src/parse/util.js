var _ = require('lodash')

export const preparseMessage = message => {
  return _.toLower(
    _.trim(_.replace(_.replace(message, /[^\w]/g, ' '), /\s\s*/g, ' '))
  )
}

export const parse = (message, command, args) => {
  // assumes message is cleaned by preparse first
  // const split = _.split(message, ' ')
  const parseArgsEquality = (value, arg) => {
    console.log('????', arg, value)

    if (_.isEqual(arg, 'Number')) {
      return Number(value) >= 0
    }
    return _.isEqual(value, arg)
  }
  const matches = []
  let messageArr = _.split(message, ' ')
  const maybe = _.takeWhile(_.concat([ command ], args), function(param){
    console.log('internal', messageArr, param)
    if (messageArr.length == 0) return false

    const result = _.intersectionWith(messageArr, [ param ], parseArgsEquality)
    if (result) {
      const index = _.indexOf(messageArr, result[0])
      matches.push(messageArr[index])
      messageArr = _.takeRight(messageArr, messageArr.length - index)
      // _.remove(messageArr, function(it) {
      // return it != result[0]
      // })
      console.log('remove some', messageArr)
      // _.pullAt(messageArr,0)
    }
    return result
    // if(messageArr[0] === param) {
    //   matches.push(messageArr[0])
    //   _.pullAt(messageArr, 0)
    //   return true
    // }
    // _.pullAt(messageArr, 0)
    // return false
  })
  console.log('IDEA', maybe, matches)
  return matches
  // return _.intersectionWith(_.split(message, ' '), _.concat([command], args), parseArgsEquality);
}
