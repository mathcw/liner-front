import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { PageHeader,Breadcrumb } from 'antd';
import {BreadcrumbProps} from 'antd/lib/breadcrumb';
import {PageHeaderProps} from 'antd/lib/page-header';
import ExtraContent from './extraContent';
import MainContent from './mainContent';
import { IModBtn } from '@/viewconfig/ModConfig';
import styles from './index.less';

export interface IHeadWrapper extends Omit<PageHeaderProps, 'title'> {
    title?: React.ReactNode | false;
    breadcrumb?:BreadcrumbProps;
}

export interface IWrapperProps{
    extra?:React.ReactNode;
    content?:React.ReactNode;
}

const renderTitle = (breadcrumb: BreadcrumbProps,title: any) => {
    return <>
        <Breadcrumb {...breadcrumb} style={{fontWeight:400}}/>
        <div style={{fontWeight:400}}>{title}</div>
    </>
} 

const pageHeaderRender = (wrapperProps:IHeadWrapper
    , extra:React.ReactNode
    , content:React.ReactNode) => {
    const { breadcrumb = {}, title } = wrapperProps;

    let extraContent = null;
    if (extra) {
        extraContent = extra;
    }
    let mainContent = null;
    if (content) {
        mainContent = content;
    }
    return (
    <PageHeader
        title={renderTitle(breadcrumb,title)}
        extra={extraContent}
        >
        {mainContent}
    </PageHeader>
    )
}

const wrapper: React.FC<IWrapperProps> = ({children, extra, content}) =>(
    <PageHeaderWrapper
        className={styles.headerWrapper}
        pageHeaderRender={PageHeaderWrapperProps =>
        pageHeaderRender(PageHeaderWrapperProps, extra, content)}
    >
        {children}
    </PageHeaderWrapper>
)

export const Extra = (pageSize?:number, pageSizeOptions?: string[], total?: number, current?: number,
    pageNumChange?: (page: number, pageSize?: number) => void, pageSizeChange?: (current: number, size: number) => void) =>
    <ExtraContent
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        total={total}
        current={current}
        pageNumChange={pageNumChange}
        pageSizeChange={pageSizeChange}
    />

export const Content = (query:object, setQuery:React.Dispatch<React.SetStateAction<object>>
    , reload:()=>void, btns:IModBtn[],dropDownSearch?:object,textSearch?:object) =>
    <MainContent headerButton={btns}
        dropDownSearch={dropDownSearch}
        textSearch={textSearch}
        reload={reload}
        query={query}
        setQuery={setQuery}
    />

export default wrapper;

