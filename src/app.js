import { run } from '@cycle/core';
import { makeDOMDriver } from 'driver/snabbdom';

import Main from 'dialogue/Main';

run(Main, {
  DOM: makeDOMDriver(`#app`),
});
