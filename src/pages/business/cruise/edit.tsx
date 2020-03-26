import React, { useEffect, useState } from 'react';
import { Input, message, Row, Col, Upload, Select, DatePicker, InputNumber, Tabs } from 'antd';
import BraftEditor, { EditorState, ControlType } from 'braft-editor'
import 'braft-editor/dist/index.css'
import { IActionPageProps } from '@/viewconfig/ActionConfig';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import renderHeaderBtns from '@/components/PageHeaderWrapper/headerBtns';

import { useActionBtn } from '@/utils/ActionPageHooks';
import { submit, upload, read } from '@/utils/req';
import { router } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import styles from './edit.less';
import { getEnum } from '@/utils/enum';
import moment from 'moment';
import { getActionConfig } from '@/utils/utils';

import RoomInfo from './components/room';
import FoodInfo from './components/food';
import GameInfo from './components/game';
import { Ipic, Iroom, IFood,IGame, ILayout } from './components/interface';
import LayoutInfo from './components/shipLayout';
import VideoInfo from './components/video';

const { YearPicker } = DatePicker;

const imgUploadCheck = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('请上传 JPG/PNG 图片!');
        return isJpgOrPng;
    }
    return isJpgOrPng;
}

const renderOptions = (options: object) => {
    return (
        Object.keys(options || {}).map(item => (
            <Select.Option value={item} key={item}>
                {options[item]}
            </Select.Option>
        ))
    )
}

const controls: ControlType[] = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator'];

const uploadArea = () => {
    return (
        <>
            <PlusOutlined />
            <div className="ant-upload-text">上传</div>
        </>
    )
}

interface Iinfo{
    name:string,
    cruise_company_id:string,
    level:string,
    room_number:number,
    build_time:string,
    place_of_build:string,
    master:string,
    date_of_use:string,
    length:number,
    width:number,
    speed:number,
    pic_arr:Array<Ipic>,
    editor: EditorState,
    des: string,
    des_html: string,
    kind:string,
}

