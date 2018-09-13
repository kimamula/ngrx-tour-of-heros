import { ApplicationRef, Injectable, NgZone } from '@angular/core';
import { Action } from './Action';

const devtoolsExtension: any =
  typeof window !== 'undefined' &&
  typeof window['__REDUX_DEVTOOLS_EXTENSION__'] === 'function' &&
  window['__REDUX_DEVTOOLS_EXTENSION__'];

@Injectable()
export class ReduxDevtoolsAdapter {
  constructor(private appRef: ApplicationRef) {}
  wrapReducer<S, AP>(
    reducer: (state: S, action: Action<AP>) => S,
    initialState: S
  ): typeof reducer {
    if (!devtoolsExtension) {
      return reducer;
    }
    // Make sure changes from dev tools update angular's view.
    const store = devtoolsExtension(reducer, initialState);
    let subscription: Function;
    devtoolsExtension.listen(({ type }: { type: string }) => {
      if (type === 'START') {
        subscription = store.subscribe(() => {
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
