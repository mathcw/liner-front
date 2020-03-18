import React from 'react';
import initialState  from './initialState';
import reducer,{IRootState,IAction} from './rootAction';

// root context 将用它来提供应用级变量的共享
// 你会发现它和dva的 global model大同小异

const RootContext = React.createContext(initialState);

let Rootdispatch: React.Dispatch<any>;

export const RootProvider = (props:any) => {
    // Get state and dispatch from Reacts new API useReducer
    const [rootState, dispatch] = React.useReducer<React.Reducer<IRootState,IAction>>(reducer,initialState);
    Rootdispatch = dispatch;
    return (
       <RootContext.Provider {...props} value={rootState} />
    );
  };

export async function rootAction(type: any, payload?: any) {
    Rootdispatch({ type, payload });
}

export function useRootState() {
    return React.useContext(RootContext);
}
