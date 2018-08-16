export const SPINNER_SHOW = 'app/spinner/show';
export const SPINNER_HIDE = 'app/spinner/hide';

export interface SpinnerActionPayload {
  [SPINNER_SHOW]: void;
  [SPINNER_HIDE]: void;
}
