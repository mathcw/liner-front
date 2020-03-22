// 统一了一下列表页的逻辑
import {useState} from 'react';
import { getModConfig, btnClickEvent, getModHeaderButton,getModRowButton, getModDropDownSearch, getModTextSearch } from './utils';
import { read } from './req';
import { IModBtn } from '@/viewconfig/ModConfig';

export function useListPage(authority:string) {

    const cfg = getModConfig(authority);
    const [query, setQuery] = useState<object>({});
    const [data, setData] = useState<object[]>([]);

    const [pageSize, setPageSize] = useState(cfg.pageSize || 100);
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(0);
    let pageSizeOptions:string[] = [];
    if(cfg.pageSizeOptions){
        pageSizeOptions = [...cfg.pageSizeOptions];
    }

    const load = () => {
        if(cfg.read){
            read(cfg.read.url, { mod: authority,
                ...query,
                start: pageSize * (current - 1),
                limit: pageSize }).then(r => {
                setData([...r.data]);
                setTotal(r.total);
            })
        }
    }
    
    return {query, setQuery,data, setData,pageSize, setPageSize,current, setCurrent
            ,total, setTotal,pageSizeOptions,load};
}

export function useListPageBtn(authority:string,actionMap?:object){
    const headerBtns :IModBtn[] = btnClickEvent(getModHeaderButton(authority),actionMap);
    const rowBtns:IModBtn[] = btnClickEvent(getModRowButton(authority),actionMap);
    return {headerBtns,rowBtns}; 
}

export function useListPageSearch(authority:string){
    const dropDownSearch = getModDropDownSearch(authority);
    const textSearch = getModTextSearch(authority);
    return {dropDownSearch,textSearch};
}