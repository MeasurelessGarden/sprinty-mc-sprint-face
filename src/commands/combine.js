//https://codereview.stackexchange.com/questions/52119/calculate-all-possible-combinations-of-an-array-of-arrays-or-strings
export const combinations = array => {
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
