var _ = require('lodash')
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import {expect, assert} from 'chai'
import sinon from 'sinon'
// import {unroll} from 'unroll'
export const unroll = require('unroll')
// import {unroll} from 'unroll'
unroll.use(it)

// chai.Assertion.addChainableMethod('equalTime', function(time) {
//   var expected = time.getTime(),
//       actual = this._obj.getTime();
//
//   return this.assert(
//     actual == expected,
//     'expected ' + this._obj + ' to equal ' + time,
//     'expected ' + this._obj + ' to not equal ' + time
//   );
// });

// chai.Assertion.addChainableMethod('equalDate', function(date) {
//   var expectedDate  = date.toDateString(),
//       actualDate    = this._obj.toDateString();
//   console.log('???', actualDate, expectedDate, date.toISOString())
//
//   return this.assert(
//     expectedDate === actualDate,
//     'expected ' + actualDate + ' to equal' + expectedDate,
//     'expected ' + actualDate + ' to not equal' + expectedDate
//   )
// });

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
  // const expectedDate = date.toISOString()
  // const actualDate = this._obj.toISOString()
  // return this.assert(
  //   expectedDate === actualDate,
  //   'expected ' + actualDate + ' to equal' + expectedDate,
  //   'expected ' + actualDate + ' to not equal' + expectedDate
  // )
  equalDateTime(date, this._obj)
})

// const self = this
chai.Assertion.addChainableMethod('equalSprintDefinition', function(
  expectedSprint
){
  const results = []
  const actualSprint = this._obj
  // new chai.Assertion(this._obj).to.be.instanceof({})
  // expect(typeof {value: 'value'}).toBe('object')
  // new chai.Assertion(typeof this._obj).to.be.equal('object')
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
  // this.assert(equalDateTime(expectedSprint.start, actualSprint.start), )
  // second, our type check
  // this.assert(
  //     obj._type === type
  //   , "expected #{this} to be of type #{exp} but got #{act}"
  //   , "expected #{this} to not be of type #{act}"
  //   , type        // expected
  //   , obj._type   // actual
  // )
  // self.assert.isObject(actualSprint)
  // console.log('omg wat',new chai.Assertion(actualSprint))
  // new chai.Assertion(actualSprint).isObject()
  // console.log('wtfff.f',this.assert)
  // results.push(
  //   this.assert.isObject(actualSprint)
  // )
  // console.logs(results, results[0])
  // results.push(expect(actualSprint.start).to.exist())
  // results.push(this.expect (actualSprint.start).to.be.equalDateTime(expectedSprint.start))

  //   const expectedDate = expectedSprint.start.toISOString()
  //   const actualDate = actualSprint.start.toISOString()
  // return this.assert(
  //   expectedDate === actualDate,
  //   'expected ' + actualDate + ' to equal' + expectedDate,
  //   'expected ' + actualDate + ' to not equal' + expectedDate
  // )
  // return results[0]
})

before(function(){
  chai.use(chaiAsPromised)
  chai.should()
  chai.expect()
  // unroll.use(it)
})

// export default {expect, assert, unroll}
// console.log(type(unroll))
// export expect
// export assert
