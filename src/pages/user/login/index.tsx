import { Form, Input, Button } from 'antd';
import React from 'react';

import styles from './style.less';
import { sys } from '@/utils/core';
import { req } from '@/utils/req';
import { router } from 'umi';
import { UserOutlined, LockOutlined } from '@ant-design/icons';


const loginFun = async (values: any, href: string) => {
  const { user: r } = await req('/UserLogin/login', values);
  localStorage[`${sys.APP_NAME}_sid`] = r.sid;
  router.replace(href);
}

interface LoginFormProps {
  onSubmit: (p:any) => void
  fieldMap:{
    username:string,
    password:string
  }
}
const LoginForm: React.FC<LoginFormProps> = ({ onSubmit,fieldMap }) => {
  const onFinish = (values: any) => {
    if(onSubmit){
      onSubmit(values);
    }
  };

  const onFinishFailed = (errorInfo:any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      size="large"
    >
      <Form.Item
        name={fieldMap.username}
        rules={[{ required: true, message: '请输入用户名!' }]}
      >
        <Input prefix={<UserOutlined className={styles.icon}/>} placeholder="用户名" className={styles.input}/>
      </Form.Item>
      <Form.Item
        name={fieldMap.password}
        rules={[{ required: true, message: '请输入密码!' }]}
      >
        <Input.Password
          prefix={<LockOutlined className={styles.icon}/>}
          type="password"
          placeholder="密码"
          className={styles.input}
        />
      </Form.Item>

      <Form.Item style={{ textAlign: 'center' }}>
        <Button type="primary" htmlType="submit" className={styles.btn}>
          登录
        </Button>
      </Form.Item>
    </Form>
  );
}

const Login: React.FC = () => {
  const handleSubmit = (values:any) => {
    const field:{
      account?:string,
      password?:string
    } = {};
    let href = '/home';

    field.account = values.Account;
    field.password = values.Password;
    loginFun({ ...field }, href).catch(() => {
      // TODO ...
    });
  }

  return (
    <div className={styles.main}>
        <LoginForm onSubmit={handleSubmit} fieldMap={
          {
            username:'Account',
            password:'Password'
          }
        }/>
    </div>
  )
}

export default Login;
