
import router from 'umi/router';
import { sys, log, sysUpdate } from '@/utils/core';

export enum ActionType {
  LOADING,
  LOADED,
  LAYOUT,
  USERINIT,
  UPDATEUSERAUTH
}

export interface IUser {
  account_id: string;
}

export interface IRootState {
  loading?: boolean;
  user: IUser;
  mods?: object;
  actions?: object;
  authority?: object;
}

export interface IAction {
  type: ActionType;
  payload: IRootState;
}

export default (state: IRootState, action: IAction) => {
  switch (action.type) {
    case ActionType.LOADING:
      return {
        ...state,
        loading: true,
      };
    case ActionType.LOADED:
      return {
        ...state,
        loading: false,
      };
    case ActionType.LAYOUT:
      delete localStorage[`${sys.APP_NAME}_sid`];
      sysUpdate({
        ...sys,
        user: { account_id: '' },
        sid: ''
      })
      setTimeout(
        () => router.replace(
          '/user/login',
        ),
      );

      return {
        ...state,
        user: { account_id: '' },
      };

    case ActionType.USERINIT:
      sysUpdate({
        ...sys,
        user: action.payload.user
      })
      return {
        ...state,
        user: action.payload.user,
        mods: action.payload.mods,
        authority: action.payload.authority,
      }
    case ActionType.UPDATEUSERAUTH:
      return {
        ...state,
        authority: action.payload.authority,
      }
    default:
      log(action);
      throw new Error('Unexpected action');
  }
};
