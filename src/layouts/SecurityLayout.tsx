import React, { useEffect } from 'react';
import { Redirect } from 'umi';
import { useRootState, rootAction } from '@/rootState';
import { ActionType } from '@/rootState/rootAction';
import { req } from '@/utils/req';
import { log, sys } from '@/utils/core';
import { authMetaInit } from '@/viewconfig/ModConfig';
import { enumInit } from '@/utils/enum';
import { reloadAuthorized } from '@/utils/Authorized';
import PageLoading from '@/components/PageLoading';
import { signalInit } from '@/utils/signal';

async function init() {
  const r = await req('/PublicApi/init');
  if (r.data.enum_ver) {
    enumInit(r.data.enum_ver)
  } else {
    enumInit(Number(new Date().getTime()).toString())
  }
  const data :{authority:string[]} = r.data;
  // meta对象过滤
  authMetaInit(data.authority);
  // 权限对象更新
  reloadAuthorized(data.authority);
  // 用户更新
  rootAction(ActionType.USERINIT, r.data);
}

async function msgInit(){
  await signalInit();
}


const Layout: React.FC = ({children}) => {
  if (!sys.sid) {
    return (<Redirect to="/user/login" />);
  }
  const { user } = useRootState();

  useEffect(() => {
    init().catch(log);
  }, []);

  useEffect(()=>{
    // msgInit().catch(log);
  },[]);

  if (!user || !user.account_id) {
    return <PageLoading />
  }

  return (
    <>
      {children}
    </>
  );
}

export default Layout;