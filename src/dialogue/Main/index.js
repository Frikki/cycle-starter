const {h} = require(`@cycle/dom`)
const latestObj = require(`rx-combine-latest-obj`)
const switchPath = require(`switch-path`)
const {GSAP} = require(`../../utils/gsap-widget`)
const routes = require(`./routes`)
const styles = require(`./main.styl`)
const Navbar = require(`../Navbar`)

function getRouteValue(location) {
  const {value} = switchPath(location.pathname, routes)
  return value
}

//const intent = ( {} ) => {}

const model = ( { History } ) => latestObj({
  routeValue: History
    .startWith(History.value)
    .map(getRouteValue)
    .startWith(null)
    .pairwise(),
}).distinctUntilChanged()

const enterOptions = {
  time: 1,
  from: {
    css: {
      position: `absolute`,
      opacity: 0,
      transform: `translate3d(30em, 0, 0) rotateZ(100deg) scale(0.1)`,
    },
  },
  to: {
    css: {
      opacity: 1,
      transform: `translate3d(0,0,0) rotateZ(0) scale(1)`,
    },
  },
}

const exitOptions = {
  time: 1,
  from: {
    css: {
      position: `absolute`,
      opacity: 1,
      transform: `translate3d(0, 0, 0) rotateX(0) scale(1)`,
    },
  },
  to: {
    opacity: 0,
    transform: `translate3d(10em, 5em, -1000px) rotateX(90deg) scale(0.1)`,
  },
}

function validateValue([zero, one]) {
  if (!zero || zero === one) {
    return ``
  }
  return zero
}

const view = (state$, navbar) => state$
  .map(
    ({ routeValue }) => h(`div.${styles.app}`, {}, [
      navbar,
      GSAP(exitOptions, [
        validateValue(routeValue),
      ]),
      GSAP(enterOptions, [
        routeValue[1],
      ]),
    ]
  )).distinctUntilChanged()

const Main = responses => {
  const navbar = Navbar(responses)

  //const actions = intent(responses)
  const state$ = model(responses)
  const view$ = view(state$, navbar.DOM)

  return {
    DOM: view$,
    History: navbar.url$,
  }
}

export {Main}
