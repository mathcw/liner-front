import React, { useEffect } from 'react';
import { Card, Pagination, List, Avatar, message, Modal } from 'antd';

import { IModPageProps } from '@/viewconfig/ModConfig';

import styles from './list.less';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SearchCard from '@/components/SearchCard';
import renderHeaderBtns from '@/components/ListBtns/headerBtns';
import renderRowBtns from '@/components/ListBtns/rowBtns';

import { getModConfig, colDisplay, dock_height } from '@/utils/utils';
import { useListPage, useListPageBtn, useListPageSearch } from '@/utils/ListPageHooks';
import { submit } from '@/utils/req';
import ModalForm from '@/components/ModalForm';


// 新增
const add = (reload: () => void) => () => {
  const modalRef = Modal.info({});
  const list = {
    country: { text: "国家", required: true, type: 'Country' },
    name: { text: '名称', required: true },
    code: {text:'城市代码'}
  };
  const onSubmit = (data: any) => {
    submit("/business/City/submit", data).then(r => {
      message.success(r.message);
      modalRef.destroy();
      reload();
    });
  };
  const onCancel = () => {
    modalRef.destroy();
  };
  modalRef.update({
    title: "新增城市",
    icon: null,
    content: <ModalForm list={list} onSubmit={onSubmit} onCancel={onCancel} />,
    okButtonProps: { className: "hide" },
    cancelButtonProps: { className: "hide" }
  });
};

// 修改
const edit = (reload: () => void) => (ref: any) => {
  const modalRef = Modal.info({});
  const list = {
    country: { text: "国家", required: true, type: 'Country' },
    name: { text: '名称', required: true },
    code: {text:'城市代码'}
  };
  const onSubmit = (data: object | undefined) => {
    submit("/business/City/submit", {id:ref.id,...data}).then(r => {
      message.success(r.message);
      modalRef.destroy();
      reload();
    });
  };
  const onCancel = () => {
    modalRef.destroy();
  };
  modalRef.update({
    title: "修改城市",
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

const toggle = (reload: () => void) => (ref: any) => {
  submit("/business/City/toggle/state", { id: ref.id, state: ref.state }).then(r => {
    message.success(r.message);
    reload();
  });
}

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

  const actionMap = {
    新增城市: add(load),
    修改城市: edit(load),
    启停城市: toggle(load)
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
          style={{height:dock_height(),overflow:'auto'}}
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
                description={
                  `所属公司:${colDisplay(item['cruise_company_id'], 'CruiseCompany', item)}`
                }
              />
              {/* <div style={{ display: 'flex', flexDirection: 'column', marginRight: '20px' }}>
                <span>星级</span>
                <div className={styles.text}>
                  {colDisplay(item['level'], 'StarLevel', item)}`
                </div>
              </div> */}
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