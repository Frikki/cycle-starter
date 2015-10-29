/* global describe it */
import chai from 'chai'
import vdom from 'chai-virtual-dom'
chai.use(vdom)
const { expect } = chai

import { run } from '@cycle/core'
import { makeDOMDriver, h } from '@cycle/dom'
import { makeHistoryDriver } from '@cycle/history'
import Main from './index'

function createRenderTarget(id = `cycleTest`) {
  const element = document.createElement(`div`)
  element.className = `cycleTest`
  element.id = id
  document.body.appendChild(element)
  return element
}

describe(`Main`, () => {
  it(`should run as main()`, done => {

    const [sinks, sources] = run(Main, {
      DOM: makeDOMDriver(createRenderTarget()),
      History: makeHistoryDriver(),
    })

    sinks.DOM
      .take(1)
      .subscribe(view => {
        expect(view).to.look.exactly.like(
          h(`div`, {}, [
            h(`button.increment`, `+1`),
            h(`p`, `0`),
            h(`button.decrement`, `-1`),
          ])
        )
      })

    done()
  })
})
