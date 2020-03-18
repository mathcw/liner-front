import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import { PageHeader,Breadcrumb } from 'antd';
import {BreadcrumbProps} from 'antd/lib/breadcrumb';

import { IHeadWrapper } from './index';

export interface IHeader{
    title:string;
    extra:React.ReactNode;
    content?:React.ReactNode;
}
// 因为tt风格原因 考虑将面包屑和title放在一层渲染
const renderTitle = (breadcrumb: BreadcrumbProps,title: any) => {
    return <>
        <Breadcrumb {...breadcrumb} style={{fontWeight:400}}/>
        <div style={{fontWeight:400}}>{title}</div>
    </>
} 

const pageHeaderRender = (wrapperProps:IHeadWrapper, title:string, extra:React.ReactNode, content:React.ReactNode) => {
    const { breadcrumb = {} } = wrapperProps;
    let needAddBreadcrumbName = true;
    if(breadcrumb.routes){
        breadcrumb.routes.forEach(element => {
            if (element.breadcrumbName === title) {
                needAddBreadcrumbName = false;
            }
        });
        if (needAddBreadcrumbName) {
            breadcrumb.routes.push({ breadcrumbName: title,path:'' });
        }
    }


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

const Header:React.FC<IHeader> = ({ children, title, extra, content }) => (
    <PageHeaderWrapper
        pageHeaderRender={PageHeaderWrapperProps =>
        pageHeaderRender(PageHeaderWrapperProps, title, extra, content)}
    >
        {children}
    </PageHeaderWrapper>
)

export default Header
