interface ISYSCONFIG {
    APP_NAME: string;
    HOST: string;
    user: any;
    filters: any;
    sid: string;
}

export const sys: ISYSCONFIG = {
    APP_NAME: 'TY_LINER',
    HOST: '/api',
    user: {},
    filters: {},
    sid: '',
};

export const sysMenu: {
    [key: string]: string[]
} = {
    "行政管理": ["账号管理", "权限管理"],
    "业务设置": ['数据字典', '城市设置','邮轮公司', '邮轮设置']
};

export const subMenu: {
    [key: string]: string[]
} = {
}

export function sysInit() {
    sys.sid = localStorage[`${sys.APP_NAME}_sid`] || '';
}

export function sysUpdate(update: ISYSCONFIG) {
    sys.user = update.user;
    sys.sid = update.sid;
}

export function log(...args: Array<any>) {
    // eslint-disable-next-line no-console
    console.log(...args);
}