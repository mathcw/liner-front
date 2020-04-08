import { useState } from 'react';
import { message } from 'antd';
import router from 'umi/router';

import { getActionConfig, btnClickEvent, getActionButton } from './utils';
import { read, submit } from './req';
import { IModBtn as IActionBtn } from '@/viewconfig/ModConfig';
import isEmpty from 'lodash/isEmpty';


export function useActionPage<T extends object>(authority: string, viewconfig: string, initData: T, ref?: object) {
    const [data, setData] = useState<T>(initData);
    const cfg = getActionConfig(viewconfig);
    const load = async () => {
        let rst: any;
        let error: any = undefined;
        if (cfg.read) {
            if(!ref || isEmpty(ref) && cfg.read.data){
                return new Promise<any>((rs, rj) => {
                    rj && rj(error);
                    router.replace('/user/login');
                }) 
            }
            try {
                rst = await read(cfg.read.url, { action: authority }, { ...ref }, cfg.read.data);
            } catch (e) {
                error = e;
            } finally {
                return new Promise<any>((rs, rj) => {
                    if (error !== undefined) {
                        rj && rj(error);
                    } else {
                        rs && rst && rst.data && rs(rst.data);
                    }
                })
            }
        }else{
            return new Promise<any>((rs,rj)=>{
                rs(data);
            })
        }
    }

    const onOk = () => {
        if (cfg.submit) {
            submit(cfg.submit.url, data, cfg.submit.data).then((r: any) => {
                message.success(r.message);
                router.goBack();
            })
        }
    }

    const onCancel = () => {
        router.goBack();
    }

    return { data, setData, load, onOk, onCancel, cfg };
}

export function useActionBtn(viewConfig: string, actionMap?: object) {
    const btns: IActionBtn[] = btnClickEvent(getActionButton(viewConfig), actionMap);
    return { btns }
}