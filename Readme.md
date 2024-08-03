# Solitary - State Management Library

Welcome to **Solitary**! Solitary is a state management library designed to help you manage your application state in a predictable and extendable manner. It provides functionality for creating a store, applying middleware, and validating state changes.

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Basic Usage](#basic-usage)
    - [Creating a Store](#creating-a-store)
    - [Applying Middleware](#applying-middleware)
    - [Adding Validators](#adding-validators)
4. [API Overview](#api-overview)
    - [Solitary.createStore](#solitarycreatestore)
    - [Solitary.applyMiddleware](#solitaryapplymiddleware)
    - [Solitary.applyValidators](#solitaryapplyvalidators)
5. [Example Usage](#example-usage)
6. [Additional Information](#additional-information)
    - [Middleware](#middleware)
    - [Validators](#validators)

## Introduction

Solitary is designed to simplify state management in your applications. With Solitary, you can create a store, enhance its capabilities with middleware, and enforce state constraints using validators.

## Installation

To use Solitary in your project, include the necessary files in your project or integrate it through your module bundler.

## Basic Usage

### Creating a Store

To create a store with Solitary, you need to provide an initial state and a reducer function.

```javascript
import Solitary from "./store";

// Create a store with an initial state and reducer function
const store = Solitary.createStore(
  { data: "" }, // Initial state
  (state: any, action: any) => {
    switch (action.type) {
      case "UPDATE_DATA":
        return { ...state, data: action.payload };
      default:
        return state;
    }
  }
);
```

### Applying Middleware

Solitary includes several middleware options such as logger and thunk. Middleware functions extend the functionality of the store.

```javascript
import logger from "./middlewares/logger";
import thunk from "./middlewares/thunk";

// Create middleware instances
const loggerMiddleware = logger();
const thunkMiddleware = thunk(store);

// Apply middleware to the store
Solitary.applyMiddleware(store, loggerMiddleware, thunkMiddleware);
```

### Adding Validators
Validators help ensure that state changes meet specific criteria. You can define and apply validators to your store.

```javascript
// Apply validators to the store
const unsubscribe = Solitary.applyValidators({
  store: store,
  validators: {
    "data": (value: any) => value.length > 0 // Example validator: data must not be empty
  },
  onValidationFail: (key: string, value: any) => {
    console.log(`Validation failed for ${key} with value ${value}`);
  }
});
```

### API Overview
**Solitary.createStore**

Description: Creates a new store with the specified initial state and reducer function.

Parameters:

initialState: The initial state of the store.
reducer: A function that handles state transitions based on actions.
Returns: A store instance.

**Solitary.applyMiddleware**

Description: Applies middleware to the store to extend its functionality.

Parameters:

store: The store instance.
middlewares: An array of middleware functions.
Returns: The store with applied middleware.

**Solitary.applyValidators**

Description: Applies validators to the store to enforce constraints on state changes.

Parameters:

store: The store instance.
validators: An object where keys are state properties and values are validator functions.
onValidationFail: A callback function to handle validation failures.
Returns: An unsubscribe function to remove validators.

### Example Usage
Here is a complete example demonstrating how to create a store, apply middleware, and add validators using Solitary:

```javascript
import logger from "./middlewares/logger";
import thunk from "./middlewares/thunk";
import Solitary from "./store";

// Initialize the store
const store = Solitary.createStore(
  { data: "" },
  (state: any, action: any) => {
    switch (action.type) {
      case "UPDATE_DATA":
        return { ...state, data: action.payload };
      default:
        return state;
    }
  }
);

// Apply middleware
const loggerMiddleware = logger();
const thunkMiddleware = thunk(store);
Solitary.applyMiddleware(store, loggerMiddleware, thunkMiddleware);

// Apply validators
const unsubscribe = Solitary.applyValidators({
  store: store,
  validators: {
    "data": (value: any) => value.length > 0
  },
  onValidationFail: (key: string, value: any) => {
    console.log(`Validation failed for ${key} with value ${value}`);
  }
});
```
