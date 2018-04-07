var _ = require('lodash')
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import {expect, assert} from 'chai'
import sinon from 'sinon'
export const unroll = require('unroll')
unroll.use(it)

const equalDateTime = (expected, actual) => {
  console.log('exp', expectedDate, 'act', actualDate)
  const expectedDate = expected.toISOString()
  const actualDate = actual.toISOString()
  // return
  assert(
    expectedDate === actualDate,
    'expected ' + actualDate + ' to equal' + expectedDate,
    'expected ' + actualDate + ' to not equal' + expectedDate
  )
}

//https://teamgaslight.com/blog/how-we-handled-the-problem-of-js-date-slash-time-equality
chai.Assertion.addChainableMethod('equalDateTime', function(date){
  equalDateTime(date, this._obj)
})

chai.Assertion.addChainableMethod('equalSprintDefinition', function(
  expectedSprint
){
  const actualSprint = this._obj
  console.log('exp', expectedSprint, 'act', actualSprint)

  this.assert(
    actualSprint._type === expectedSprint._type,
    'expected #{this} to be of type #{exp} but got #{act}',
    expectedSprint._type,
    actualSprint._type
  )
  this.assert(_.has(actualSprint, 'start'), 'expected sprint to have start')
  this.assert(_.has(actualSprint, 'end'), 'expected sprint to have end')
  equalDateTime(expectedSprint.start, actualSprint.start)
  equalDateTime(expectedSprint.end, actualSprint.end)
})

before(function(){
  chai.use(chaiAsPromised)
  chai.should()
  chai.expect()
})
