var _ = require('lodash')

export const preparseMessage = message => {
  return _.toLower(
    _.trim(_.replace(_.replace(message, /[^\w]/g, ' '), /\s\s*/g, ' '))
  )
}
