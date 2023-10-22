import Store from "../store";

export default function thunk<TState, TReducers>(
    store: Store<TState, TReducers>
  ): (next: (action: any) => void) => (action: any) => any {
    return function (next) {
      return function (action) {
        if (typeof action === 'function') {
          return action(next, store.getState.bind(store));
        }
        return next(action);
      };
    };
  };