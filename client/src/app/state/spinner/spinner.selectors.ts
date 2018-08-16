import { createSelector } from 'reselect';
import { SpinnerRootState } from './spinner.reducer';

const getSpinnerState = ({ spinner }: SpinnerRootState) => spinner;

export const isSpinnerShowing = createSelector(
  getSpinnerState,
  ({ show }) => show
);
