# ~NgRx~ Tour of Heroes

The purpose of this repository is to create an example Tour of Heroes application using Angular along ~with~WITHOUT NgRx.

# Motivation

**Angular で単純で型安全で boilerplate の少ない Flux/Redux を実現すること。**

## ngrx への不満

- boilerplate 多い
- 型安全じゃない
    - NgModule への import の仕方と、 Component に DI される store の型の整合性を取るのは開発者
        - 慣れの問題かもしれないけれど、このあたりがやたら複雑で難しい印象がある
    - @ngrx/effects の `ofType` -> v7 で改善予定: https://github.com/ngrx/platform/issues/860
- feature （state を分割するための機能）が使いづらそう（ひょっとしたら誤解があるかもしれない）
    - 柔軟性がない
        - https://redux.js.org/recipes/structuringreducers/beyondcombinereducers に書かれているようなこと（feature をまたがった状態の参照、更新）ができない
        - 関連 issue: https://github.com/ngrx/example-app/issues/159
    - feature は NgModule に対して一つだけ
        - NgModule の分割単位が feature の分割単位に影響する
        - feature は Model、 NgModule は View/ViewModel に属すると考えれば、独立していた方がいい

## 今回独自に作った Redux 実装の特徴

- boilerplate 少ない
- 型安全
    - TypeScript が型の整合性を保証
- state の slice と component の関係が柔軟
    - state の slice と container component が m : n

# Redux Implementation

[client/src/app/redux](client/src/app/redux) 以下に Redux の実装がある。

- [`Store.ts`](client/src/app/redux/Store.ts)
    - Store の実装
    - Redux 実装の中枢、今の所 100 行以内に収まっている（小さい！）
- [`Action.ts`](client/src/app/redux/Action.ts)
    - Action の型定義
- [`Reducer.ts`](client/src/app/redux/Reducer.ts)
    - Reducer の型定義
