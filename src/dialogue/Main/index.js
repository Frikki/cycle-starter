/* @flow */
import { h } from 'driver/snabbdom';
import { Observable } from 'rx';

// InputCount component
function InputCount(sources) {
  const id = `.component-count`;

  function intent({ DOM }) {
    return {
      value$: DOM
        .select(id)
        .events(`input`)
        .map(ev => ev.target.value),
    };
  }

  function model({ props$, actions }) {
    const initialValue$ = props$.map(props => props.value).take(1);
    return initialValue$.concat(actions.value$).map(value => ({value}));
  }

  function view(state$) {
    return state$.map(
      (state) => h(`input${id}`, {
        type: `range`,
        max: `1000`,
        min: `1`,
        value: state.value,
        style: {
          width: `100%`,
        },
      })
    );
  }

  const actions = intent(sources);
  const state$ = model({props$: sources.props$, actions});

  return {
    DOM: view(state$),
    state$: state$,
  };
}

// Silly component
function Silly(id) {
  return {
    DOM: Observable.of(
      h(`div`, {
        style: {
          border: `1px solid rgb(221, 221, 221)`,
          display: `inline-block`,
          margin: `8px`,
          padding: `8px`,
        },
      }, `Silly Component #${id}`)
    ),
  };
}

// MAIN
function Main(sources) {
  const inputCount = InputCount({
    DOM: sources.DOM, props$: Observable.of({value: 10}),
  });

  const component$s$ = inputCount.state$.map(
    (state) => Array.apply(null, Array(parseInt(state.value)))
        .map((v, i) => Silly(i + 1).DOM)
  );

  return {
    DOM: inputCount.state$.combineLatest(
      inputCount.DOM,
      component$s$,
      (state, inputCountVTree, componentDOMs) => h(`div`, [
        h(`h2`, `# of Silly Components: ${state.value}`),
        inputCountVTree,
        h(`div`, componentDOMs),
      ])
    ),
  };
}

export default Main;
