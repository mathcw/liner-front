import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Avatar, Divider, Spin,Modal,Input,Upload,message } from 'antd';
import Link from 'umi/link';

import PageHeaderWrapper,{Extra,Content} from '@/components/PageHeaderWrapper';
import { IModPageProps } from '@/viewconfig/ModConfig';
import { getEnum } from '@/utils/enum';

import styles from './Admin.less';
import { useListPage ,useListPageBtn, useListPageSearch} from '@/utils/ListPageHooks';

const IconPng = require('@/assets/role.png');

const admin:React.FC<IModPageProps> = ({ route }) => {

  return <React.Fragment>
        <Row>
          {/* <div className={[loading ? '' : 'hide', 'Spin-box'].join(' ')}>
            <Spin tip="Loading..." />
          </div> */}
          <Col span={24}>
            <Row gutter={16}>
              <Col span={24} className={styles.TopContent}>
                {/* 个人信息 */}
                <Col span={10} className={styles.blocks}>
                  <Row className={styles.block}>
                    <Col className="mod-title">
                      <Col className="mod-text">个人信息</Col>
                    </Col>
                    <Divider style={{ margin: 0 }} />
                    <Col className={styles.content}>
                      <Col className={styles.content1}>
                        <Col span={8} style={{ textAlign: 'center' }}>
                          <Avatar
                            src=''
                            size={64}
                          />
                          <Col className={styles['left-text']}>123</Col>
                        </Col>
                        <Col span={16} className={styles['content-right']}>
                          <Col className={styles.title}>中国旅游B2B数据交互服务中心</Col>
                          <Col className={styles.brand}>ceshi</Col>
                          <Col className={styles.brand} style={{display: 'flex', justifyContent: 'space-around', padding: 0, marginTop: '12px'}}>
                            <Button size="small" style={{fontSize: '12px', padding: '0 4px'}}>修改头像</Button>
                            <Button size="small" style={{fontSize: '12px', padding: '0 4px'}}>修改密码</Button>
                            <Button size="small" style={{fontSize: '12px', padding: '0 4px'}}>退出登录</Button>
                          </Col>
                        </Col>
                      </Col>
                    </Col>
                  </Row>
                </Col>
                {/* 任务审批 */}
                <Col span={14} className={styles.blocks}>
                  <Row className={styles.block}>
                    <Col className="mod-title">
                      <Col className="mod-text">任务审批</Col>
                      <Col className="mod-more">
                        <Link to="/notice/MsgFlow/list">
                          更多
                          {/* <Icon type="right" /> */}
                        </Link>
                      </Col>
                    </Col>
                    <Divider style={{ margin: 0 }} />
                    <Col className={styles.content}>
                        <Col>
                          <Col span={8} className={styles['item-left']}>
                            123
                          </Col>
                          <Col span={16} className={[styles['item-center'], 'text-overflow'].join(' ')}>
                            123
                          </Col>
                        </Col>
                        <Col>
                          <Col span={8} className={styles['item-left']}>
                            123
                          </Col>
                          <Col span={16} className={[styles['item-center'], 'text-overflow'].join(' ')}>
                            123
                          </Col>
                        </Col>
                        <Col>
                          <Col span={8} className={styles['item-left']}>
                            123
                          </Col>
                          <Col span={16} className={[styles['item-center'], 'text-overflow'].join(' ')}>
                            123
                          </Col>
                        </Col>
                        <Col>
                          <Col span={8} className={styles['item-left']}>
                            123
                          </Col>
                          <Col span={16} className={[styles['item-center'], 'text-overflow'].join(' ')}>
                            123
                          </Col>
                        </Col>

                    </Col>
                  </Row>
                </Col>

              </Col>
            </Row>
          </Col>

          
          
        </Row>
    </React.Fragment>
}

export default admin