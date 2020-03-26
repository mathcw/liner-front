import React, { useEffect } from 'react';
import { Col, Row, Card, Pagination} from 'antd';

import { IModPageProps } from '@/viewconfig/ModConfig';
import { getEnum } from '@/utils/enum';

import styles from './list.less';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SearchCard from '@/components/SearchCard';
import renderHeaderBtns from '@/components/ListBtns/headerBtns';
import renderRowBtns from '@/components/ListBtns/rowBtns';

import { getModConfig } from '@/utils/utils';
import { useListPage, useListPageBtn, useListPageSearch } from '@/utils/ListPageHooks';
const IconPng = require('@/assets/role.png');

const list: React.FC<IModPageProps> = ({ route }) => {
    const { viewConfig,authority } = route;
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
    } = useListPage(authority,viewConfig)

    const { headerBtns, rowBtns } = useListPageBtn(viewConfig);
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

    const colorfun = (item: any) => {
        let flowColor = {}
        switch (item['state']) {
            case '0':
                flowColor = { color: 'red' }
                break;
            case '1':
                flowColor = { color: 'green' }
                break;
            default:
                flowColor = { color: '#333' }
        }
        return flowColor;
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
                <div className="container" id="container">
                    {data.map((item) => (
                        <div className={styles.List}>
                            <Row className={styles.item}>
                                <Col className={styles.imgBox} xs={24} sm={24} md={3} lg={3}>
                                    {
                                        <img src={IconPng} alt="icon" className={styles.img} />
                                    }
                                </Col>
                                <Col xs={24} sm={24} md={18} lg={18}>
                                    <div className={styles.content}>
                                        <Col span={24} className={styles.contentTop}>
                                            <span className={styles.name}>{item['name']}</span>
                                        </Col>
                                        <Col span={24} className={styles.contentCenter}>
                                            <Col span={12}>
                                                <div className={styles.cell}>
                                                    <span className={styles.lable}>创建日期:  </span>
                                                    <span className={[styles.text, 'text-overflow'].join(' ')}>{item['create_at']}</span>
                                                </div>
                                                <div className={styles.cell}>
                                                    <span className={styles.lable}>最近变动: </span>
                                                    <span className={[styles.text, 'text-overflow'].join(' ')}>{item['last_update']}</span>
                                                </div>
                                            </Col>
                                            <Col span={12}>
                                                <div className={styles.cell}>
                                                    <span className={styles.lable}>适用范围:</span>
                                                    <span className={[styles.text, 'text-overflow'].join(' ')}>{item['scope']}</span>
                                                </div>
                                                <div className={styles.cell}>
                                                    <span className={styles.lable}>角色成员:</span>
                                                    <span className={[styles.text, 'text-overflow'].join(' ')}>{item['employee_num']}人</span>
                                                </div>
                                            </Col>
                                        </Col>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={3} lg={3} className={styles.Approval}>
                                    <Row>
                                        <Col span={24} className={styles.infoCell} style={{ textAlign: 'center' }}>
                                            <span className={styles.lable}>状态</span>
                                            <div style={colorfun(item)} className={[styles.text, 'text-overflow'].join(' ')}>
                                                {getEnum('State')[item['state']]}
                                            </div>
                                        </Col>
                                        <Col style={{ marginTop: '20px', textAlign: 'center' }}>
                                            {renderRowBtns(rowBtns, item, load)}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    ))}
                </div>
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