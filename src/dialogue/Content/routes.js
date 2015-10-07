let {h} = require(`@cycle/dom`)

const routes = {
  '/': h(`h1`, {}, `Hello, world!`),
  '/docs': h(`h1`, {}, `Docs`),
  '*': h(`h1`, `Page could not be found`),
}

export default routes
