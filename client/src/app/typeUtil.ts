// https://medium.com/@bterlson/strongly-typed-event-emitters-2c2345801de8
export type MatchingKeys<
  TRecord,
  TMatch,
  K extends keyof TRecord = keyof TRecord
> = K extends (TRecord[K] extends TMatch ? K : never) ? K : never;
