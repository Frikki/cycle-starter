import {h} from '@cycle/dom'
import latestObj from 'rx-combine-latest-obj'
import {filterLinks} from 'cycle-history'
import {getUrl, extractValue, events} from 'utils'
import styles from './sidebar.styl'

const intent = ({DOM}) => ({
  hover$: events(DOM.select(`.${styles.sidebar}`), [
    `mouseenter`,
    `touchstart`,
    `mouseleave`,
  ]),

  click$: DOM
    .select(`.${styles.link}`)
    .events(`click`)
    .merge(
      DOM
        .select(`.${styles.link}`)
        .events(`touchstart`),
    ).filter(filterLinks),
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
  h(`div`,
  {
    className: isHovered ? styles.pinned : styles.sidebar,
  }, [
    h(`span`,
      {className: styles.menuIcon},
      []
    ),
    h(`div`, {
      className: styles.menu,
    }, [
      h(`ul`, {
        className: styles.list,
      }, [
        h(`li.${styles.item}`, [
          h(`a`, {href: `/`, className: styles.link}, [`Home`]),
        ]),
        h(`li.${styles.item}`, [
          h(`a`, {href: `/docs`, className: styles.link}, [`Docs`]),
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
