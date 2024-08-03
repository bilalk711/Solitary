import logger from "./middlewares/logger";
import thunk from "./middlewares/thunk";

const MEMORY_LIMIT = 5000000;

export default class Store<TState, TReducers> {
    private state: TState;
    private listeners: Function[];
    private reducers: TReducers;
    private persist: boolean;
    private storeKey: string;
    private static memoryLimit: number = MEMORY_LIMIT;
  
    constructor(state: TState, reducers: TReducers, storeKey: string) {
      this.state = state;
      this.listeners = [];
      this.reducers = reducers;
      this.persist = true;
      this.storeKey = storeKey;
    }
  
    persistStore() {
      if (this.persist) {
        localStorage.setItem(this.storeKey, JSON.stringify(this.state));
      }
    }
  
    getState(): TState {
      if (this.persist) {
        const state = localStorage.getItem(this.storeKey);
        if (state) {
          this.state = JSON.parse(state);
        }
      }
      return this.state;
    }
  
    subscribe(listener: Function) {
      this.listeners.push(listener);
    }
  
    setState(newState: Partial<TState>) {
      const nextState = { ...this.state, ...newState };
      if (JSON.stringify(newState).length >= Store.memoryLimit) {
        throw new Error('State is exceeding the defined memory limit.');
      }
      this.state = nextState;
      this.persistStore();
      this.listeners.forEach((listener) => listener());
    }
  
    getListeners(): Function[] {
      return this.listeners;
    }
  
    unsubscribe(listener: Function) {
      this.listeners = this.listeners.filter((l) => l !== listener);
    }
  
    reset() {
      this.state = {} as TState;
      this.listeners = [];
    }
  
    static createStore<TState, TReducers>(
      state: TState | (() => TState),
      reducers: TReducers,
      storeKey = `store-${Math.random()}`
    ): Store<TState, TReducers> {

      // Don't allow state to be larger than or equal to 1MB.
      if (JSON.stringify(state).length >= Store.memoryLimit) {
        throw new Error('State is exceeding the defined memory limit.');
      }

      if (typeof state === 'function') {
        reducers = state as any; 
        state = {} as TState;
      }
      return new Store(state, reducers, storeKey);
    }
  
    static combineReducers(
      reducers: Record<string, (state: any, action: any) => any>
    ): (state: Record<string, any>, action: any) => Record<string, any> {
      return function (state, action) {
        const newState: Record<string, any> = {};
        Object.keys(reducers).forEach((key) => {
          newState[key] = reducers[key](state[key], action);
        });
        return newState;
      };
    }
  
    dispatch(action: any) {
        this.state = (this.reducers as (state: TState, action: any) => TState)(this.state, action);
        this.listeners.forEach((listener) => listener());
    }
  
    static applyMiddleware<TState, TReducers>(
      store: Store<TState, TReducers>,
      ...middlewares: Function[]
    ): Store<TState, TReducers> {
      let dispatch = store.dispatch;
      dispatch = dispatch.bind(store);
  
      const composedMiddleware = Store.compose(...middlewares);
  
      store.dispatch = composedMiddleware(dispatch);
      return store;
    }
  
    static compose(...funcs: Function[]): Function {
      return funcs.reduce((a, b) => (...args: any[]) => a(b(...args)));
    }

    static applyValidators<TState, TReducers>({
      store,
      validators,
      onValidationFail,
    }: {
      store: Store<TState, TReducers>;
      validators: Record<string, Function>;
      onValidationFail: Function;
    }) {
      const listeners = store.getListeners();
      store.subscribe(() => {
        const state = store.getState();
        Object.keys(validators).forEach((key) => {
          const validator = validators[key as keyof Record<string, Function>];
          const value = state[key as keyof TState];
          if (validator && !validator(value)) {
            onValidationFail(key, value);
          }
        });
      });
      return () => {
        listeners.forEach((listener) => store.unsubscribe(listener));
      };
    }
}

