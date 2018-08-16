import { Action } from './Action';

export type Reducer<State, ActionPayload> = (state: State, action: Action<ActionPayload>) => State;
