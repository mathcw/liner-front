import React, { useEffect, useState } from 'react';
import { Card, Pagination, List, Avatar, Modal, Radio, message } from 'antd';

import { IModPageProps } from '@/viewconfig/ModConfig';

import styles from './list.less';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SearchCard from '@/components/SearchCard';
import renderHeaderBtns from '@/components/ListBtns/headerBtns';
import renderRowBtns from '@/components/ListBtns/rowBtns';

import { getModConfig, colDisplay, dock_height, getBtnClickEvent } from '@/utils/utils';
import { useListPage, useListPageBtn, useListPageSearch } from '@/utils/ListPageHooks';
import AppConst from '@/utils/AppConst';
import AddGroup from './addGroup';
import { submit } from '@/utils/req';


const edit = (reload: () => void) => (ref: any) => {
    if (ref.kind == AppConst.PD_KIND_DAN) {
        getBtnClickEvent('修改单船票')(ref);
        return;
    }
    if (ref.kind == AppConst.PD_KIND_HE) {
        getBtnClickEvent('修改河轮套餐')(ref);
        return;

    }
    if (ref.kind == AppConst.PD_KIND_YOU) {
        getBtnClickEvent('修改邮轮套餐')(ref);
        return;
    }
    if(ref.kind == AppConst.PD_KIND_TOUR){
        getBtnClickEvent('修改跟团游')(ref);
    }
}

const addGroup = (reload: () => void) => (ref: any) => {
    const modalRef = Modal.info({});

    const onOK = (data: any[]) => {
        //check
        let check = false;
        let warn = false;
        let warn_date = '';
        let detail_check = false;
        let duoren_check = false;
        data.map((item: any) => {
            if (!check && item['dep_date'] === '' || item['dep_date'] === null || item['dep_date'] === undefined) {
                check = true;
            } else {
                if (!check && !warn && !item['price_arr'] || item['price_arr'].length === 0) {
                    warn = true;
                    warn_date = item['dep_date'];
                }
            }
            if (!detail_check) {
                item['price_arr'].map((detail: any) => {
                    if (detail['room_type'] === '' || detail['room_type'] === null || detail['room_type'] === undefined) {
                        detail_check = true;
                    }
                    // if(detail['location'] === '' ||detail['location'] === null ||detail['location'] === undefined  ){
                    //     detail_check = true;
                    // }
                    if (detail['price'] === 0 || detail['price'] === null || detail['price'] === undefined) {
                        detail_check = true;
                    }
                    if (detail['duoren_price'] === 0 || detail['duoren_price'] < 0) {
                        duoren_check = true;
                    }
                })
            }
        })
        if (check) {
            Modal.error({
                title: '缺少必填项',
                content: '出发日期是必填的'
            })
            return;
        }
        if (duoren_check) {
            Modal.error({
                title: '三/四人价格错误',
                content: '三/四人价格 不能小于或等于0，若无三/四人价 请清空'
            })
            return;
        }
        if (detail_check) {
            Modal.error({
                title: '缺少必填项',
                content: '请完善价格：房型，一/二人价格都是必填项'
            })
            return;
        }
        if (warn) {
            Modal.confirm({
                title: '警告',
                content: `${warn_date}未填写价格,确认提交吗`,
                onOk: () => {
                    submit("/productStore/Group/submit", {
                        product_id: ref.id,
                        group: data
                    }).then(r => {
                        message.success(r.message);
                        modalRef.destroy();
                        reload();
                    });
                }
            })
            return;
        }
        submit("/productStore/Group/submit", {
            product_id: ref.id,
            group: data
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
        content: <AddGroup onOK={onOK} onCancel={onCancel} />,
        okButtonProps: { className: "hide" },
        cancelButtonProps: { className: "hide" }
    });
}

const recommand = (reload: () => void) => (ref: any) => {
    submit("/productStore/Product/recommand", { id: ref.id,is_recom:ref.is_recom }).then(r => {
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

    const [addVisable, setAddVisable] = useState(false);
    const [pdKind, setPdKind] = useState(1);

    const add = (reload: () => void) => () => {
        setAddVisable(true);
    }

    const actionMap = {
        新增产品: add(load),
        修改产品: edit(load),
        新增团期: addGroup(load),
        设为首页推荐产品: recommand(load)
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

    const addProduct = () => {
        if (pdKind == AppConst.PD_KIND_DAN) {
            //do
            getBtnClickEvent('新增单船票')({});
        }
        if (pdKind == AppConst.PD_KIND_YOU) {
            getBtnClickEvent('新增邮轮套餐')({});
        }
        if (pdKind == AppConst.PD_KIND_HE) {
            getBtnClickEvent('新增河轮套餐')({});
        }
        if (pdKind == AppConst.PD_KIND_TOUR){
            getBtnClickEvent('新增跟团游')({})
        }
    }

    const addProductCancel = () => {
        setAddVisable(false);
        setPdKind(1);
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
                            {
                                item['is_recom'] ==1 && <div style={{ display: 'flex', flexDirection: 'column', marginRight: '20px' }}>
                                    <span style={{color:'green'}}>*首页推荐*</span>
                                </div>
                            }
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
            <Modal
                title="选择产品类型"
                visible={addVisable}
                onOk={addProduct}
                onCancel={addProductCancel}
            >
                <Radio.Group onChange={(e) => setPdKind(e.target.value)} value={pdKind}>
                    <Radio style={{ display: 'block', height: '30px', lineHeight: '30px' }} value={1}>
                        {colDisplay(1, 'PdKind', {})}
                    </Radio>
                    <Radio style={{ display: 'block', height: '30px', lineHeight: '30px' }} value={2}>
                        {colDisplay(2, 'PdKind', {})}
                    </Radio>
                    <Radio style={{ display: 'block', height: '30px', lineHeight: '30px' }} value={3}>
                        {colDisplay(3, 'PdKind', {})}
                    </Radio>
                    <Radio style={{ display: 'block', height: '30px', lineHeight: '30px' }} value={4}>
                        {colDisplay(4, 'PdKind', {})}
                    </Radio>
                </Radio.Group>
            </Modal>
        </>
    </PageHeaderWrapper>
}

export default list