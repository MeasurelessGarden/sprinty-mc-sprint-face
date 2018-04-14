var _ = require('lodash')
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import {expect, assert} from 'chai'
import sinon from 'sinon'
export const unroll = require('unroll')
unroll.use(it)

const equalDateTime = (expected, actual) => {
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
  // expect (actualDatetime).to.be.equalDateTime(expectedDatetime)
  equalDateTime(date, this._obj)
})

chai.Assertion.addChainableMethod('equalSprintDefinition', function(
  expectedSprint
){
  const actualSprint = this._obj

  this.assert(
    actualSprint._type === expectedSprint._type,
    'expected #{this} to be of type #{exp} but got #{act}',
    expectedSprint._type,
    actualSprint._type
  )
  this.assert(
    _.has(actualSprint, 'sprint'),
    'expected definition to have sprint block'
  )
  this.assert(
    _.has(actualSprint, 'timeout'),
    'expected definition to have timeout block'
  )
  this.assert(
    _.has(actualSprint.sprint, 'start'),
    'expected sprint to have start'
  )
  this.assert(_.has(actualSprint.sprint, 'end'), 'expected sprint to have end')
  this.assert(
    _.has(actualSprint.timeout, 'start'),
    'expected timeout to have start'
  )
  this.assert(
    _.has(actualSprint.timeout, 'end'),
    'expected timeout to have end'
  )
  expect(actualSprint.sprint.start).to.be.equals(expectedSprint.start)
  expect(actualSprint.sprint.end).to.be.equals(expectedSprint.end)
})

before(function(){
  chai.use(chaiAsPromised)
  chai.should()
  chai.expect()
})
