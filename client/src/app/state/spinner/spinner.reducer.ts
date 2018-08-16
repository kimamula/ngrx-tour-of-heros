import { SPINNER_HIDE, SPINNER_SHOW, SpinnerActionPayload } from './spinner.action';
import { Reducer } from '../../redux/Reducer';

export const SPINNER_NAMESPACE = 'spinner';

export interface SpinnerState {
  show: boolean;
}

export interface SpinnerRootState {
  [SPINNER_NAMESPACE]: SpinnerState;
}

const initialState: SpinnerState = {
  show: false
};

export const spinnerReducer: Reducer<SpinnerState, SpinnerActionPayload> = (state = initialState, action) => {
  switch (action.type) {
    case SPINNER_HIDE:
      return { show: false };
    case SPINNER_SHOW:
      return { show: true };
    default:
      return state;
  }
};
