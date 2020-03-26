
import { notification } from 'antd';
import { rootAction } from '@/rootState';
import { ActionType } from '@/rootState/rootAction';
import { sys ,log} from './core';
import { dict, enumInit } from './enum';

export async function req(url:string, data?:object) {
    let reqUrl = url
    if(!url.includes('http')&& !url.includes('https')){
        reqUrl = sys.HOST+reqUrl;
    }

    const body = { ...data, sid: sys.sid };

    const headers = {
        'Content-Type': 'application/json',
        Authorization: sys.sid,
    }

    rootAction(ActionType.LOADING);

    let resp:Response = new Response();

    try {
        resp = await fetch(reqUrl, {
            method: 'POST',
            headers: {
                ...headers,
            },
            body: JSON.stringify(body),
        })  
    } catch (e) {
        notification.error({
            message: '无法连接网络',
            description: '无法连接网络',
        });
        log(e);
    }

    rootAction(ActionType.LOADED);

    if (!resp) {
        await Promise.reject('无法连接网络');
    }

    const r = await resp.json();
    if (!r.success) {
        log(r);
        if (r.message) {
            if (r.message == '-1') {
                rootAction(ActionType.LAYOUT);
            } else {
                notification.error({
                    message: '请求错误',
                    description: r.message,
                });
            }
        }
        await Promise.reject(r.message);
    }
    if (r.enum && r.enum !== (dict.enum_ver || 0)) {
        enumInit(r.enum);
    }
    return r;
}

export async function upload(formData:FormData, type:string) {

    let url  = sys.HOST+`/UploadApi/upload/${type}`;

    const headers = {
        Authorization: sys.sid,
    }

    rootAction(ActionType.LOADING);

    let resp:Response = new Response();

    try {
        resp = await fetch(url, {
            method: 'POST',
            headers: {
                ...headers,
            },
            body: formData,
        })  
    } catch (e) {
        notification.error({
            message: '无法连接网络',
            description: '无法连接网络',
        });
        log(e);
    }

    rootAction(ActionType.LOADED);

    if (!resp) {
        await Promise.reject('无法连接网络');
    }

    const r = await resp.json();
    if (!r.success) {
        log(r);
        if (r.message) {
            if (r.message == '-1') {
                rootAction(ActionType.LAYOUT);
            } else {
                notification.error({
                    message: '请求错误',
                    description: r.message,
                });
            }
        }
        await Promise.reject(r.message);
    }
    if (r.enum && r.enum !== (dict.enum_ver || 0)) {
        enumInit(r.enum);
    }
    return r;

}

// export async function text() {

//     let url  = '/zhongxing/OPL00003578.xml';

//     rootAction(ActionType.LOADING);

//     let resp:Response = new Response();

//     try {
//         resp = await fetch(url, {
//             method: 'get'
//         })  
//     } catch (e) {
//         notification.error({
//             message: '无法连接网络',
//             description: '无法连接网络',
//         });
//         log(e);
//     }

//     rootAction(ActionType.LOADED);

//     if (!resp) {
//         await Promise.reject('无法连接网络');
//     }

//     const blob = await resp.blob();

//     var reader = new FileReader();
//     const text:string = await new Promise((rs,rj)=>{
//         reader.readAsText(blob, 'GBK') 
//         reader.onload = function(e) {
//             if(typeof reader.result === 'string')
//                 rs(reader.result);
//         }
//     })

//     return text;

// }

export function encUrl(p:object) {
    if (!p) {
        return '';
    }

    return Object.keys(p).filter(k => p[k] !== undefined && p[k] !== '')
        .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(p[k])}`)
        .join('&');
}

export async function get(url:string, data?:object) {
    let newUrl = url;
    const params = { ...data };

    if (encUrl(params) !== '') {
      newUrl = `${newUrl}?${encUrl(params)}`;
    }

    return req(newUrl);
}

export async function submit(url:string, data?:object, rule?:string|object) {
    let reqData = { ...data };
    if (rule) {
        reqData = getReqData(data, rule);
    }
    return req(url, reqData);
}

export async function read(url:string, search:object, data?:object, rule?:string|object) {
    const param = { ...search };
    Object.assign(param, getReqData(data, rule));
    return get(url, param);
}

export function getReqData(data?:object, rule?:string|object) {
    if(!data){
        return {};
    }

    if (!rule) {
        return data;
    }
    const rst = {};
    if (typeof rule === 'string') {
        return data[rule];
    }
    
    Object.keys(rule).forEach(k => {
        const item = rule[k];
        if (item.indexOf('.') > 0) {
            let fd = item.split(' ');
            let flt = item.split('|');

            if (fd.length > 1) {
                // eslint-disable-next-line prefer-destructuring
                fd[fd.length - 1] = fd[fd.length - 1].split('|')[0];
            } else {
                fd = [flt[0]];
            }
            if (flt.length > 1) {
                // eslint-disable-next-line prefer-destructuring
                flt = flt[1];
            } else {
                flt = undefined;
            }
            const blk = fd[0].split('.')[0];
            // eslint-disable-next-line prefer-destructuring
            fd[0] = fd[0].split('.')[1];

            let pk;
            if (fd.length > 1) {
                pk = data[blk].map((_item: { [x: string]: any; }) => {
                    const d = {};
                    fd.forEach((f: string | number) => {
                        d[f] = _item[f];
                    });
                    return d;
                });
            } else {
                pk = data[blk].map((i: { [x: string]: any; }) => i[fd[0]]);
            }

            if (flt) {
                switch (flt) {
                    case 'first':
                        rst[k] = data[blk][0][fd[0]];
                        break;
                    default:
                        data[blk].forEach((_item: { [x: string]: any; }) => {
                            if (_item[flt]) {
                                rst[k] = _item[fd[0]];
                            }
                        });
                        break;
                }
            } else if (!Number.isNaN(Number(k))) {
                rst[blk] = pk;
            } else {
                rst[k] = pk;
            }
        } else if (!Number.isNaN(Number(k))) {
            rst[item] = data[item];
        } else {
            rst[k] = data[item];
        }
    });

    return rst;
}
