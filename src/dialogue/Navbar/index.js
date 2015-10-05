const {Rx} = require(`@cycle/core`)
const {h} = require(`@cycle/dom`)
const latestObj = require(`rx-combine-latest-obj`)
const {filterLinks} = require(`cycle-history`)
const {getUrl, extractValue} = require(`../../utils`)
const styles = require(`./Navbar.styl`)

const intent = ( { DOM } ) => ({
  scroll$: Rx.Observable.fromEvent(document, `scroll`),
  click$: DOM
    .select(`.${styles.link}`)
    .events(`click`)
    .merge(
      DOM
        .select(`.${styles.link}`)
        .events(`touchstart`)
    ).filter(filterLinks),
})

const model = ({
  click$,
  scroll$,
}, { History } ) => latestObj({

  url: click$
    .map(getUrl)
    .startWith(History.value.pathname),

  isScrolled: scroll$.map(e => {
    if (e.target.scrollTop > 200) {
      return true
    }
    return false
  }),

}).distinctUntilChanged()

const view = state$ => state$.map(
  ({ }) => h(`div`, {className: styles.navbar}, [
    h(`button`, {className: styles.menu}, [`Menu`, `+`]),
    h(`h1`, {className: styles.title}, [`Cycle-Starter`]),
    h(`span`),
    h(`ul.${styles.list}`, [
      h(`li.${styles.item}`, [
        h(`a.${styles.link}`, {href: `/`}, `Home`),
      ]),
      h(`li.${styles.item}`, [
        h(`a.${styles.link}`, {href: `/about`}, `About Me`),
      ]),
    ]),
  ]
)).distinctUntilChanged()

function Navbar(responses) {
  const actions = intent(responses)
  const state$ = model(actions, responses)
  const view$ = view(state$)
  return {
    DOM: view$,
    url$: extractValue(`url`, state$),
  }
}

export default Navbar
