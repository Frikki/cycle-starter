/* global location, require */
const getUrl = event => {
  return event.target.href.replace(location.origin, ``)
}

const extractValue = (val, obs) => obs.map(obj => obj[val])

export {
  getUrl,
  extractValue
}
