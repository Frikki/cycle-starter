import {run} from '@cycle/core'
import {makeDOMDriver} from '@cycle/dom'
import {makeHistoryDriver} from 'cycle-history'
import {Main} from './dialogue/Main'

const drivers = {
  DOM: makeDOMDriver(`.app`),
  History: makeHistoryDriver({
    hash: false,
    queries: true,
  }),
}

run(Main, drivers)
