import React, { useState, useEffect } from 'react';
import { LockOutlined, RightOutlined, UserOutlined } from '@ant-design/icons';
import { Collapse, Modal, Button, Checkbox, Col, Divider, Input } from 'antd';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import renderHeaderBtns from '@/components/PageHeaderWrapper/headerBtns';
import { IActionPageProps } from '@/viewconfig/ActionConfig';
import { useActionPage, useActionBtn } from '@/utils/ActionPageHooks';

import FilterModalContent, { IFilterConfig } from './FilterModalContent';

import styles from './edit.less';
import { sysMenu, subMenu } from '@/utils/core';
import { getAllCfg } from '@/viewconfig/ModConfig';


const { Panel } = Collapse;
const { Group: CheckboxGroup } = Checkbox;

interface IAuthData {
  name: string,
  scope: string,
  actions: string[],
  filters: {
    [key: string]: {
      [key: string]: string[]
    }
  }
}

interface IModAuthConfig {
  action?: {
    [key: string]: object
  },
  auth_filter?: {
    [key: string]: object
  }
}

const mergeMenu = (remoteMenu: object) => {
  const rst:{
    [key:string]:{}
  } = {};
  const remoteMenuKeys = Object.keys(remoteMenu);
  const AllModConfig = getAllCfg();
  const mergeSubMenu = (key:string) =>{
    const childs = {};
    subMenu[key].forEach(mod=>{
      if(!AllModConfig[mod]) return;
      if(remoteMenuKeys.includes(mod)){
        childs[mod] = {
          ...remoteMenu[mod],
          ...AllModConfig[mod],
          action:{}
        }
        if(AllModConfig[mod].headerButtons){
          //@ts-ignore
          childs[mod].action = {...childs[mod].action,...AllModConfig[mod].headerButtons}
        };
        if(AllModConfig[mod].rowButtons){
          //@ts-ignore
          childs[mod].action = {...childs[mod].action,...AllModConfig[mod].rowButtons}
        };
      }else if(subMenu[mod]){
        const subchilds = mergeSubMenu(mod);
        if(subchilds){
          childs[mod] = {
            ...AllModConfig[mod],
            childs:subchilds
          }
        }
      }
    })
    if(Object.keys(childs).length === 0){
      return false;
    }
    return childs;
  }
  Object.keys(sysMenu).forEach(menuKey => {
    sysMenu[menuKey].forEach(modKey =>{
      if(!AllModConfig[modKey]) return;
      // 合并 普通菜单配置
      if(remoteMenuKeys.includes(modKey)){
        rst[menuKey] = rst[menuKey] || {};
        rst[menuKey][modKey] = {
          ...remoteMenu[modKey],
          ...AllModConfig[modKey],
          action:{}
        }
        if(AllModConfig[modKey].headerButtons){
          //@ts-ignore
          rst[menuKey][modKey].action = {...rst[menuKey][modKey].action,...AllModConfig[modKey].headerButtons}
        };
        if(AllModConfig[modKey].rowButtons){
          //@ts-ignore
          rst[menuKey][modKey].action = {...rst[menuKey][modKey].action,...AllModConfig[modKey].rowButtons}
        };
      }
      // 合并 多级菜单配置
      if(subMenu[modKey]){
        const childs = mergeSubMenu(modKey);
        if(childs){
          rst[menuKey][modKey] = {
            ...AllModConfig[modKey],
            childs
          }
        }
      }
    })
  })
  return rst;
}

