import {  MenuDataItem, getMenuData, getPageTitle, DefaultFooter } from '@ant-design/pro-layout';
import { Helmet } from 'react-helmet';
import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';

import { ConnectProps, ConnectState } from '@/models/connect';
import logo from '../assets/logo.png';
import styles from './UserLayout.less';
import { Layout } from 'antd';

export interface UserLayoutProps extends ConnectProps {
  breadcrumbNameMap: { [path: string]: MenuDataItem };
}

const UserLayout: React.FC<UserLayoutProps> = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    breadcrumb,
    formatMessage,
    ...props,
  });
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                  <img alt="logo" className={styles.logo} src={logo} />
                  <span className={styles.title}>邮轮后台</span>
              </div>
              <div className={styles.desc}>专业的旅行社办公系统</div>
            </div>
            {children}
          </div>
          <Layout.Footer className={styles.footer}>
              <a href="http://www.tongyeju.com">
                tongyeju
              </a>
              ©2020 Created by Tongyeju
          </Layout.Footer>
      </div>
    </>
  );
};

export default connect(({ settings }: ConnectState) => ({
  ...settings,
}))(UserLayout);
