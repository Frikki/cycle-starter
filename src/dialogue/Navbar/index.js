import {h} from '@cycle/dom'
import latestObj from 'rx-combine-latest-obj'
import styles from './navbar.styl'
import mainStyles from 'dialogue/Main/main.styl'

const intent = ({DOM}) => ({
  scroll$: DOM
    .select(`.${mainStyles.contentContainer}`)
    .events(`scroll`),
})

const model = ({
  scroll$,
}) => latestObj({
  isScrolled: scroll$
    .map(e => e.target.scrollTop > 70 === true)
    .startWith(false),
})

const view = state$ => state$.map(({
  isScrolled,
}) =>
  h(`div`,
  {
    className: isScrolled ? styles.scrolled : styles.navbar,
  },
  [
    h(`h1`, {className: styles.title}, [`Cycle-Starter`]),
    h(`span`),
  ])
)

const Navbar = responses => {
  const actions = intent(responses)
  const state$ = model(actions)
  const view$ = view(state$)
  return {
    DOM: view$,
  }
}

export default Navbar
export {Navbar}
