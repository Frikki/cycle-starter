let {h} = require(`@cycle/dom`)

const routes = {
  '/': h(`h1`, {}, `Hello, world!`),
  '/about': h(`h1`, {}, `About me`),
  '*': h(`Page could not be found`),
}

export default routes