const Page: React.FC<IActionPageProps> = ({ route, location }) => {
    const { authority,viewConfig } = route;
    const { state: ref } = location;

    const [ baseInfo ,setBaseInfo ] = useState<Iinfo>({
        name:'',
        cruise_company_id:'',
        level:'',
        room_number:1,
        build_time:moment().format('YYYY'),
        place_of_build:'',
        master:'',
        date_of_use:moment().format('YYYY'),
        length:0,
        width:0,
        speed:0,
        pic_arr:[],
        editor: BraftEditor.createEditorState(''),
        des: '',
        des_html: '',
        kind:'',
    });

    const [roomInfo,setRoomInfo] = useState<Iroom[]>([]);
    const [foodInfo,setFoodInfo] = useState<IFood[]>([]);
    const [gameInfo,setGameInfo] = useState<IGame[]>([]);
    const [shipInfo,setShipInfo] = useState<ILayout[]>([]);
    const [video,setVideo] = useState<string>('');
    const cfg = getActionConfig(viewConfig); 

    const onOk = () => {
        if (cfg.submit) {
            const post_data = {
                baseInfo:{
                    name:baseInfo.name,
                    cruise_company_id:baseInfo.cruise_company_id,
                    level:baseInfo.level,
                    room_number:baseInfo.room_number,
                    build_time:baseInfo.build_time,
                    place_of_build:baseInfo.place_of_build,
                    master:baseInfo.master,
                    date_of_use:baseInfo.date_of_use,
                    length:baseInfo.length,
                    width:baseInfo.width,
                    speed:baseInfo.speed,
                    kind:baseInfo.kind,
                    video
                },
                des:{
                    des: baseInfo.des,
                    des_html: baseInfo.des_html
                },
                pic_arr:baseInfo.pic_arr.map(item => item.url),
                roomInfo:roomInfo.map(room =>{
                    return {
                        des:room.des,
                        floor:room.floor,
                        num_of_people:room.num_of_people,
                        room_kind:room.room_kind,
                        room_area:room.room_area,
                        room_type:room.room_type,
                        pic_arr:room.pic_arr.map(item=>item.url)
                    }
                }),
                foodInfo:foodInfo.map(food=>{
                    return {
                        des:food.des,
                        restaurant:food.restaurant,
                        pic_arr:food.pic_arr.map(item=>item.url)
                    }
                }),
                gameInfo:gameInfo.map(game =>{
                    return {
                        des:game.des,
                        name:game.name,
                        pic_arr:game.pic_arr.map(item=>item.url)
                    }
                }),
                shipInfo:shipInfo.map(layout=>{
                    return {
                        floor:layout.floor,
                        pic_arr:[
                            layout.pic.url
                        ]
                    }
                })
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

    const onCancel = () =>{
        router.goBack();
    }

    useEffect(() => {
        if(cfg.read){
            read(cfg.read.url,{action:authority},{...ref},cfg.read.data).then(r => {
                if(r.data){
                    let loadBase = r.data['baseInfo'];
                    let State = BraftEditor.createEditorState(r.data['des'] || '');
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
                    setBaseInfo({...loadBase,pic_arr,editor: State,des: r.data['des'], des_html: r.data['des_html']});

                    if(r.data['video']){
                        setVideo(r.data['video']);
                    }
                    if(r.data['roomInfo']){
                        let loadRoom =  r.data['roomInfo'].map((room:any)=>{
                            if(room['pic_arr'] && room['pic_arr'].length > 0){
                                return {
                                    ...room,
                                    pic_arr:room['pic_arr'].map((url:string)=>{
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
                                ...room,
                                pic_arr:[]
                            }
                        })
                        setRoomInfo([...loadRoom])
                    }
                    if(r.data['foodInfo']){
                        let loadFood =  r.data['foodInfo'].map((food:any)=>{
                            if(food['pic_arr'] && food['pic_arr'].length >0){
                                return {
                                    ...food,
                                    pic_arr:food['pic_arr'].map((url:string)=>{
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
                                ...food,
                                pic_arr:[]
                            }
                        })
                        setFoodInfo([...loadFood])
                    }
                    if(r.data['gameInfo']){
                        let loadGame =  r.data['gameInfo'].map((game:any)=>{
                            if(game['pic_arr'] && game['pic_arr'].length > 0){
                                return {
                                    ...game,
                                    pic_arr:game['pic_arr'].map((url:string)=>{
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
                                ...game,
                                pic_arr:[]
                            }
                        })
                        setGameInfo([...loadGame])
                    }
                    if(r.data['layoutInfo']){
                        let loadLayout =  r.data['layoutInfo'].map((layout:any)=>{
                            if(layout['pic_arr'] && layout['pic_arr'].length >0){
                                let pic = {
                                    uid: layout['pic_arr'][0],
                                    name: layout['pic_arr'][0],
                                    status: 'done',
                                    url: layout['pic_arr'][0]
                                }
                                return {
                                    floor:layout.floor,
                                    pic
                                }
                            }
                            return {
                                floor:layout.floor,
                                pic:{

                                }
                            }
                        })
                        setShipInfo([...loadLayout])
                    }
                }
            },(e:any)=>{
                
            })
        }
    }, [])

    const actionMap = {
        提交: onOk,
        关闭: onCancel
    }
    const { btns } = useActionBtn(viewConfig, actionMap);

    // base info
    const changeBaseInfo = (value: any, field: string) => {
        baseInfo[field] = value;
        setBaseInfo({...baseInfo});
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
        upload(formData, 'cruisePic').then(res => {
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

    //room 
    const handleEditorChange = (HeditorState: EditorState) => {
        setBaseInfo({ ...baseInfo, editor: HeditorState, des_html: HeditorState.toHTML(), des: HeditorState.toRAW() });
    };

    const renderDes = () => {
        return (
            <div className="editor-wrapper" style={{ backgroundColor: 'white' }}>
                <BraftEditor
                    value={baseInfo.editor}
                    onChange={handleEditorChange}
                    controls={controls}
                />
            </div>
        )
    }

    return (
        <PageHeaderWrapper
            title={cfg.title || ''}
            extra={renderHeaderBtns(btns)}
        >
            <Row style={{ backgroundColor: 'white', paddingLeft: '10px', paddingTop: '10px' }} className={styles.title}>
                <Col span={12} >
                    邮轮详情
                 </Col>
                <Col span={12}>
                    邮轮图片(可传多张)
                 </Col>
            </Row>
            <Row style={{ marginBottom: '20px', backgroundColor: 'white', paddingLeft: '10px' }}>
                <Col span={12}>
                    <Row className={styles.row}>
                        <Col span={3} className={styles.cellLabel}>
                            船只名称
                        </Col>
                        <Col span={20} className={styles.cellInput}>
                            <Input value={baseInfo.name} onChange={(e) => { changeBaseInfo(e.target.value, 'name') }} />
                        </Col>
                    </Row>
                    <Row className={styles.row}>
                        <Col span={3} className={styles.cellLabel}>
                            邮轮类型
                        </Col>
                        <Col span={8} className={styles.cellSelect}>
                            <Select
                                style={{ width: '100%' }}
                                showSearch
                                optionFilterProp='children'
                                onChange={(v) => changeBaseInfo(v, 'kind')}
                                value={baseInfo.kind}
                            >
                                {
                                    renderOptions(getEnum('ShipKind'))
                                }
                            </Select>
                        </Col>
                        <Col span={3} className={styles.cellLabel} style={{ marginLeft: '10px' }}>
                            所属公司
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
                    </Row>
                    <Row className={styles.row}>
                        <Col span={3} className={styles.cellLabel}>
                            星级
                        </Col>
                        <Col span={8} className={styles.cellSelect}>
                            <Select
                                style={{ width: '100%' }}
                                showSearch
                                optionFilterProp='children'
                                onChange={(v) => (changeBaseInfo(v, 'level'))}
                                value={baseInfo.level}
                            >
                                {
                                    renderOptions(getEnum('StarLevel'))
                                }
                            </Select>
                        </Col>
                        <Col span={3} className={styles.cellLabel} style={{ marginLeft: '10px' }}>
                            客房数
                        </Col>
                        <Col span={8} className={styles.cellInput}>
                            <InputNumber style={{ width: '100%' }}
                                min={1}
                                onChange={(v) => changeBaseInfo(v, 'room_number')}
                                value={baseInfo.room_number}
                            />
                        </Col>
                    </Row>
                    <Row className={styles.row}>
                        <Col span={3} className={styles.cellLabel}>
                            建造年份
                        </Col>
                        <Col span={8} className={styles.cellSelect}>
                            <YearPicker
                                style={{ width: '100%' }}
                                getPopupContainer={(triggerNode: Element) => triggerNode as HTMLElement}
                                onChange={(v) => changeBaseInfo(v?.format('YYYY'), 'build_time')}
                                value={moment(baseInfo.build_time)}
                            />
                        </Col>
                        <Col span={3} className={styles.cellLabel} style={{ marginLeft: '10px' }}>
                            建造地
                        </Col>
                        <Col span={8} className={styles.cellSelect}>
                            <Select
                                style={{ width: '100%' }}
                                showSearch
                                optionFilterProp='children'
                                onChange={(v) => changeBaseInfo(v, 'place_of_build')}
                                value={baseInfo.place_of_build}
                            >
                                {
                                    renderOptions(getEnum('Country'))
                                }
                            </Select>
                        </Col>
                    </Row>
                    <Row className={styles.row}>
                        <Col span={3} className={styles.cellLabel}>
                            船籍
                        </Col>
                        <Col span={8} className={styles.cellSelect}>
                            <Select
                                style={{ width: '100%' }}
                                showSearch
                                optionFilterProp='children'
                                onChange={(v) => changeBaseInfo(v, 'master')}
                                value={baseInfo.master}
                            >
                                {
                                    renderOptions(getEnum('Country'))
                                }
                            </Select>
                        </Col>
                        <Col span={3} className={styles.cellLabel} style={{ marginLeft: '10px' }}>
                            使用时间
                        </Col>
                        <Col span={8} className={styles.cellSelect}>
                            <YearPicker
                                style={{ width: '100%' }}
                                getPopupContainer={(triggerNode: Element) => triggerNode as HTMLElement}
                                onChange={(v) => changeBaseInfo(v?.format('YYYY'), 'date_of_use')}
                                value={moment(baseInfo.date_of_use)}
                            />
                        </Col>
                    </Row>
                    <Row className={styles.row}>
                        <Col span={3} className={styles.cellLabel}>
                            全长(米)
                        </Col>
                        <Col span={8} className={styles.cellInput}>
                            <InputNumber style={{ width: '100%' }} min={1} 
                            value={baseInfo.length}
                            onChange={(v) => changeBaseInfo(v, 'length')} />
                        </Col>
                        <Col span={3} className={styles.cellLabel} style={{ marginLeft: '10px' }}>
                            全宽(米)
                        </Col>
                        <Col span={8} className={styles.cellInput}>
                            <InputNumber style={{ width: '100%' }} min={1} 
                            value={baseInfo.width}
                            onChange={(v) => changeBaseInfo(v, 'width')} />
                        </Col>
                    </Row>
                    <Row className={styles.row}>
                        <Col span={3} className={styles.cellLabel}>
                            平均航速
                        </Col>
                        <Col span={8} className={styles.cellInput}>
                            <InputNumber style={{ width: '100%' }} min={1} 
                            value={baseInfo.speed}
                            onChange={(v) => changeBaseInfo(v, 'speed')} />
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
            <Tabs defaultActiveKey="邮轮概况" size='large'
                style={{ backgroundColor: 'white' }}
                renderTabBar={(props, DefaultTabBar) =>
                    <DefaultTabBar {...props} className={styles.tabBar} />}
            >
                <Tabs.TabPane tab="邮轮概况" key="邮轮概况">
                    {renderDes()}
                </Tabs.TabPane>
                <Tabs.TabPane tab="邮轮视频" key="邮轮视频">
                    <VideoInfo video={video} update={setVideo}/>
                </Tabs.TabPane>
                <Tabs.TabPane tab="客房介绍" key="客房介绍">
                    <RoomInfo info={roomInfo} update={setRoomInfo}/>
                </Tabs.TabPane>
                <Tabs.TabPane tab="餐饮介绍" key="餐饮介绍">
                    <FoodInfo info={foodInfo} update={setFoodInfo}/>
                </Tabs.TabPane>
                <Tabs.TabPane tab="娱乐介绍" key="娱乐介绍">
                    <GameInfo info={gameInfo} update={setGameInfo}/>
                </Tabs.TabPane>
                <Tabs.TabPane tab="船舱布局" key="船舱布局">
                    <LayoutInfo info={shipInfo} update={setShipInfo}/>
                </Tabs.TabPane>
            </Tabs>

        </PageHeaderWrapper>
    );
}

export default Page;
