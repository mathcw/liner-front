import React, { useEffect } from 'react';
import { Card, Pagination, List, Avatar, Modal, message } from 'antd';

import { IModPageProps } from '@/viewconfig/ModConfig';

import styles from './list.less';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SearchCard from '@/components/SearchCard';
import renderHeaderBtns from '@/components/ListBtns/headerBtns';
import renderRowBtns from '@/components/ListBtns/rowBtns';

import { getModConfig, colDisplay, dock_height } from '@/utils/utils';
import { useListPage, useListPageBtn, useListPageSearch } from '@/utils/ListPageHooks';
import EditGroup from './editGroup';
import { submit, get } from '@/utils/req';


const edit = (reload: () => void) => (ref: any) => {
    get('/productStore/Group/read_modify',{id:ref.id}).then(
        (r:any)=>{
            const modalRef = Modal.info({});

            const onOK = (data: any) => {
                //check
                let warn = false;
                let detail_check = false;

                if(data['dep_date'] === '' || data['dep_date'] === null || data['dep_date'] === undefined){
                    Modal.error({
                        title:'缺少必填项',
                        content:'出发日期是必填的'
                    })
                    return ;
                }
                if(data['price_arr'].length === 0){
                    warn = true;
                }

                data['price_arr'].map((detail:any) =>{
                    if(detail['room_type'] === '' ||detail['room_type'] === null ||detail['room_type'] === undefined  ){
                        detail_check = true;
                    }
                    if(detail['location'] === '' ||detail['location'] === null ||detail['location'] === undefined  ){
                        detail_check = true;
                    }
                    if(detail['price'] === 0 ||detail['price'] === null ||detail['price'] === undefined  ){
                        detail_check = true;
                    }
                })
        
                if(detail_check){
                    Modal.error({
                        title:'缺少必填项',
                        content:'请完善价格：房型，位置，价格都是必填项'
                    })
                    return;
                }
                if(warn){
                    Modal.confirm({
                        title:'警告',
                        content:`未填写价格,确认提交吗`,
                        onOk:()=>{
                            submit("/productStore/Group/modify", {
                                id:ref.id,
                                group:data
                            }).then(r => {
                                message.success(r.message);
                                modalRef.destroy();
                                reload();
                            });
                        }
                    })
                    return ;
                }
                submit("/productStore/Group/modify", {
                    id:ref.id,
                    group:data
                }).then(r => {
                    message.success(r.message);
                    modalRef.destroy();
                    reload();
                });
            };
            const onCancel = () => {
                modalRef.destroy();
            };
            modalRef.update({
                title: "",
                icon: null,
                width: 600,
                content: <EditGroup originData={r.data} onOK={onOK} onCancel={onCancel} />,
                okButtonProps: { className: "hide" },
                cancelButtonProps: { className: "hide" }
            });
        }
    )
}

const deleteGroup = (reload: () => void) => (ref: any) => {
    submit("/productStore/Group/destroy", { id: ref.id}).then(r => {
      message.success(r.message);
      reload();
    });
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
        修改班期: edit(load),
        删除班期: deleteGroup(load)
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
                                avatar={<Avatar src={item['list_pic']} shape="square" size="large" />}
                                title={item['name']}
                                description={`产品类型: ${colDisplay(item['kind'], 'PdKind', item)}`}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', marginRight: '20px' }}>
                                <span>出发日期</span>
                                <div className={styles.text}>
                                    {item['dep_date']}
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', marginRight: '20px' }}>
                                <span>最低价</span>
                                <div className={styles.text}>
                                    {item['min_price']}
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', marginRight: '20px' }}>
                                <span>天数</span>
                                <div className={styles.text}>
                                    {item['day']}
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', marginRight: '20px' }}>
                                <span>晚数</span>
                                <div className={styles.text}>
                                    {item['night']}
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', marginRight: '20px' }}>
                                <span>最近变动</span>
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