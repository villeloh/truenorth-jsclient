export const $mobx: symbol;
export const IDerivationState: {
  "-1": string;
  "0": string;
  "1": string;
  "2": string;
  NOT_TRACKING: number;
  POSSIBLY_STALE: number;
  STALE: number;
  UP_TO_DATE: number;
};
export class ObservableMap {
  constructor(initialData: any, enhancer: any, name: any);
  enhancer: any;
  name: any;
  clear(): void;
  dehanceValue(value: any): any;
  entries(): any;
  forEach(callback: any, thisArg: any): void;
  get(key: any): any;
  has(key: any): any;
  intercept(handler: any): any;
  keys(): any;
  merge(other: any): any;
  observe(listener: any, fireImmediately: any): any;
  replace(values$$1: any): any;
  set(key: any, value: any): any;
  toJS(): any;
  toJSON(): any;
  toPOJO(): any;
  values(): any;
}
export class ObservableSet {
  constructor(initialData: any, enhancer: any, name: any);
  name: any;
  enhancer: any;
  add(value: any): any;
  clear(): void;
  dehanceValue(value: any): any;
  entries(): any;
  forEach(callbackFn: any, thisArg: any): void;
  has(value: any): any;
  intercept(handler: any): any;
  keys(): any;
  observe(listener: any, fireImmediately: any): any;
  replace(other: any): any;
  toJS(): any;
  values(): any;
}
export class Reaction {
  constructor(name: any, onInvalidate: any, errorHandler: any);
  name: any;
  onInvalidate: any;
  errorHandler: any;
  observing: any;
  newObserving: any;
  dependenciesState: any;
  diffValue: any;
  runId: any;
  unboundDepsCount: any;
  isDisposed: any;
  isTracing: any;
  dispose(): void;
  getDisposer(): any;
  isScheduled(): any;
  onBecomeStale(): void;
  reportExceptionInDerivation(error: any): void;
  runReaction(): void;
  schedule(): void;
  trace(enterBreakPoint: any): void;
  track(fn: any): void;
}
export function action(arg1: any, arg2: any, arg3: any, arg4: any, ...args: any[]): any;
export namespace action {
  function bound(target: any, propertyName: any, descriptor: any, applyToInstance: any): any;
}
export function autorun(view: any, opts: any): any;
export namespace comparer {
  function identity(a: any, b: any): any;
  function structural(a: any, b: any): any;
}
export function computed(arg1: any, arg2: any, arg3: any, ...args: any[]): any;
export namespace computed {
  function struct(target: any, prop: any, descriptor: any, applyImmediately: any, ...args: any[]): any;
}
export function configure(options: any): void;
export function createAtom(name: any, onBecomeObservedHandler: any, onBecomeUnobservedHandler: any): any;
export function decorate(thing: any, decorators: any): any;
export function entries(obj: any): any;
export function extendObservable(target: any, properties: any, decorators: any, options: any, ...args: any[]): any;
export function flow(generator: any, ...args: any[]): any;
export function get(obj: any, key: any): any;
export function getAtom(thing: any, property: any): any;
export function getDebugName(thing: any, property: any): any;
export function getDependencyTree(thing: any, property: any): any;
export function getObserverTree(thing: any, property: any): any;
export function has(obj: any, key: any): any;
export function intercept(thing: any, propOrHandler: any, handler: any): any;
export function isAction(thing: any): any;
export function isArrayLike(x: any): any;
export function isBoxedObservable(x: any): any;
export function isComputed(value: any, ...args: any[]): any;
export function isComputedProp(value: any, propName: any): any;
export function isObservable(value: any, ...args: any[]): any;
export function isObservableArray(thing: any): any;
export function isObservableMap(x: any): any;
export function isObservableObject(thing: any): any;
export function isObservableProp(value: any, propName: any): any;
export function isObservableSet(x: any): any;
export function keys(obj: any): any;
export function observable(v: any, arg2: any, arg3: any, ...args: any[]): any;
export namespace observable {
  function array(initialValues: any, options: any, ...args: any[]): any;
  function box(value: any, options: any, ...args: any[]): any;
  function deep(...args: any[]): any;
  namespace deep {
    function enhancer(v: any, _: any, name: any): any;
  }
  function map(initialValues: any, options: any, ...args: any[]): any;
  function object(props: any, decorators: any, options: any, ...args: any[]): any;
  function ref(...args: any[]): any;
  namespace ref {
    function enhancer(newValue: any): any;
  }
  function set(initialValues: any, options: any, ...args: any[]): any;
  function shallow(...args: any[]): any;
  namespace shallow {
    function enhancer(v: any, _: any, name: any): any;
  }
  function struct(...args: any[]): any;
  namespace struct {
    function enhancer(v: any, oldValue: any, name: any): any;
  }
}
export function observe(thing: any, propOrCb: any, cbOrFire: any, fireImmediately: any): any;
export function onBecomeObserved(thing: any, arg2: any, arg3: any): any;
export function onBecomeUnobserved(thing: any, arg2: any, arg3: any): any;
export function onReactionError(handler: any): any;
export function reaction(expression: any, effect: any, opts: any): any;
export function remove(obj: any, key: any): any;
export function runInAction(arg1: any, arg2: any): any;
export function set(obj: any, key: any, value: any, ...args: any[]): any;
export function spy(listener: any): any;
export function toJS(source: any, options: any): any;
export function trace(...args: any[]): any;
export function transaction(action$$1: any, thisArg: any): any;
export function untracked(action$$1: any): any;
export function values(obj: any): any;
export function when(predicate: any, arg1: any, arg2: any, ...args: any[]): any;
