/* global location, require */
import {Rx} from '@cycle/core'

const getUrl = event => {
  return event.target.href.replace(location.origin, ``)
}

const extractValue = (val, obs) => obs.map(obj => obj[val])

const events = (selector, _events) => {
  return Rx.Observable.merge(
    _events.map(event => selector.events(event))
  )
}

export {
  getUrl,
  extractValue,
  events
}
