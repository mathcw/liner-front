import React, { useState, useEffect } from 'react';
import { IModPageProps } from '@/viewconfig/ModConfig';

import { Row, Col, Avatar, Button } from 'antd';
import styles from './Supplier.less';
import { read } from '@/utils/req';

const backDatePng = require('@/assets/back_date.png');


interface pageData{
    msg:any[],
    msg_flow:any[],
    announce:any[],
    account:{
        name: string
        mobile: string
        superior_department_name: string
        superior_company_name: string
        photo: string
    }
    recently_data:{

    }
    recently_order:any[],
    account_check:{}
}
const page: React.FC<IModPageProps> = ({ route }) => {
    const [data, setData] = useState<pageData>({
        msg:[],
        msg_flow:[],
        announce:[],
        account:{
            name:'',
            mobile:'',
            superior_department_name:'',
            superior_company_name:'',
            photo:''
        },
        recently_data:{},
        recently_order:[],
        account_check:{}
    });
    useEffect(() => {
        read('/Home/Supplier/read_home', { mod: '供应商首页' }).then(r => {
            setData({ ...r.data });
        })
    }, []);

    return (
        <Row style={{ margin: '24px' }}>
            <Col xs={24} sm={24} md={8} lg={8} className={styles.Block}>
                <div className={styles.title}>
                    <span className={styles.text}>个人信息</span>
                </div>
                <Row>
                    <Col xs={24} sm={24} md={8} lg={8}>
                        <div style={{display:'flex',flexDirection:'column'}}>
                        <Avatar
                          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                          size={64}
                        />
                        <span>{data.account.name}</span>
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={16} lg={16}>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}



export default page;
