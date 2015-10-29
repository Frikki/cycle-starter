import {Observable, BehaviorSubject} from 'rx';
import snabbdom from 'snabbdom';
import h from 'snabbdom/h';
import {getDomElement} from './utils';
import fromEvent from './fromEvent';
import parseTree from './parseTree';

function makeEventsSelector(element$) {
  return function events(eventName, useCapture = false) {
    if (typeof eventName !== `string`) {
      throw new Error(`DOM driver's events() expects argument to be a ` +
        `string representing the event type to listen for.`);
    }
    return element$.flatMapLatest(element => {
      if (!element) {
        return Observable.empty();
      }
      return fromEvent(element, eventName, useCapture);
    }).share();
  };
}

function makeElementSelector(rootElem$) {
  return function select(selector) {
    if (typeof selector !== `string`) {
      throw new Error(`DOM driver's select() expects first argument to be a ` +
        `string as a CSS selector`);
    }
    let element$ = selector.trim() === `:root` ? rootElem$ :
      rootElem$.map(rootElem => {
        return rootElem.querySelectorAll(selector);
      });
    return {
      observable: element$,
      events: makeEventsSelector(element$),
    };
  };
}

function makeDOMDriver(container, modules = [
  require(`snabbdom/modules/class`),
  require(`snabbdom/modules/props`),
  require(`snabbdom/modules/attributes`),
  require(`snabbdom/modules/style`),
]) {
  const patch = snabbdom.init(modules);
  const rootElem = getDomElement(container);
  let renderContainer = document.createElement(`div`);

  return function DOMDriver(view$) {
    const rootElem$ = new BehaviorSubject(rootElem);

    view$
      .take(1)
      .flatMapLatest(parseTree)
      .flatMap(view => {
        if (rootElem.hasChildNodes()) {
          rootElem.innerHTML = ``;
        }
        rootElem.appendChild(renderContainer);
        patch(renderContainer, view);
        return Observable.just(rootElem);
      }).subscribe(rootElement => rootElem$.onNext(rootElement));
    
    view$
      .flatMapLatest(parseTree)
      .pairwise()
      .flatMap(view => {
        patch(view[0], view[1]);
        return Observable.just(rootElem);
      }).subscribe(rootElement => rootElem$.onNext(rootElement));


    return {
      select: makeElementSelector(rootElem$),
    };
  };
}

export {makeDOMDriver, h};
