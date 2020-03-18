import React, { useEffect, useState } from 'react';
import { Col, Divider, Button, Modal } from 'antd';
import { v4 as uuid } from 'uuid';
import { IActionPageProps } from '@/viewconfig/ActionConfig';
import PageHeaderWrapper from '@/components/PageHeaderWrapper/actionPageHeader';
import renderHeaderBtns from '@/components/PageHeaderWrapper/headerBtns';
import { useActionPage, useActionBtn } from '@/utils/ActionPageHooks';
import {btnClickEvent} from "@/utils/utils";
import ActionModal from "@/components/Table/ActionModal";
import ModalForm from "@/components/ModalForm";

import styles from './edit.less';
import Grid, { getCols, actionColWidth, renderRowBtns } from '@/components/Table/Grid';

import { ColumnType } from 'antd/es/table';

interface IDataType {
  uuid: string,
  role?: string,
  specify?: string,
  api?: string,
  mod_check?: string,
  type?: string,
}

const Page: React.FC<IActionPageProps> = ({ route, location }) => {
  const { viewConfig } = route;
  const { state: ref } = location;

  const initData: {
    流程编辑: IDataType[],
    [key: string]: any
  } = {
    流程编辑: []
  }

  const { data, setData, load, onOk, onCancel, cfg } = useActionPage<typeof initData>(viewConfig, initData, ref);
  const actionMap = {
    提交: onOk,
    关闭: onCancel,
  }
  const { btns } = useActionBtn(viewConfig, actionMap);

  const onCancelMod = (row: IDataType ) => {
    data['流程编辑'].map((item: IDataType) => {
      if (item.uuid === row.uuid ) {
        item['mod_check']='';
      }
    })
    data['流程编辑'] = [...data['流程编辑']];
    setData({ ...data });
  }

  const deleteRow = (row: any) => {
    let rowindex=-1;
    data['流程编辑'].map((item: IDataType,index) => {
      if (item.uuid === row.uuid ) {
        rowindex=index;
      }
    })
    data['流程编辑'].splice(rowindex, 1);
    data['流程编辑'] = [...data['流程编辑']];
    setData({ ...data });
  }

  const onSpecify = (ref: any) => {
    const modalRef = Modal.info({});
    const list = {
      specify: { text: '专人', type: 'EmpAccount',editable: true, multi:true, required: true },
    };
    const onSubmit = (row: any | undefined) => {
      data['流程编辑']?.map((item: IDataType) => {
        if (item.uuid === row.uuid) {
          item['specify'] = row.specify;
        }
      })
      modalRef.destroy();
      setData({ ...data });
    };
    const onCancel = () => {
      modalRef.destroy();
    };
    modalRef.update({
      title: "指定专人",
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

  const onMoveUp = (row: any) => {
    let rowindex=-1;
    data['流程编辑'].map((item: IDataType,index) => {
      if (item.uuid === row.uuid ) {
        rowindex=index;
      }
    })
    if(rowindex>0){
      data['流程编辑'][rowindex]=data['流程编辑'][rowindex-1];
      data['流程编辑'][rowindex-1]=row;
    }
    data['流程编辑'] = [...data['流程编辑']];
    setData({ ...data });
  }

  const onMoveDown = (row: any) => {
    let rowindex=-1;
    data['流程编辑'].map((item: IDataType,index) => {
      if (item.uuid === row.uuid ) {
        rowindex=index;
      }
    })
    if(rowindex<(data['流程编辑'].length-1)){
      data['流程编辑'][rowindex]=data['流程编辑'][rowindex+1];
      data['流程编辑'][rowindex+1]=row;
    }
    data['流程编辑'] = [...data['流程编辑']];
    setData({ ...data });
  }

  const rowViewConfig = {
    解除绑定模块: { text: '解除绑定模块'},
    指定专人: { text: '指定专人'},
    删除行: { text: '删除行'},
    上移行: { text: '上移行'},
    下移行: { text: '下移行'},
  };
  const rowActionMaps = {
    解除绑定模块: onCancelMod,
    指定专人: onSpecify,
    删除行: deleteRow,
    上移行: onMoveUp,
    下移行: onMoveDown,
  }
  const rowBtns = btnClickEvent(rowViewConfig,rowActionMaps);

  useEffect(() => {
    load().then((loadedData: typeof initData) => {
      loadedData['流程编辑'] = loadedData['流程编辑']?.map((item: IDataType) => {
        item.uuid = item.uuid ? item.uuid : uuid();
        return item;
      }) || [];

      setData({ ...data, ...loadedData });
    });
  }, [])

  const list = {
    role: { text: '角色名称', type: 'ArrayEdit', width: 180, editable: true ,edit_path:'审批角色'},
    specify: { text: '专人', type: 'Specify', width: 180 },
    api: { text: '外部接口(本步结束时触发)', type: 'PairEdit', width: 180, editable: true, edit_path:'可选接口'},
    mod_check: { text: '绑定模块', type: 'PairEdit', width: 180, editable: true,edit_path:'绑定模块'},
    type: { text: '审批类型', type: 'ApproveType', width: 180, editable: true},
  };

  const addRow = () => {
    data['流程编辑'] = [...data['流程编辑'], { uuid: uuid() }];
    setData({ ...data });
  }

  const update = (rowIndex: string,
    dataIndex: string | number,
    value?: string | number) => {
    const rst = { ...data };
    rst['流程编辑']?.map((item: IDataType) => {
      if (item.uuid === rowIndex) {
        item[dataIndex] = value;
      }
    })
    setData(rst);
  }

  const opCol: ColumnType<IDataType>[] = [
    {
      title: '操作',
      key: 'operation',
      fixed: "right",
      width: 100,
      onCell: (record: object, rowIndex: number) => ({
        record,
        rowIndex,
        isOp: true,
        render: (item: object) => {
          return (
            <ActionModal
            btns={rowBtns}
            data={item}
            width={actionColWidth(rowBtns, data['流程编辑'])}
            renderRowBtns={() => renderRowBtns(rowBtns, item,load)}
          />
          );
        }
      })
    },
  ]

  return (
    <PageHeaderWrapper
      title={cfg.title || ''}
      extra={renderHeaderBtns(btns)}
    >
      <Col className={styles.title}>
        <Col className={styles.text}>审批步骤</Col>
        <Col className={styles.btns}>
          <div className="dib" style={{ marginLeft: 8 }}>
            <Button
              type='primary'
              size='small'
              onClick={() => {
                addRow();
              }}
            >
              添加步骤
            </Button>
          </div>
        </Col>
      </Col>
      <Grid<IDataType>
        columns={getCols<IDataType>(list, update)}
        dataSource={data['流程编辑']}
        pagination={false}
        resizeable={true}
        specCol={opCol}
      />
    </PageHeaderWrapper>
  );
}

export default Page;
