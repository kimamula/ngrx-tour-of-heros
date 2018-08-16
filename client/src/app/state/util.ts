import { Store } from '../redux/Store';
import { SNACKBAR_NAMESPACE, snackbarReducer, SnackbarRootState } from './snackbar/snackbar.reducer';
import { SPINNER_NAMESPACE, spinnerReducer, SpinnerRootState } from './spinner/spinner.reducer';
import { SnackbarActionPayload } from './snackbar/snackbar.action';
import { SpinnerActionPayload } from './spinner/spinner.action';

export function baseStore(store: Store): Store<SnackbarRootState & SpinnerRootState, SnackbarActionPayload & SpinnerActionPayload> {
  return store
    .extend(SNACKBAR_NAMESPACE, snackbarReducer)
    .extend(SPINNER_NAMESPACE, spinnerReducer);
}

export type BaseStoreWith<S = {}, AP = {}> = Store<
  SnackbarRootState & SpinnerRootState & S,
  SnackbarActionPayload & SpinnerActionPayload & AP
>;