* [`Devtools.ts`](client/src/app/redux/Devtools.ts)
    - [Redux Devtools Extension](http://zalmoxisus.github.io/redux-devtools-extension/)との連携機能

# How to use

## Redux module を実装する

Redex module は、 [Twitter が Redux application の code splitting のために導入した概念](http://nicolasgallagher.com/redux-modules-and-code-splitting/)。
Twitter Lite でも使われているらしい。

そもそもの問題として、 Redux をドキュメントに書いてある通りに使うと、 `combineReducers()` で全 reducer をくっつけてしまうので、 code splitting できない。

https://stackoverflow.com/questions/32968016/how-to-dynamically-load-reducers-for-code-splitting-in-a-redux-application

ngrx の feature のようなものを使うと code splitting できるが、 Redux module 方式の方がメリットが大きいと考えるのでこちらを採用する。

まず、 Redux module ごとに、以下のファイルを作成する

- {namespace}.action.ts
- {namespace}.reducer.ts
- {namespace}.selectors.ts

1. action

action の type と payload を interface を使って関連づける。
ngrx を使う場合と比べてかなり簡略化されている。

```ts
import { Power } from '../../core/models/power.model';

// declare action types
export const ADD_POWER = 'app/powers/addPower';
export const ADD_POWER_DIALOG_CLOSE = 'app/powers/addPowerDialogClose';
export const ADD_POWER_DIALOG_OPEN = 'app/powers/addPowerDialogOpen';
export const DELETE_POWER = 'app/powers/deletePower';
export const LOAD_POWERS = 'app/powers/loadPowers';
export const LOAD_POWER = 'app/powers/loadPower';
export const SELECT_POWER = 'app/powers/selectPower';
export const UPDATE_POWER = 'app/powers/updatePower';

// relate action types with payloads by declaring interface
export interface PowersActionPayload {
  [ADD_POWER]: Power;
  [ADD_POWER_DIALOG_CLOSE]: void;
  [ADD_POWER_DIALOG_OPEN]: void;
  [DELETE_POWER]: Power;
  [LOAD_POWERS]: Power[];
  [LOAD_POWER]: Power;
  [SELECT_POWER]: { id: number };
  [UPDATE_POWER]: Power;
}

// actual action object should be somthing like:
// { type: ADD_POWER, payload: power }
```

参考: [同様の action を ngrx で実装した場合](https://github.com/blove/ngrx-tour-of-heros/blob/ngrx-refactor-3/client/src/app/state/powers/actions/powers.ts)

2. reducer

ここの実装は ngrx を使う場合とだいたい同じ。

```ts
import {
  ADD_POWER_DIALOG_CLOSE,
  ADD_POWER_DIALOG_OPEN,
  ADD_POWER,
  DELETE_POWER,
  LOAD_POWER,
  LOAD_POWERS,
  SELECT_POWER,
  UPDATE_POWER,
  PowersActionPayload
} from './powers.action';
import { Power } from '../../core/models/power.model';
import { Reducer } from '../../redux/Reducer';

// define namespace for this Redux module
export const POWERS_NAMESPACE = 'powers';

// declare a type of state this "Redux module" handles
export interface PowersState {
  addDialogShow: boolean;
  selectedId?: number;
  entities: { [id: number]: Power };
}

// App root state should have this Redux module's state under its namespace
export interface PowersRootState {
  [POWERS_NAMESPACE]: PowersState;
}

// declare initial state
const initialState: PowersState = {
  addDialogShow: false,
  entities: {}
};

// Reducer implementation
export const powersReducer: Reducer<PowersState, PowersActionPayload> = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POWER_DIALOG_CLOSE:
      return { ...state, addDialogShow: false };
    case ADD_POWER_DIALOG_OPEN:
      return { ...state, addDialogShow: true };
    case ADD_POWER:
    case LOAD_POWER:
      return { ...state, entities: { ...state.entities, [action.payload.id]: action.payload }};
    case DELETE_POWER:
      const { [action.payload.id]: _, ...remaining } = state.entities;
      return { ...state, entities: remaining };
    case LOAD_POWERS:
      return { ...state, entities: action.payload.reduce((acc, power) => {
        acc[power.id] = power;
        return acc;
      }, {} as typeof state.entities) };
    case SELECT_POWER:
      return { ...state, selectedId: action.payload.id };
    case UPDATE_POWER:
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.payload.id]: {
            ...state.entities[action.payload.id],
            ...action.payload
          }
        }
      };
    default:
      return state;
  }
};
```

[@ngrx/entity](https://github.com/ngrx/platform/tree/master/docs/entity) のようなものがあると、上記の reducer のコードは少し短くできる。
ただ、そう大きくは変わらない点、そもそもオリジナルの Redux コミュニティで @ngrx/entity に相当するものが（たぶん）流行っていない点から、それほど必要性の高い機能ではないのではないかと思っている。
やっぱり必要だと思ったら後から実装するかもしれないものの、現時点では実装しない。

参考: [同様の reducer を ngrx で実装した場合](https://github.com/blove/ngrx-tour-of-heros/blob/ngrx-refactor-3/client/src/app/state/powers/reducers/powers.ts)

3. selector

Component から Store の状態を参照する際に、 Selector を経由することで中間状態がメモ化され、余計な再計算を省略できる。
Redux でも ngrx でも広く使われている手法。
[Reselect](https://github.com/reduxjs/reselect) を使って実現する（reduxjs organization のパッケージだが、 Redux への依存はないためどこでも使える）。
ここも ngrx を使う場合とだいたい同じだが、 @ngrx/entity のようなものがあると少し簡略化できる。

```ts
import { createSelector } from 'reselect';
import { PowersRootState } from './powers.reducer';

const getPowersState = ({ powers }: PowersRootState) => powers;

export const getSelectedPowerId = createSelector(
  getPowersState,
  ({ selectedId }) => selectedId
);

export const getPowerEntities = createSelector(
  getPowersState,
  ({ entities }) => entities
);

export const getAllPowers = createSelector(
  getPowerEntities,
  entities => Object.values(entities)
);

export const getSelectedPower = createSelector(
  getPowerEntities,
  getSelectedPowerId,
  (entities, selectedPowerId) => typeof selectedPowerId === 'number' ? entities[selectedPowerId] : undefined
);

export const isAddPowerDialogShowing = createSelector(
  getPowersState,
  ({ addDialogShow }) => addDialogShow
);
```

参考: [同様の selector を ngrx で実装した場合](https://github.com/blove/ngrx-tour-of-heros/blob/ngrx-refactor-3/client/src/app/state/powers/reducers/index.ts)

## Redux module を使う

1. Container Component の constructor で store を reducer の登録によって拡張する

```ts
@Component({
  // ...
})
export class FooContainerComponent {
  // store.extend() は TypeScript 的に正しい型の Store を返してくれるので、ここの型宣言は冗長だが、 TypeScript の仕様上仕方ない
  private readonly store: Store<PowersRootState, PowersActionPayload>;

  constructor(store: Store) {
    this.store = store.extend(POWERS_NAMESPACE, powersReducer);
  }
  // ...
}
```

`Store` は 2 つの型パラメータを取る。
一つ目は内包する state の型を示し、二つ目はこの store の dispatch メソッドが受け付ける action の型を表す。
`store.extend()` から reducer を登録すると、これら 2 つの両方が拡張される。

```ts
// extend() の型表現
export class Store<S, AP> {

  // ...

  extend<NS extends string, _S, _AP>(
    namespace: NS,
    newReducer: Reducer<_S, _AP>
  ): Store<S & { [ns in NS]: _S }, AP & _AP>;
}
``` 

Container Component と Redux module の関係は m : n なので、 extend は何回呼んでも問題ない（`this.store = store.extend(/* ... */).extend(/* ... */)...`）。
constructor 引数の `store` は Angular の DI の仕組みで Inject されるためシングルトンだが、同じ reducer を登録しようとした場合は単に無視するので、すでに登録ずみかどうかを気にする必要はない。

こうして、 Container Component 内で実装により正しく型が保証された store が手に入る。

また、 Container Component で Redux Module を参照することにより、それぞれの Redux Module は実際にそれを使う Component からしか参照されなくなる。
後は普通に NgModule の lazy loading の実装を入れれば、 Angular がいい感じに code splitting してくれる。

2. store の状態を参照する

先に作った selector を使って参照する（`Observable` で取れる）。
ngrx のやり方と特に変わらない。

```ts
this.powers$ = this.store.state$.pipe(map(getAllPowers));
```

3. action を dispatch する

```ts
ngOnInit() {
  // show spinner
  this.store.dispatch(SPINNER_SHOW);
  // fetch data
  this.powersService.getPowers().pipe(retry(3)).subscribe(
    powers => this.store.dispatch(LOAD_POWERS, powers), // success -> load data
    e => this.store.dispatch(SNACKBAR_OPEN, e), // error -> show error
    () => this.store.dispatch(SPINNER_HIDE) // complete -> hide spinner
  );
}
```

上記では、第一引数に action の type、第二引数に payload （あれば）を渡す簡略形を使っている。

```ts
this.store.dispatch({ type: LOAD_POWERS, payload: powers });
// same as this.store.dispatch(LOAD_POWERS, powers);
```

のように、ちゃんと action オブジェクトの形で渡すこともできる（毎回オブジェクト作るの面倒かな、と思って簡略形を用意した）。

非同期の action は現時点では提供していない。
必要になったら Redux Thunk （[redux-observable](https://redux-observable.js.org/)?）的な仕組みを用意するのはそんなに難しくないはず。

もともとの Redux が（通常） middleware で Async action を実現するのは、 React + Redux における Container Component に非同期処理の実装を入れづらいため、それを Action 側に持って来ざるを得なかったのが大きいのではないかと考えている。
Angular では Container Component も通常の Component と同じように class で実装するため、このような事情はなく、 Container Component で非同期処理を実装することを忌避する理由がない。
例えば Redux Thunk による Async Action の実装は個人的にかなり醜いと感じるため、できればそのような仕組みは入れずにいたい。

## その他

### Redux Devtools

`ReduxDevtoolsAdapter` を `AppModule` の `provider` にセットすると連携できる。

```ts
// app.module.ts

@NgModule({
  declarations: [
    // ...
  ],
  imports: [
    // ...
  ],
  providers: process.env.NODE_ENV === 'development'
    ? [ReduxDevtoolsAdapter]
    : [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

state をナビゲーションと sync するような機能は作っていないため、 time travelling をやろうとするとその辺りがめんどう。
ただ、 action とその payload、それに伴う state の変化を見れるだけでもだいぶ便利そう。

# Install

Run `cd client` then `yarn install` to install the Angular client dependencies.

Run `cd server` then `yarn install` to install the server dependencies.

# Serve

Run `cd server` then `ng serve` for the Angular client. Navigate to `http://localhost:4200/`.

Run `cd client` then`yarn run serve` for the REST API server.

※細かいとろこで少しバグってます