interface ISYSCONFIG {
    APP_NAME: string;
    HOST: string;
    user: any;
    filters: any;
    sid: string;
}

export const sys: ISYSCONFIG = {
    APP_NAME: 'TY_LINER',
    HOST: '/liner-back',
    user: {},
    filters: {},
    sid: '',
};

export const sysMenu: {
    [key: string]: string[]
} = {
    "行政管理": ["账号管理", "权限管理"],
    "业务设置": ['数据字典', '城市设置','邮轮公司', '邮轮设置','轮播图设置'],
    "产品班期": ['产品管理','班期管理'],
    "订单管理": ['客户咨询','客户订单'],
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