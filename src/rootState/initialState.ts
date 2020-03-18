import {IRootState} from './rootAction';

const initState:IRootState ={
    loading: false,
    // 用户
    user: {
        account_id:''
    },
    // 模块
    mods: {},
    // 行为
    actions: {},
    // 权限
    authority: {}
}

export default initState;
