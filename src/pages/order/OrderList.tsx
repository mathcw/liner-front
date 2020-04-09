import React, { useEffect } from 'react';
import { Card, Pagination, List, Modal, Input } from 'antd';

import { IModPageProps } from '@/viewconfig/ModConfig';

import styles from './list.less';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SearchCard from '@/components/SearchCard';
import renderHeaderBtns from '@/components/ListBtns/headerBtns';
import renderRowBtns from '@/components/ListBtns/rowBtns';

import { getModConfig, dock_height } from '@/utils/utils';
import { useListPage, useListPageBtn, useListPageSearch } from '@/utils/ListPageHooks';
import { get } from '@/utils/req';


const see = (reload: () => void) => (ref: any) => {
    get('/order/Order/read_see',{id:ref.id}).then(
        (r:any)=>{
            const modalRef = Modal.info({});
            modalRef.update({
                title: "",
                icon: null,
                width: 600,
                onOk:()=>{modalRef.destroy()},
                onCancel:()=>{modalRef.destroy()},
                content: <>
                    <div className="modalContent">
                        <div style={{ display:'flex',flexDirection:'column', marginBottom: '10px' }}>
                            <span>客户姓名</span>
                            <Input value={r.data['name']} style= {{width: '100%'}} readOnly/>
                        </div>
                        <div style={{ display:'flex',flexDirection:'column', marginBottom: '10px' }}>
                            <span>客户电话</span>
                            <Input value={r.data['phone']} style= {{width: '100%'}}  readOnly/>
                        </div>
                        <div style={{ display:'flex',flexDirection:'column',marginBottom: '10px' }}>
                            <span>产品名称</span>
                            <Input value={r.data['pd_name']}  style= {{width: '100%'}} readOnly/>
                        </div>
                        <div style={{ display:'flex',flexDirection:'column',marginBottom: '10px' }}>
                            <span>出发日期</span>
                            <Input value={r.data['use_dep_date']}  style= {{width: '100%'}} readOnly/>
                        </div>
                        <div style={{ display:'flex',flexDirection:'column',marginBottom: '10px' }}>
                            <span>客户所选房型</span>
                            <Input value={r.data['use_room_type']}  style= {{width: '100%'}} readOnly/>
                        </div>
                        <div style={{ display:'flex',flexDirection:'column',marginBottom: '10px' }}>
                            <span>客户所选价格(1/2)</span>
                            <Input value={r.data['use_price']}  style= {{width: '100%'}} readOnly/>
                        </div>
                        <div style={{ display:'flex',flexDirection:'column',marginBottom: '10px' }}>
                            <span>客户所选价格(3/4)</span>
                            <Input value={r.data['use_duoren_price']}  style= {{width: '100%'}} readOnly/>
                        </div>
                    </div>
                </>,
            });
        }
    )
}

const list: React.FC<IModPageProps> = ({ route }) => {
    const { viewConfig, authority } = route;
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
    } = useListPage(authority, viewConfig)
    const actionMap = {
        订单详情: see(load),
    };
    const { headerBtns, rowBtns } = useListPageBtn(viewConfig, actionMap);
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
                    style={{ height: dock_height(), overflow: 'auto' }}
                    size="large"
                    rowKey="id"
                    dataSource={data}
                    renderItem={item => (
                        <List.Item
                            actions={[
                                renderRowBtns(rowBtns, item, load, {
                                    minWidth: '100px'
                                })
                            ]}
                        >
                            <List.Item.Meta
                                title={`客户姓名:${item['name']}`}
                                description={`所选产品:${item['pd_name']}`}
                            />

                                <div style={{ display: 'flex', flexDirection: 'column', marginRight: '20px' }}>
                                    <span>联系电话</span>
                                    <div className={styles.text}>
                                        {item['phone']}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', marginRight: '20px' }}>
                                    <span>出发日期</span>
                                    <div className={styles.text}>
                                        {item['use_dep_date']}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', marginRight: '20px' }}>
                                    <span>房型</span>
                                    <div className={styles.text}>
                                        {item['use_room_type']}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', marginRight: '20px' }}>
                                    <span>客人所选房型</span>
                                    <div className={styles.text}>
                                        {item['use_room_type']}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', marginRight: '20px' }}>
                                    <span>客人所选价格(1/2)</span>
                                    <div className={styles.text}>
                                        {item['use_price']}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', marginRight: '20px' }}>
                                    <span>下单时间</span>
                                    <div className={styles.text}>
                                        {item['last_update']}
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