import React, { useEffect, useState } from 'react';
import { Input, message, Row, Col, Upload, Select, InputNumber, Tabs, Modal } from 'antd';
import { IActionPageProps } from '@/viewconfig/ActionConfig';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import renderHeaderBtns from '@/components/PageHeaderWrapper/headerBtns';

import { useActionBtn } from '@/utils/ActionPageHooks';
import { submit, read, upload } from '@/utils/req';
import { router } from 'umi';
import styles from './edit.less';
import { getEnum } from '@/utils/enum';
import { getActionConfig } from '@/utils/utils';
import { Iitin } from './components/interface';
import ItinInfo from './components/itin';
import { PlusOutlined } from '@ant-design/icons';

const renderOptions = (options: object) => {
    return (
        Object.keys(options || {}).map(item => (
            <Select.Option value={item} key={item}>
                {options[item]}
            </Select.Option>
        ))
    )
}
const imgUploadCheck = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('请上传 JPG/PNG 图片!');
        return isJpgOrPng;
    }
    return isJpgOrPng;
}

const uploadArea = () => {
    return (
        <>
            <PlusOutlined />
            <div className="ant-upload-text">上传</div>
        </>
    )
}


interface Ipic {
    uid: string,
    name: string,
    status: string,
    url: string
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
    pic_arr:Array<Ipic>,
    theme_arr: Array<string>,
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
        pic_arr:[],
        theme_arr: [],

    });

    const [brightSpot,setBrightSpot] = useState<string>('');

    const [bookInfo, setBook] = useState<string>('');
    const [feeInfo, setFeeInfo] = useState<string>('');
    const [feeInclude, setfeeInclude] = useState<string>('');
    const [feeExclude, setExclude] = useState<string>('');
    const [cancelInfo, setCancelInfo] = useState<string>('');

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
                    let pic_arr = [];
                    if(r.data['pic_arr']){
                        pic_arr = r.data['pic_arr'].map((url:string)=>{
                            return {
                                uid: url,
                                name: url,
                                status: 'done',
                                url: url,
                            }
                        })
                    }
                    setBaseInfo({...loadBase,pic_arr,theme_arr});
                    if(r.data['itinInfo']){
                        let loaditin =  r.data['itinInfo'].map((itin:any)=>{
                            if(itin['pic_arr'] && itin['pic_arr'].length >0){
                                return {
                                    ...itin,
                                    pic_arr:itin['pic_arr'].map((url:string)=>{
                                        return {
                                            uid: url,
                                            name: url,
                                            status: 'done',
                                            url: url,
                                        }
                                    })
                                }
                            }
                            return {
                                ...itin,
                                pic_arr:[]
                            }
                        })
                        setItinInfo([...loaditin])
                    }
                    if(r.data['brightSpot']){
                        setBrightSpot(r.data['brightSpot']);
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
                }
            },(e:any)=>{
                
            })
        }
    }, [])

    const onOk = () => {
        if (cfg.submit) {
            const checkFields = {
                'name':'产品名称',
                'cruise_company_id':'邮轮公司',
                'ship_id':'邮轮',
                'pd_num':'航线编号',
                'day':'天数',
                'night':'晚数'
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
                            pic_arr:baseInfo.pic_arr.map(item => item.url),
                            itinInfo:itinInfo.map(itin =>{
                                return {
                                    des:itin.des,
                                    arr_time:itin.arr_time,
                                    level_time:itin.level_time,
                                    dep_city:itin.dep_city,
                                    destination:itin.destination,
                                    breakfast:itin.breakfast,
                                    lunch:itin.lunch,
                                    dinner:itin.dinner,
                                    accommodation:itin.accommodation,
                                    pic_arr:itin.pic_arr.map(item=>item.url)
                                }
                            }),
                            detailInfo:{
                                brightSpot,bookInfo,feeInfo,feeInclude,feeExclude,cancelInfo
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

                pic_arr:baseInfo.pic_arr.map(item => item.url),
                itinInfo:itinInfo.map(itin =>{
                    return {
                        des:itin.des,
                        arr_time:itin.arr_time,
                        level_time:itin.level_time,
                        dep_city:itin.dep_city,
                        destination:itin.destination,
                        breakfast:itin.breakfast,
                        lunch:itin.lunch,
                        dinner:itin.dinner,
                        accommodation:itin.accommodation,
                        pic_arr:itin.pic_arr.map(item=>item.url)
                    }
                }),
                detailInfo:{
                    brightSpot,bookInfo,feeInfo,feeInclude,feeExclude,cancelInfo
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

    const handleChange = (info: any) => {
        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'done') {
            baseInfo.pic_arr.push(
                {
                    uid: info.file.pic,
                    name: info.file.name,
                    status: 'done',
                    url: info.file.pic
                }
            )
            setBaseInfo({...baseInfo});
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 文件上传失败.`);
        }
    };

    const onRemove = (file: { uid: string }) => {
        const index = baseInfo.pic_arr.findIndex((value) => value.uid === file.uid);
        if (index !== -1) {
            baseInfo.pic_arr.splice(index, 1);
            setBaseInfo({...baseInfo});
        }
    }

    const handleUpload = (prop: { file: File }) => {
        const formData = new FormData();
        const { file } = prop;
        formData.append('file', file);
        upload(formData, 'productPic').then(res => {
            if (res.success && res.save_path) {
                const fileinfo = { file: { status: 'done', name: file.name, pic: res.save_path } }
                handleChange(fileinfo);
            } else {
                handleChange({ file: { status: 'error', name: file.name } });
            }
        }, () => {
            handleChange({ file: { status: 'error', name: file.name } });
        })
    };

    const handleBrightSpotChange = (v:string) =>{
        setBrightSpot(v);
    }
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
                    产品详情
                 </Col>
                <Col span={12}>
                    产品图片
                 </Col>
            </Row>
            <Row style={{ marginBottom: '20px', backgroundColor: 'white', paddingLeft: '10px' }}>
                <Col span={12}>
                    <Row className={styles.row}>
                        <Col span={3} className={styles.cellLabel}>
                            产品名称
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
                                onChange={(v) => changeBaseInfo(v, 'ship_id')}
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
                        <Upload
                            name="pictureList"
                            listType="picture-card"
                            // @ts-ignore
                            fileList={baseInfo.pic_arr}
                            beforeUpload={imgUploadCheck}
                            onChange={info => handleChange(info)}
                            customRequest={({ file }) => handleUpload({ file })}
                            onRemove={(file) => onRemove(file)}
                        >
                            {uploadArea()}
                        </Upload>
                    }
                </Col>
            </Row>
            <Tabs defaultActiveKey="行程亮点" size='large'
                style={{ backgroundColor: 'white' }}
                renderTabBar={(props, DefaultTabBar) =>
                    <DefaultTabBar {...props} className={styles.tabBar} />}
            >
                <Tabs.TabPane tab="行程亮点" key="行程亮点">
                    <Row>
                        <Col span={24} className="editor-wrapper" style={{ backgroundColor: 'white' }}>
                            <Input.TextArea autoSize value={brightSpot} style={{ width: '100%', minHeight: '190px' }} onChange={(e) => handleBrightSpotChange(e.target.value)} />
                        </Col>
                    </Row>
                </Tabs.TabPane>
                <Tabs.TabPane tab="行程概况" key="行程概况">
                    <ItinInfo info={itinInfo} update={setItinInfo} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="预订须知" key="预订须知">
                    <Row>
                        <Col span={24} className="editor-wrapper" style={{ backgroundColor: 'white' }}>
                            <Input.TextArea autoSize value={bookInfo} style={{ width: '100%', minHeight: '190px' }} onChange={(e) => handleBookChange(e.target.value)} />
                        </Col>
                    </Row>
                </Tabs.TabPane>
                <Tabs.TabPane tab="费用说明" key="费用说明">
                    <Row>
                        <Col span={24} className="editor-wrapper" style={{ backgroundColor: 'white' }}>
                            <Tabs style={{ backgroundColor: 'white' }} defaultActiveKey="旅游费用" tabPosition="left">
                                <Tabs.TabPane tab="旅游费用" key="旅游费用">
                                    <Row>
                                        <Col span={24} className="editor-wrapper" style={{ backgroundColor: 'white' }}>
                                            <Input.TextArea autoSize value={feeInfo} style={{ width: '100%', minHeight: '190px' }} onChange={(e) => setFeeInfo(e.target.value)} />
                                        </Col>
                                    </Row>
                                </Tabs.TabPane>
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