const Page: React.FC<IActionPageProps> = ({ route, location }) => {
  const { viewConfig } = route;
  const { state } = location;

  const initData: {
    menu: {
      [key:string]:{}
    },
    auth: IAuthData
  } = { menu: {}, auth: { name: '', scope: '', actions: [], filters: {} } }

  const { data, setData, load, onOk, onCancel, cfg } = useActionPage<typeof initData>(viewConfig, initData, state);

  const [filterModalShow, setModalShow] = useState(false);
  const [selectModalCfg, setModalCfg] = useState({ mod: '', field: '', auth_filter: {}, type: '' });

  useEffect(() => {
    load().then((loadedData: typeof initData) => {
      const menu = mergeMenu(loadedData['menu']);
      setData({menu,auth:loadedData['auth']});
    });
  }, [])

  const onInfoChange = (value: string, field: string) => {
    data.auth[field] = value;
    setData({ ...data });
  }

  const onCheckAllChange = (modCfg: IModAuthConfig, mod: string, checked: boolean) => {
    const { auth } = data;
    if (checked) {
      const set = new Set(auth['actions']);
      set.add(mod);
      if (modCfg.action) {
        Object.keys(modCfg.action).forEach(action => {
          set.add(action)
        })
      }
      auth['actions'] = [...set];
    } else {
      const set = new Set(auth['actions']);
      set.delete(mod);
      if (modCfg.action) {
        Object.keys(modCfg.action).forEach(action => {
          set.delete(action)
        })
      }
      auth['actions'] = [...set];
    }
    setData({ ...data, auth });
  }

  const onCheckChange = (modCfg: IModAuthConfig, checkedValues: string[]) => {
    const { auth } = data;
    const set = new Set(auth.actions);
    const allActions: any[] = [];
    const checkedActions: any[] = [];

    if (modCfg.action) {
      Object.keys(modCfg.action).forEach(action => {
        allActions.push(action);
        if (checkedValues.includes(action)) {
          checkedActions.push(action);
        }
      })
    }
    allActions.forEach(x => set.delete(x));
    checkedActions.forEach(x => set.add(x));
    auth.actions = [...set];
    setData({ ...data, auth });
  };

  const modalCancel = () => {
    setModalShow(false);
    setModalCfg({ mod: '', field: '', auth_filter: {}, type: '' });
  }

  const modalOk = (mod: string, filter: object) => {
    if (filter) {
      const { auth } = data;

      if (Object.keys(filter).length > 0) {
        auth.filters[mod] = { ...filter };
      } else if (auth.filters) {
        delete auth.filters[mod];
      }
      setData({ ...data, auth });
    }
    setModalShow(false);
    setModalCfg({ mod: '', field: '', auth_filter: {}, type: '' });
  }

  const editPemFilter = (Filtercfg: IFilterConfig) => {
    setModalShow(true);
    setModalCfg(Filtercfg);
  }

  const renderFilter = (auth_filter: any, mod: string) => {
    const { auth } = data;
    const filters = auth.filters;
    if (auth_filter) {
      return Object.keys(auth_filter).map(field => (
        <Button
          key={`${mod}/${field}`}
          onClick={() => editPemFilter({ mod, field, auth_filter, type: auth_filter[field].auth_type || auth_filter[field].type })}
          className={styles.filterItemButton}
        >
          {// eslint-disable-next-line eqeqeq
            filters[mod] && filters[mod][field] && filters[mod][field][0] != '-1' && <LockOutlined className={styles.filterIconLock} />
          }
          {// eslint-disable-next-line eqeqeq
            filters[mod] && filters[mod][field] && filters[mod][field][0] == '-1' && <UserOutlined className={styles.filterIconselfLock} />
          }
          {auth_filter[field].text}
        </Button>
      ));
    }
    return null;
  }

  const renderMenu = () => {
    const { menu = {}, auth } = data;
    return (
      <Collapse
        bordered={false}
        expandIcon={({ isActive }) => <RightOutlined rotate={isActive ? 90 : 0} />}
      >
        {Object.keys(menu).map(menuKey => (
          <Panel header={menuKey} key={menuKey}>
            {Object.keys(menu[menuKey]).map(mod => (
              <div key={mod} className={styles.modItem}>
                <Checkbox
                  className={styles.modItemCheckbox}
                  onChange={e =>
                    onCheckAllChange(menu[menuKey][mod], mod, e.target.checked)
                  }
                  checked={auth['actions'].indexOf(mod) !== -1}
                >
                  {menu[menuKey][mod].title}
                </Checkbox>
                {menu[menuKey][mod] && menu[menuKey][mod].action && (
                  <CheckboxGroup
                    className={styles.modItemCheckboxGroup}
                    options={Object.keys(menu[menuKey][mod].action).filter(
                      item => menu[menuKey][mod].action[item].text,
                    )}
                    value={Object.keys(menu[menuKey][mod].action).filter(
                      item => auth.actions.indexOf(item) !== -1,
                    )}
                    onChange={checkedValues =>
                      onCheckChange(menu[menuKey][mod], checkedValues as string[])
                    }
                  />
                )}
                <Col className={styles.filterItem}>{renderFilter(menu[menuKey][mod].auth_filter, mod)}</Col>
                <Divider dashed />
              </div>
            ))}
          </Panel>
        ))}
      </Collapse>
    );
  }

  const renderFilterModalContent = () => {
    const { auth } = data;
    return (
      <FilterModalContent
        cfg={selectModalCfg}
        auth={auth}
        onCancel={modalCancel}
        onSubmit={modalOk}
      />
    )
  }

  const actionMap = {
    提交: onOk,
    关闭: onCancel,
  }

  const { btns } = useActionBtn(viewConfig, actionMap);

  return (
    <PageHeaderWrapper
      title={cfg.title || ''}
      extra={renderHeaderBtns(btns)}
    >
      <Collapse
        bordered={false}
        defaultActiveKey={['描述信息']}
        expandIcon={({ isActive }) => <RightOutlined rotate={isActive ? 90 : 0} />}
      >
        <Panel header="描述信息" key="描述信息">
          <div className={styles.info}>
            <span className={styles.infoLable}>权限名称:</span>
            <Input
              placeholder="权限名称"
              value={data.auth.name}
              onChange={e => onInfoChange(e.target.value, 'name')}
            />
          </div>
          <div className={styles.info}>
            <span className={styles.infoLable}>适用范围:</span>
            <Input
              placeholder="适用范围"
              value={data.auth.scope}
              onChange={e => onInfoChange(e.target.value, 'scope')}
            />
          </div>
        </Panel>
      </Collapse>
      {renderMenu()}
      <Modal
        title="可见数据"
        visible={filterModalShow}
        okButtonProps={{ className: 'hide' }}
        cancelButtonProps={{ className: 'hide' }}
        onCancel={modalCancel}
      >
        {filterModalShow && renderFilterModalContent()}
      </Modal>
    </PageHeaderWrapper>
  );
}

export default Page;
