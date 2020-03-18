import React from 'react';
import { Spin } from 'antd';
import { useRootState } from '@/rootState';
import styles from './index.less';
// loading components from code split
// https://umijs.org/plugin/umi-plugin-react.html#dynamicimport
const PageLoading: React.FC = () => {
  const { loading } = useRootState();
  return loading ? (
    <div className={styles['Spin-box']}><Spin size="large"/></div>
  ) : null;
}


export default PageLoading;
