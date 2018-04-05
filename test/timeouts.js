import './spec.js'
import {expect, assert} from 'chai'
import sinon from 'sinon'
import {funcTest} from '../src/bot.js'

describe('Timeouts', function(){
  it('can do foo', function(){
    const result = []
    result.length.should.equal(0)
  })
  it('can stub', function(){
    let callback = sinon.stub()
    callback()
    callback()
    callback()

    const calls = callback.callCount
    assert(calls === 3, `There were ${calls} callbacks made`)
  })
  it('can mock', function(){
    const send = sinon.stub()
    const mock = {
      1: {
        channel: {
          send: send,
        },
      },
    }
    funcTest(mock, 1)

    const calls = send.callCount
    assert(calls === 1, `There were ${calls} send calls made`)
  })
})
