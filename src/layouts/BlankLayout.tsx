import React from 'react';
import { RootProvider } from '@/rootState';
import PageLoading from '@/components/PageLoading';
import { sysInit } from '@/utils/core';

const Layout: React.FC = ({ children }) => {
  sysInit();
  return (
    <RootProvider><PageLoading/>{children}</RootProvider>
  )
}

export default Layout;
