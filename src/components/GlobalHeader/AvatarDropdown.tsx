import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { ClickParam } from 'antd/es/menu';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React from 'react';

import { ConnectProps, } from '@/models/connect';

import { rootAction,useRootState } from '@/rootState';
import { ActionType } from '@/rootState/rootAction';

import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export interface GlobalHeaderRightProps extends ConnectProps {
  menu?: boolean;
}

const AvatarDropdown:React.FC<GlobalHeaderRightProps> = ({menu}) =>{
  const onMenuClick = (event: ClickParam) => {
    const { key } = event;

    if (key === 'logout') {
      rootAction(ActionType.LAYOUT);
    }
  }; 
  const {user} = useRootState();
  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {menu && (
        <Menu.Item key="center">
          <UserOutlined />
          <FormattedMessage id="menu.account.center" defaultMessage="account center" />
        </Menu.Item>
      )}
      {menu && (
        <Menu.Item key="settings">
          <SettingOutlined />
          <FormattedMessage id="menu.account.settings" defaultMessage="account settings" />
        </Menu.Item>
      )}
      {menu && <Menu.Divider />}

      <Menu.Item key="logout">
        <LogoutOutlined />
        <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
    <span className={`${styles.action} ${styles.account}`}>
      <span className={styles.name}>{user['name']}</span>
    </span>
  </HeaderDropdown>
  );
}


export default AvatarDropdown;