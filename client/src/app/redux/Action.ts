export type Action<ActionPayload, K extends keyof ActionPayload = keyof ActionPayload> =
  K extends (ActionPayload[K] extends void ? K : never)
    ? { type: K }
    : { type: K; payload: ActionPayload[K] };
