import logger from "./middlewares/logger";
import thunk from "./middlewares/thunk";
import Store from "./store";

const store = Store.createStore({data: ""}, {
    data: (state: any, action: any) => {
      switch (action.type) {
        case "UPDATE_DATA":
          return action.payload;
        default:
          return state;
    }
  }
});

  
const loggerMiddleware = logger();
const thunkMiddleware = thunk(store);

Store.applyMiddleware(store, loggerMiddleware, thunkMiddleware);

const unsubscribe = Store.applyValidators({
    store: store,
    validators: { 
        "data": (value: any) => value.length > 0
    },
    onValidationFail: (key: string, value: any) => {
        console.log(`Validation failed for ${key} with value ${value}`);
    }
});

export { thunk, Store, logger };
