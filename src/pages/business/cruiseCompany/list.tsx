import React, { useEffect } from 'react';
import { Card, Pagination, List, Avatar, message } from 'antd';

import { IModPageProps } from '@/viewconfig/ModConfig';

import styles from './list.less';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SearchCard from '@/components/SearchCard';
import renderHeaderBtns from '@/components/ListBtns/headerBtns';
import renderRowBtns from '@/components/ListBtns/rowBtns';

import { getModConfig, colDisplay } from '@/utils/utils';
import { useListPage, useListPageBtn, useListPageSearch } from '@/utils/ListPageHooks';
import { submit } from '@/utils/req';


const toggle = (reload: () => void) => (ref: any) => {
  submit("/business/CruiseCompany/toggle/state", { id: ref.id, state: ref.state }).then(r => {
    message.success(r.message);
    reload();
  });
}

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
    启停邮轮公司: toggle(load)
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

  const flowColor = (item: any) => {
    switch (item['state']) {
      case "0":
        return { color: "red" };
      case "1":
        return { color: "green" };
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
                renderRowBtns(rowBtns, item, load, {
                  minWidth: '100px'
                })
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={item['banner']} shape="square" size="large" />}
                title={item['name']}
              />
              <div style={{ display: 'flex', flexDirection: 'column', marginRight: '20px' }}>
                <span>最近变动</span>
                <div className={styles.text}>
                  {item['last_update']}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span>启停状态</span>
                <div style={flowColor(item)} className={styles.text}>
                  {colDisplay(item['state'], 'State', item)}
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