export default function logger(): 
  (next: (action: any) => void) => (action: any) => any {
    return function (next) {
      return function (action) {
        console.log(`STORE:- Dispatching ACTION_${action.type}`);
        return next(action);
      };
    };
  }