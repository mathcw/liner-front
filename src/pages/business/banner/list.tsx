import React, { useEffect } from 'react';
import { Card, Pagination, List, Avatar, message, Modal } from 'antd';

import { IModPageProps } from '@/viewconfig/ModConfig';

import styles from './list.less';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import renderHeaderBtns from '@/components/ListBtns/headerBtns';
import renderRowBtns from '@/components/ListBtns/rowBtns';

import { getModConfig, colDisplay, dock_height } from '@/utils/utils';
import { useListPage, useListPageBtn } from '@/utils/ListPageHooks';
import { submit } from '@/utils/req';
import ModalForm from '@/components/ModalForm';
const IconPng = require('@/assets/role.png');


// 新增
const add = (reload: () => void) => () => {
  const modalRef = Modal.info({});
  const list = {
    pic:{text:'图片',required:true,type:'Pic',file:'Banner'},
    banner_order:{text:'顺序',required:true, type:'number'},
    url: { text: '链接地址', required: true },
  };
  const onSubmit = (data: any) => {
    submit("/business/Banner/submit", data).then(r => {
      message.success(r.message);
      modalRef.destroy();
      reload();
    });
  };
  const onCancel = () => {
    modalRef.destroy();
  };
  modalRef.update({
    title: "新增轮播图",
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
    pic:{text:'图片',required:true,type:'Pic',file:'Banner'},
    banner_order:{text:'顺序',required:true, type:'number'},
    url: { text: '链接地址', required: true },
  };
  const onSubmit = (data: object | undefined) => {
    submit("/business/Banner/submit", {id:ref.id,...data}).then(r => {
      message.success(r.message);
      modalRef.destroy();
      reload();
    });
  };
  const onCancel = () => {
    modalRef.destroy();
  };
  modalRef.update({
    title: "修改轮播图",
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
  const { viewConfig,authority } = route;
  const {
    setCurrent,
    setPageSize,
    load,
    pageSize,
    current,
    pageSizeOptions,
    total,
    data
  } = useListPage(authority,viewConfig)

  const actionMap = {
    新增轮播图: add(load),
    修改轮播图: edit(load),
  };
  const { headerBtns, rowBtns } = useListPageBtn(viewConfig, actionMap);

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
                avatar={<Avatar src={item['pic']} shape="square" size="large" />}
                title={`第${item['banner_order']}张图`}
                description={`轮播图链接地址:${item['url']}
                `}
              />
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