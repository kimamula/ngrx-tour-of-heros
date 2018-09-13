import { Action } from './Action';

export type Reducer<State, ActionPayload> = (
  state: State | undefined,
  action: Action<ActionPayload>
) => State;
