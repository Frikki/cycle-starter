/* @flow */
import { h } from 'driver/snabbdom';
import { Observable } from 'rx';

// InputCount component
function InputCount(sources) {
  const id = `.component-count`;
  const initialValue$ = sources.value$.take(1);
  const newValue$ = sources.DOM
    .select(id)
    .events(`input`)
    .map(ev => ev.target.value);
  const value$ = initialValue$.concat(newValue$);

  return {
    DOM: value$.map(
      (value) => h(`input${id}`, {
        props: {
          type: `range`,
          max: `512`,
          min: `1`,
          value,
        },
        style: {
          width: `100%`,
        },
      })
    ),
    value$,
  };
}

// CycleJSLogo component
function CycleJSLogo(id) {
  return {
    DOM: Observable.just(
      h(`div`, {
        style: {
          alignItems: `center`,
          background: `url(http://cycle.js.org/img/cyclejs_logo.svg)`,
          boxSizing: `border-box`,
          display: `inline-flex`,
          fontFamily: `sans-serif`,
          fontWeight: `700`,
          fontSize: `8px`,
          height: `32px`,
          justifyContent: `center`,
          margin: `8px`,
          width: `32px`,
        },
      }, [`${id}`])
    ),
  };
}

// Main
function Main(sources) {
  const inputCount = InputCount({
    DOM: sources.DOM, value$: Observable.just(64),
  });

  const component$s$ = inputCount.value$.map(
    (value) => Array.apply(null, Array(parseInt(value)))
        .map((v, i) => CycleJSLogo(i + 1).DOM)
  );

  return {
    DOM: inputCount.value$.combineLatest(
      inputCount.DOM,
      component$s$,
      (value, inputCountVTree, componentDOMs) => h(`div`, [
        h(`h2`, `# of Components: ${value}`),
        inputCountVTree,
        h(`div`, componentDOMs),
      ])
    ),
  };
}

export default Main;
