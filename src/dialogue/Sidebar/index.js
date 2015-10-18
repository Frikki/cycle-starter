import {h} from '@cycle/dom'
import latestObj from 'rx-combine-latest-obj'
import {filterLinks} from 'cycle-history'
import {getUrl, extractValue, events, dot} from 'utils'
import styles from './sidebar.styl'
const {
  div,
  span,
  ul,
  li,
  a,
} = require(`hyperscript-helpers`)(h)

const intent = ({DOM}) => ({
  hover$: events(DOM.select(dot(styles.sidebar)), [
    `mouseenter`,
    `touchstart`,
    `mouseleave`,
  ]),

  click$: events(
    DOM.select(dot(styles.link)), [
      `click`,
      `touchstart`,
    ])
    .filter(filterLinks),
})

const model = ({
  hover$,
  click$,
}, {
  History,
}) => latestObj({
  isHovered: hover$
    .map(e => e.type === `mouseenter` || e.type === `touchstart`)
    .startWith(false)
    .merge(
      click$.map(() => false)
    ),

  url: click$
    .map(getUrl)
    .startWith(History.value.pathname),

}).distinctUntilChanged()

const view = state$ => state$.map(({
  isHovered,
}) =>
  div({
    className: isHovered ? styles.pinned : styles.sidebar,
  }, [
    span(dot(styles.menuIcon)),
    div(dot(styles.menu), {}, [
      ul(dot(styles.list), {}, [
        li(dot(styles.item), [
          a(dot(styles.link), {href: `/`}, [`Home`]),
        ]),
        li(dot(styles.item), [
          a(dot(styles.link), {href: `/docs`}, [`Docs`]),
        ]),
      ]),
    ]),
  ])).distinctUntilChanged()

const Sidebar = responses => {
  const actions = intent(responses)
  const state$ = model(actions, responses)
  const view$ = view(state$)
  return {
    DOM: view$,
    url$: extractValue(`url`, state$),
  }
}

export default Sidebar
export {Sidebar}
