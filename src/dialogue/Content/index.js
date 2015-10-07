import {h} from '@cycle/dom'
import latestObj from 'rx-combine-latest-obj'
import switchPath from 'switch-path'
import {GSAP} from 'utils/gsap-widget'
import routes from './routes'
import styles from './content.styl'

function validateValue([zero, one]) {
  if (!zero || zero === one) {
    return ``
  }
  return zero
}

function getRouteValue(location) {
  const {value} = switchPath(location.pathname, routes)
  return value
}

const enterOptions = {
  time: 1,
  from: {
    css: {
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

const model = ({
  History,
}) => latestObj({
  routeValue: History
    .map(getRouteValue)
    .startWith(null)
    .pairwise(),
}).distinctUntilChanged()

const view = state$ => state$.map(({
  routeValue,
}) =>
  h(`div`, {
      className: styles.content,
    }, [
        h(`div`, {} ,[
          GSAP(exitOptions, [
            validateValue(routeValue),
          ]),
          GSAP(enterOptions, [
            routeValue[1],
          ]),
        ]),
        h(`div`, {
          style: {height: `500rem`},
        }, []),
      ]
  )).distinctUntilChanged()

const Content = responses => {
  const state$ = model(responses)
  const view$ = view(state$)
  return {
    DOM: view$,
  }
}

export default Content
export {Content}
