import {Rx} from '@cycle/core'
import {h} from '@cycle/dom'
import styles from './main.styl'

import Navbar from 'dialogue/Navbar'
import Sidebar from 'dialogue/Sidebar'
import Content from 'dialogue/Content'

const view = (
  navbar,
  sidebar,
  content,
) => h(`div`, {
  className: styles.app,
}, [
  sidebar,
  h(`div`, {
    className: styles.contentContainer,
  }, [
    navbar,
    content,
  ]),
])

const Main = responses => {
  const navbar = Navbar(responses)
  const sidebar = Sidebar(responses)
  const content = Content(responses)
  const view$ = Rx.Observable.just(view(
    navbar.DOM,
    sidebar.DOM,
    content.DOM,
  ))
  return {
    DOM: view$,
    History: sidebar.url$,
  }
}

export {Main}
