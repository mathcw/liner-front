import React, { useEffect, useState } from 'react';
import { Input, message, Row, Col, Upload, Select, InputNumber, Tabs, Modal } from 'antd';
import { IActionPageProps } from '@/viewconfig/ActionConfig';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import renderHeaderBtns from '@/components/PageHeaderWrapper/headerBtns';

import { useActionBtn } from '@/utils/ActionPageHooks';
import { submit, get, read } from '@/utils/req';
import { router } from 'umi';
import styles from './edit.less';
import { getEnum } from '@/utils/enum';
import { getActionConfig } from '@/utils/utils';
import { Iitin } from './components/interface';
import ItinInfo from './components/itin';

const renderOptions = (options: object) => {
    return (
        Object.keys(options || {}).map(item => (
            <Select.Option value={item} key={item}>
                {options[item]}
            </Select.Option>
        ))
    )
}

interface Iinfo {
    name: string,
    cruise_company_id: string,
    ship_id: string,
    pd_num: string,
    dep_city_id: string,
    destination: string,
    day: number,
    night: number,
    theme_arr: Array<string>,
}

interface Ipic {
    uid: string,
    name: string,
    status: string,
    url: string
}

const Page: React.FC<IActionPageProps> = ({ route, location }) => {
    const { authority, viewConfig } = route;
    const { state: ref } = location;

    const [baseInfo, setBaseInfo] = useState<Iinfo>({
        name: '',
        cruise_company_id: '',
        ship_id: '',
        pd_num: '',
        dep_city_id: '',
        destination: '',
        day: 0,
        night: 0,
        theme_arr: [],
    });

    const [bookInfo, setBook] = useState<string>('');
    const [feeInfo, setFeeInfo] = useState<string>('');
    const [feeInclude, setfeeInclude] = useState<string>('');
    const [feeExclude, setExclude] = useState<string>('');
    const [cancelInfo, setCancelInfo] = useState<string>('');

    const [picArr, setPicArr] = useState<Ipic[]>([]);

    const cfg = getActionConfig(viewConfig);

    const [itinInfo, setItinInfo] = useState<Iitin[]>([]);

    useEffect(() => {
        if(cfg.read){
            read(cfg.read.url,{action:authority},{...ref},cfg.read.data).then(r => {
                if(r.data){
                    let loadBase = r.data['baseInfo'];
                    let theme_arr = [];
                    if (r.data['theme_arr']) {
                        theme_arr = r.data['theme_arr'];
                    }
                    setBaseInfo({...loadBase,theme_arr});
                    if(r.data['ticket_itin']){
                        setItinInfo(r.data['ticket_itin']);
                    }
                    if(r.data['bookInfo']){
                        setBook(r.data['bookInfo']);
                    }
                    if(r.data['feeInfo']){
                        setFeeInfo(r.data['feeInfo']);
                    }
                    if(r.data['feeInclude']){
                        setfeeInclude(r.data['feeInclude']);
                    }
                    if(r.data['feeExclude']){
                        setExclude(r.data['feeExclude']);
                    }
                    if(r.data['cancelInfo']){
                        setCancelInfo(r.data['cancelInfo']);
                    }
                    if(r.data['pic']){
                        const arr = r.data['pic'].map((url: string) => {
                            return {
                                uid: url,
                                name: url,
                                status: 'done',
                                url: url,
                            }
                        })
                        setPicArr(arr);
                    }
                }
            },(e:any)=>{
                
            })
        }
    }, [])

    const onOk = () => {
        if (cfg.submit) {
            const checkFields = {
                'name':'船票名称',
                'cruise_company_id':'邮轮公司',
                'ship_id':'邮轮',
                'pd_num':'航线编号'
            }
            let check = true;
            let checkInfo = '';
            Object.keys(checkFields).forEach(field=>{
                if(baseInfo[field] === '' && check){
                    check = false;
                    checkInfo = checkFields[field]
                }
            })
            if(!check){
                message.error(`${checkInfo}不能为空`);
                return;
            }
            if(itinInfo.length != baseInfo.day){
                Modal.confirm({
                    title:'警告',
                    content:'产品天数与行程不相符,确认提交吗？',
                    onOk:()=>{
                        const post_data = {
                            baseInfo: {
                                name: baseInfo.name,
                                cruise_company_id: baseInfo.cruise_company_id,
                                ship_id: baseInfo.ship_id,
                                pd_num: baseInfo.pd_num,
                                dep_city_id: baseInfo.dep_city_id,
                                destination: baseInfo.destination,
                                day: baseInfo.day,
                                night: baseInfo.night
                            },
                            theme_arr:baseInfo.theme_arr,
                            itinInfo,
                            detailInfo:{
                                bookInfo,feeInfo,feeInclude,feeExclude,cancelInfo
                            }
                        }
                        if (ref && ref['id']) {
                            post_data['id'] = ref['id']
                        }
                        // @ts-ignore
                        submit(cfg.submit.url, post_data, cfg.submit.data).then((r: any) => {
                            message.success(r.message);
                            router.goBack();
                        })
                    }
                })
                return;
            }
            const post_data = {
                baseInfo: {
                    name: baseInfo.name,
                    cruise_company_id: baseInfo.cruise_company_id,
                    ship_id: baseInfo.ship_id,
                    pd_num: baseInfo.pd_num,
                    dep_city_id: baseInfo.dep_city_id,
                    destination: baseInfo.destination,
                    day: baseInfo.day,
                    night: baseInfo.night
                },
                theme_arr:baseInfo.theme_arr,
                itinInfo,
                detailInfo:{
                    bookInfo,feeInfo,feeInclude,feeExclude,cancelInfo
                }
            }
            if (ref && ref['id']) {
                post_data['id'] = ref['id']
            }

            submit(cfg.submit.url, post_data, cfg.submit.data).then((r: any) => {
                message.success(r.message);
                router.goBack();
            })
        }
    }

    const onCancel = () => {
        router.goBack();
    }

    const actionMap = {
        提交: onOk,
        关闭: onCancel
    }
    const { btns } = useActionBtn(viewConfig, actionMap);

    // base info
    const changeBaseInfo = (value: any, field: string) => {
        baseInfo[field] = value;
        setBaseInfo({ ...baseInfo });
    };

    const changeShip = (value: any) => {
        baseInfo.ship_id = value;
        setBaseInfo({ ...baseInfo });
        if (value !== null && value !== undefined && value !== '' && value !== '0' && value != 0) {
            get('/productStore/Product/read_for_ship_pic', { ship_id: value }).then(
                (r: {
                    data: []
                }) => {
                    if (r.data) {
                        const arr = r.data.map((url: string) => {
                            return {
                                uid: url,
                                name: url,
                                status: 'done',
                                url: url,
                            }
                        })
                        setPicArr(arr);
                    }
                }
            )
        }
    };


    const handleBookChange = (v: string) => {
        setBook(v);
    };

    return (
        <PageHeaderWrapper
            title={cfg.title || ''}
            extra={renderHeaderBtns(btns)}
        >
            <Row style={{ backgroundColor: 'white', paddingLeft: '10px', paddingTop: '10px' }} className={styles.title}>
                <Col span={12} >
                    船票详情
                 </Col>
                <Col span={12}>
                    邮轮图片
                 </Col>
            </Row>
            <Row style={{ marginBottom: '20px', backgroundColor: 'white', paddingLeft: '10px' }}>
                <Col span={12}>
                    <Row className={styles.row}>
                        <Col span={3} className={styles.cellLabel}>
                            船票名称
                        </Col>
                        <Col span={20} className={styles.cellInput}>
                            <Input value={baseInfo.name} onChange={(e) => { changeBaseInfo(e.target.value, 'name') }} />
                        </Col>
                    </Row>
                    <Row className={styles.row}>
                        <Col span={3} className={styles.cellLabel}>
                            航线编号
                        </Col>
                        <Col span={20} className={styles.cellInput}>
                            <Input value={baseInfo.pd_num} onChange={(e) => { changeBaseInfo(e.target.value, 'pd_num') }} />
                        </Col>
                    </Row>
                    <Row className={styles.row}>
                        <Col span={3} className={styles.cellLabel}>
                            邮轮公司
                        </Col>
                        <Col span={8} className={styles.cellSelect}>
                            <Select
                                style={{ width: '100%' }}
                                showSearch
                                optionFilterProp='children'
                                onChange={(v) => changeBaseInfo(v, 'cruise_company_id')}
                                value={baseInfo.cruise_company_id}
                            >
                                {
                                    renderOptions(getEnum('CruiseCompany'))
                                }
                            </Select>
                        </Col>
                        <Col span={3} className={styles.cellLabel} style={{ marginLeft: '10px' }}>
                            邮轮
                        </Col>
                        <Col span={8} className={styles.cellSelect}>
                            <Select
                                style={{ width: '100%' }}
                                showSearch
                                optionFilterProp='children'
                                onChange={(v) => changeShip(v)}
                                value={baseInfo.ship_id}
                            >
                                {
                                    renderOptions(getEnum({
                                        type: 'CruiseShip',
                                        cascade: 'cruise_company_id'
                                    }, baseInfo))
                                }
                            </Select>
                        </Col>
                    </Row>
                    <Row className={styles.row}>
                        <Col span={3} className={styles.cellLabel}>
                            出发地
                        </Col>
                        <Col span={8} className={styles.cellSelect}>
                            <Select
                                style={{ width: '100%' }}
                                showSearch
                                optionFilterProp='children'
                                onChange={(v) => (changeBaseInfo(v, 'dep_city_id'))}
                                value={baseInfo.dep_city_id}
                            >
                                {
                                    renderOptions(getEnum('City'))
                                }
                            </Select>
                        </Col>
                        <Col span={3} className={styles.cellLabel} style={{ marginLeft: '10px' }}>
                            目的地
                        </Col>
                        <Col span={8} className={styles.cellInput}>
                            <Select
                                style={{ width: '100%' }}
                                showSearch
                                optionFilterProp='children'
                                onChange={(v) => (changeBaseInfo(v, 'destination'))}
                                value={baseInfo.destination}
                            >
                                {
                                    renderOptions(getEnum('City'))
                                }
                            </Select>
                        </Col>
                    </Row>
                    <Row className={styles.row}>
                        <Col span={3} className={styles.cellLabel}>
                            天数
                        </Col>
                        <Col span={8} className={styles.cellInput}>
                            <InputNumber style={{ width: '100%' }} min={0}
                                value={baseInfo.day}
                                onChange={(v) => changeBaseInfo(v, 'day')} />
                        </Col>
                        <Col span={3} className={styles.cellLabel} style={{ marginLeft: '10px' }}>
                            晚数
                        </Col>
                        <Col span={8} className={styles.cellInput}>
                            <InputNumber style={{ width: '100%' }} min={0}
                                value={baseInfo.night}
                                onChange={(v) => changeBaseInfo(v, 'night')} />
                        </Col>
                    </Row>
                    <Row className={styles.row}>
                        <Col span={3} className={styles.cellLabel}>
                            产品分类
                        </Col>
                        <Col span={20} className={styles.cellInput}>
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                showSearch
                                optionFilterProp='children'
                                onChange={(v) => (changeBaseInfo(v, 'theme_arr'))}
                                value={baseInfo.theme_arr}
                            >
                                {
                                    renderOptions(getEnum('PdTheme'))
                                }
                            </Select>
                        </Col>
                    </Row>
                </Col>
                <Col span={12} style={{ marginTop: '12px' }}>
                    {
                        picArr.length !== 0 &&
                        <Upload
                            name="pictureList"
                            listType="picture-card"
                            // @ts-ignore
                            fileList={picArr}
                            disabled
                        />
                    }
                </Col>
            </Row>
            <Tabs defaultActiveKey="行程概况" size='large'
                style={{ backgroundColor: 'white' }}
                renderTabBar={(props, DefaultTabBar) =>
                    <DefaultTabBar {...props} className={styles.tabBar} />}
            >
                <Tabs.TabPane tab="行程概况" key="行程概况">
                    <ItinInfo info={itinInfo} update={setItinInfo} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="预订须知" key="预订须知">
                    <Row>
                        <Col span={24} className="editor-wrapper" style={{ backgroundColor: 'white' }}>
                            <Input.TextArea autoSize value={bookInfo} style={{ width: '100%', minHeight: '104px' }} onChange={(e) => handleBookChange(e.target.value)} />
                        </Col>
                    </Row>
                </Tabs.TabPane>
                <Tabs.TabPane tab="费用说明" key="费用说明">
                    <Row>
                        <Col span={24} className="editor-wrapper" style={{ backgroundColor: 'white' }}>
                            <Tabs style={{ backgroundColor: 'white' }} defaultActiveKey="报价包含" tabPosition="left">
                                {/* <Tabs.TabPane tab="旅游费用" key="旅游费用">
                                    <Row>
                                        <Col span={24} className="editor-wrapper" style={{ backgroundColor: 'white' }}>
                                            <Input.TextArea autoSize value={feeInfo} style={{ width: '100%', minHeight: '190px' }} onChange={(e) => setFeeInfo(e.target.value)} />
                                        </Col>
                                    </Row>
                                </Tabs.TabPane> */}
                                <Tabs.TabPane tab="报价包含" key="报价包含">
                                    <Row>
                                        <Col span={24} className="editor-wrapper" style={{ backgroundColor: 'white' }}>
                                            <Input.TextArea autoSize value={feeInclude} style={{ width: '100%', minHeight: '190px' }} onChange={(e) => setfeeInclude(e.target.value)} />
                                        </Col>
                                    </Row>
                                </Tabs.TabPane>
                                <Tabs.TabPane tab="报价不含" key="报价不含">
                                    <Row>
                                        <Col span={24} className="editor-wrapper" style={{ backgroundColor: 'white' }}>
                                            <Input.TextArea autoSize value={feeExclude} style={{ width: '100%', minHeight: '190px' }} onChange={(e) => setExclude(e.target.value)} />
                                        </Col>
                                    </Row>
                                </Tabs.TabPane>
                                <Tabs.TabPane tab="取消条款" key="取消条款">
                                    <Row>
                                        <Col span={24} className="editor-wrapper" style={{ backgroundColor: 'white' }}>
                                            <Input.TextArea autoSize value={cancelInfo} style={{ width: '100%', minHeight: '190px' }} onChange={(e) => setCancelInfo(e.target.value)} />
                                        </Col>
                                    </Row>
                                </Tabs.TabPane>
                            </Tabs>
                        </Col>
                    </Row>
                </Tabs.TabPane>
            </Tabs>

        </PageHeaderWrapper>
    );
}

export default Page;
