import { ApplicationRef, Injectable, NgZone } from '@angular/core';
import { Reducer } from './Reducer';
import { Subject } from 'rxjs';

const devtoolsAvailable = typeof window !== 'undefined'
  && typeof window['devToolsExtension'] === 'function';

@Injectable()
export class ReduxDevtoolsAdapter {
  constructor(private appRef: ApplicationRef) {}
  wrapReducer<S, AP>(reducer: Reducer<S, AP>, state$: Subject<S>, initialState: S): Reducer<S, AP> {
    if (!devtoolsAvailable) {
      return reducer;
    }
    // Make sure changes from dev tools update angular's view.
    const store = window['devToolsExtension'](reducer, initialState);
    let subscription: Function;
    window['devToolsExtension'].listen(({ type }: { type: string }) => {
      if (type === 'START') {
        subscription = store.subscribe(() => {
          state$.next(store.getState());
          if (!NgZone.isInAngularZone()) {
            this.appRef.tick();
          }
        });
      } else if (type === 'STOP') {
        subscription();
      }
    });
    return (state, action) => {
      store.dispatch(action);
      return store.getState();
    };
  }
}
