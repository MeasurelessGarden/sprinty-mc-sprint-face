// import {unroll} from './spec.js'
// import {expect, assert} from 'chai'
// import sinon from 'sinon'
// import {funcTest} from '../src/bot.js'
// // var unroll = require('unroll')
// // unroll.use(it)
//
// describe('Timeouts', function(){
//   it('can do foo', function(){
//     const result = []
//     result.length.should.equal(0)
//   })
//   it('can stub', function(){
//     let callback = sinon.stub()
//     callback()
//     callback()
//     callback()
//
//     const calls = callback.callCount
//     assert(calls === 3, `There were ${calls} callbacks made`)
//   })
//   it('can mock', function(){
//     const send = sinon.stub()
//     const mock = {
//       1: {
//         channel: {
//           send: send,
//         },
//       },
//     }
//     funcTest(mock, 1)
//
//     const calls = send.callCount
//     assert(calls === 1, `There were ${calls} send calls made`)
//   })
// })
// // describe('maximum of two numbers (unrolled)', function() {
// //     unroll('maximum of #a and #b is #c',
// //       function(done, testArgs) {
// //         expect(
// //           Math.max(testArgs['a'], testArgs['b'])
// //         ).to.be.equal(testArgs['c']);
// //         done();
// //       },
// //       [
// //         ['a', 'b', 'c'],
// //         [ 3,   5,   5 ],
// //         [ 7,   0,   7 ]
// //       ]
// //     );
// // });
// describe('maximum of two numbers (unrolled)', function() {
//     unroll('maximum of #a and #b is #c',
//       function(done, testArgs) {
//         expect(
//           Math.max(testArgs['a'], testArgs['b'])
//         ).to.be.equal(testArgs['c']);
//         done();
//       },
//       `
//         where:
//         a   |   b   |   c
//         3   |   5   |   5
//         7   |   0   |   7
//       `
//     );
// });
