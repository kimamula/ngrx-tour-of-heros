import { merge, Observable, Subject } from 'rxjs';
import { Action } from './Action';
import { scan, shareReplay } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { MatchingKeys } from '../typeUtil';
import { Reducer } from './Reducer';
import { ReduxDevtoolsAdapter } from './Devtools';

export const REDUX_INITIAL_STATE = 'reduxInitialState';

@Injectable({
  providedIn: 'root'
})
export class Store<S extends object = {}, AP = {}> {
  readonly state$: Observable<S>;
  private readonly dispatcher$ = new Subject<Action<AP>>();
  private readonly reducers: { [namespace: string]: Reducer<any, any> } = {};
  private state: S;
  private readonly namespaces: string[];
  constructor(
    @Optional() @Inject(REDUX_INITIAL_STATE) initialState: S | (() => S),
    @Optional() devtoolsAdapter: ReduxDevtoolsAdapter
  ) {
    if (typeof initialState === 'function') {
      initialState = initialState();
    }
    const _initialState = initialState || {} as any;
    this.state = _initialState;
    this.namespaces = Object.keys(_initialState);
    const devtoolsState$ = new Subject<S>();
    const reducer: Reducer<S, AP> = devtoolsAdapter
      ? devtoolsAdapter.wrapReducer((state, action) => this.reducer(state, action), devtoolsState$, _initialState)
      : (state, action) => this.reducer(state, action);
    this.state$ = merge(
      this.dispatcher$.pipe(scan(reducer, _initialState)),
      devtoolsState$
    ).pipe(shareReplay());
    this.state$.subscribe(state => this.state = state);
  }
  dispatch<K extends MatchingKeys<AP, void>>(type: K): Action<AP>;
  dispatch<K extends Exclude<keyof AP, MatchingKeys<AP, void>>>(
    type: K, payload: AP[K]
  ): Action<AP>;
  dispatch(action: Action<AP>): Action<AP>;
  dispatch(typeOrAction: Action<AP> | keyof AP, payload?: any): Action<AP> {
    let action: any;
    if (typeof typeOrAction === 'object') {
      action = typeOrAction;
    } else {
      action = typeof payload === 'undefined' ? { type: typeOrAction } : { type: typeOrAction, payload };
    }
    this.dispatcher$.next(action);
    return action;
  }
  extend<NS extends string, _S, _AP>(
    namespace: NS,
    newReducer: Reducer<_S, _AP>
  ): Store<S & { [ns in NS]: _S }, AP & _AP> {
    if (this.reducers[namespace]) {
      if (this.reducers[namespace] !== newReducer) {
        throw new Error(`Cannot register a reducer for a namespace ${namespace},
 for which a different reducer has already been registered`);
      }
      return this as any;
    }
    this.reducers[namespace] = newReducer as any;
    if (!this.namespaces.includes(namespace)) {
      this.namespaces.push(namespace);
    }
    return this as any;
  }
  getState(): S {
    return this.state;
  }
  private reducer(state: S, action: Action<AP>): S {
    return this.namespaces.reduce((result, namespace) => {
      result[namespace] = this.reducers[namespace] ? this.reducers[namespace](state[namespace], action) : state[namespace];
      return result;
    }, {} as any);
  }
}
