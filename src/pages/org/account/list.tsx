import React, { useEffect } from 'react';
import {Card, Pagination, List, Avatar, message, Modal} from 'antd';

import { IModPageProps } from '@/viewconfig/ModConfig';

import styles from './list.less';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SearchCard from '@/components/SearchCard';
import renderHeaderBtns from '@/components/ListBtns/headerBtns';
import renderRowBtns from '@/components/ListBtns/rowBtns';

import { getModConfig, colDisplay } from '@/utils/utils';
import { useListPage, useListPageBtn, useListPageSearch } from '@/utils/ListPageHooks';
import { submit } from '@/utils/req';
import ModalForm from '@/components/ModalForm';
const IconPng = require('@/assets/role.png');


// 新增账号
const add = (reload: () => void) => () => {
    const modalRef = Modal.info({});
    const list = {
        name: { text: "姓名", required: true },
        mobile:{text:'电话',required:true},
        account:{text:'账号',required:true}
    };
    const onSubmit = (data: any) => {
      submit("/org/Account/submit", data).then(r => {
            message.success(r.message);
            modalRef.destroy();
            reload();
      });
    };
    const onCancel = () => {
        modalRef.destroy();
    };
    modalRef.update({
        title: "新增账号",
        icon: null,
        content: <ModalForm list={list} onSubmit={onSubmit} onCancel={onCancel} />,
        okButtonProps: { className: "hide" },
        cancelButtonProps: { className: "hide" }
    });
};
  
// 修改账号
const edit = (reload: () => void) => (ref: any) => {
    const modalRef = Modal.info({});
    const list = {
        name: { text: "姓名", required: true },
        mobile:{text:'电话',required:true},
        account:{text:'账号',required:true}
    };
    const onSubmit = (data: object | undefined) => {
        submit("/org/Account/submit", {id:ref.id,...data}).then(r => {
            message.success(r.message);
            modalRef.destroy();
            reload();
        });
    };
    const onCancel = () => {
        modalRef.destroy();
    };
    modalRef.update({
        title: "修改账号",
        // eslint-disable-next-line max-len
        icon: null,
        content: (
            <ModalForm
            list={list}
            onSubmit={onSubmit}
            onCancel={onCancel}
            data={{ ...ref }}
            />
        ),
        okButtonProps: { className: "hide" },
        cancelButtonProps: { className: "hide" }
    });
};

// 设置权限
const setAuth = (reload: () => void) => (ref: any) => {
    const modalRef = Modal.info({});
    const list = {
        auth_id: { text: "权限", required: true, type: "Auth" },
    };
    const onSubmit = (data: object | undefined) => {
        submit("/org/Account/set_auth", {id:ref.id,...data}).then(r => {
            message.success(r.message);
            modalRef.destroy();
            reload();
        });
    };
    const onCancel = () => {
        modalRef.destroy();
    };
    
    modalRef.update({
        title: "设置权限",
        // eslint-disable-next-line max-len
        icon: null,
        content: (
            <ModalForm
            list={list}
            onSubmit={onSubmit}
            onCancel={onCancel}
            data={{ ...ref }}
            />
        ),
        okButtonProps: { className: "hide" },
        cancelButtonProps: { className: "hide" }
    });
};

const list: React.FC<IModPageProps> = ({ route }) => {
    const { viewConfig } = route;
    const {
        setCurrent,
        setPageSize,
        load,
        pageSize,
        current,
        pageSizeOptions,
        total,
        query,
        setQuery,
        data
    } = useListPage(viewConfig)

    const actionMap = {
        新增账号: add(load),
        修改账号: edit(load),
        设置账号权限:setAuth(load)
    };
    const { headerBtns, rowBtns } = useListPageBtn(viewConfig,actionMap);
    const { dropDownSearch, textSearch } = useListPageSearch(viewConfig);

    const cfg = getModConfig(viewConfig);

    useEffect(() => {
        load();
    }, [pageSize, current])

    const pageNumChange = (page: number) => {
        setCurrent(page);
    }

    const pageSizeChange = (_Current: number, size: number) => {
        setPageSize(size);
    }

    const flowColor = (item:any) => {
        switch (item['state']) {
            case "0":
                return{ color: "red" };
            case "1":
                return  { color: "green" };
            default:
                return { color: "#333" };
        }
    }

    return <PageHeaderWrapper>
        <>
            <SearchCard dropDownSearch={dropDownSearch} textSearch={textSearch} reload={load} query={query} setQuery={setQuery} />
            <Card
                className={styles.listCard}
                bordered={false}
                title={cfg.title || "列表"}
                style={{ marginTop: 24 }}
                bodyStyle={{ padding: '0 32px 40px 32px' }}
                extra={renderHeaderBtns(headerBtns)}
            >
            <List
              size="large"
              rowKey="id"
              dataSource={data}
              renderItem={item => (
                <List.Item
                actions={[
                    renderRowBtns(rowBtns,item,load,{
                        minWidth:'100px'
                    })
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={IconPng} shape="square" size="large" />}
                    title={item['name']}
                    description={`账号权限:${colDisplay(item['auth_id'],'Auth',item)}`}
                  />
                <div style={{display:'flex',flexDirection:'column',marginRight:'20px'}}>
                    <span>最近变动</span>
                    <div className={styles.text}>
                        {item['last_update']}
                    </div>
                  </div>
                  <div style={{display:'flex',flexDirection:'column'}}>
                    <span>账号状态</span>
                    <div style={flowColor(item)} className={styles.text}>
                        {colDisplay(item['state'],'State',item)}
                    </div>
                  </div>
                </List.Item>
              )}
            />
                <Pagination
                    style={{ textAlign: 'right' }}
                    onChange={pageNumChange}
                    pageSize={pageSize}
                    pageSizeOptions={pageSizeOptions || ['10', '20', '30', '50', '100']}
                    showSizeChanger
                    onShowSizeChange={pageSizeChange}
                    current={current}
                    total={total}
                    showTotal={(num, range) => `${range[0]}-${range[1]} 共 ${num} 行`}
                />
            </Card>
        </>
    </PageHeaderWrapper>
}

export default list