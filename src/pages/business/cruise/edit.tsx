import React, { useEffect, useState } from 'react';
import { Input, message, Row, Col, Upload, Select, DatePicker, InputNumber, Tabs } from 'antd';
import BraftEditor, { EditorState, ControlType } from 'braft-editor'
import 'braft-editor/dist/index.css'
import { IActionPageProps } from '@/viewconfig/ActionConfig';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import renderHeaderBtns from '@/components/PageHeaderWrapper/headerBtns';

import { useActionPage, useActionBtn } from '@/utils/ActionPageHooks';
import { submit, upload } from '@/utils/req';
import { router } from 'umi';
import { InboxOutlined, LoadingOutlined } from '@ant-design/icons';
import styles from './edit.less';
import { getEnum } from '@/utils/enum';

const { Dragger } = Upload;
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

const Page: React.FC<IActionPageProps> = ({ route, location }) => {

    const initData: {
        'info': {
            [key: string]: string
        },
        'name': string,
        'banner': string,
        'editor': EditorState,
        'des': string,
        'des_html': string,
        'xml'?: string,
    } = {
        'info': {},
        'name': '',
        'banner': '',
        'editor': BraftEditor.createEditorState(''),
        'des': '',
        'des_html': '',
        'xml': ''
    };
    const { viewConfig } = route;
    const { state: ref } = location;

    const { data, setData, load, onCancel, cfg } = useActionPage<typeof initData>(viewConfig, initData, ref);

    const [uploading, setUploading] = useState(false);
    const onOk = () => {
        if (cfg.submit) {
            const post_data = {
                name: data.name,
                banner: data.banner,
                des: data.des,
                des_html: data.des_html
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

    const actionMap = {
        提交: onOk,
        关闭: onCancel,
    }

    const changeInfo = (value: any, field: string) => {
        setData({ ...data, info: { ...data.info, field: value } });
    };

    const { btns } = useActionBtn(viewConfig, actionMap);


    const handleChange = (info: any) => {
        if (info.file.status === 'uploading') {
            setUploading(true);
            return;
        }
        if (info.file.status === 'done') {
            setUploading(false);
            setData({ ...data, banner: info.file.banner });
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 文件上传失败.`);
        } else if (info.file.status === 'removed') {
            setUploading(false);
        }
    };

    const handleUpload = (prop: { file: File }) => {
        setUploading(true);
        const formData = new FormData();
        const { file } = prop;
        formData.append('file', file);
        upload(formData, 'cruiseCompanyBanner').then(res => {
            if (res.success && res.save_path) {
                const fileinfo = { file: { status: 'done', banner: res.save_path } }
                handleChange(fileinfo);
            } else {
                handleChange({ file: { status: 'error', name: file.name } });
            }
        }, () => {
            handleChange({ file: { status: 'error', name: file.name } });
        })
    };

    const uploadArea = () => {
        if (uploading) {
            return <LoadingOutlined />
        }
        if (data.banner !== '') {
            return (
                <img src={data.banner} alt="图片" style={{ width: '100%', height: '100%' }} />
            )
        }
        return (
            <>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击或者拖拽到本区域进行上传</p>
            </>
        )
    }

    const renderDes =() =>{
        return (
            <div className="editor-wrapper" style={{ backgroundColor: 'white' }}>
                <BraftEditor
                    value={data.editor}
                />
            </div>
        )
    }

    const renderRoom =() =>{
        return (
            <div className="editor-wrapper" style={{ backgroundColor: 'white' }}>
                <BraftEditor
                    value={data.editor}
                />
            </div>
        )
    }

    const renderFood =() =>{
        return (
            <div className="editor-wrapper" style={{ backgroundColor: 'white' }}>
                <BraftEditor
                    value={data.editor}
                />
            </div>
        )
    }

    const renderGame =() =>{
        return (
            <div className="editor-wrapper" style={{ backgroundColor: 'white' }}>
                <BraftEditor
                    value={data.editor}
                />
            </div>
        )
    }

    const renderLayout =() =>{
        return (
            <div className="editor-wrapper" style={{ backgroundColor: 'white' }}>
                <BraftEditor
                    value={data.editor}
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
                            <Input onChange={(e) => { changeInfo(e.target.value, 'name') }} />
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
                                onChange={(v) => (changeInfo(v, 'level'))}
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
                                onChange={(v) => changeInfo(v, 'room_number')}
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
                                onChange={(v) => changeInfo(v?.format('YYYY'), 'build_time')}
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
                                onChange={(v) => changeInfo(v, 'place_of_build')}
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
                                onChange={(v) => changeInfo(v, 'master')}
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
                                onChange={(v) => changeInfo(v?.format('YYYY'), 'date_of_use')}
                            />
                        </Col>
                    </Row>
                    <Row className={styles.row}>
                        <Col span={3} className={styles.cellLabel}>
                            全长(米)
                        </Col>
                        <Col span={8} className={styles.cellInput}>
                            <InputNumber style={{ width: '100%' }} min={1} onChange={(v) => changeInfo(v, 'length')} />
                        </Col>
                        <Col span={3} className={styles.cellLabel} style={{ marginLeft: '10px' }}>
                            全宽(米)
                        </Col>
                        <Col span={8} className={styles.cellInput}>
                            <InputNumber style={{ width: '100%' }} min={1} onChange={(v) => changeInfo(v, 'width')} />
                        </Col>
                    </Row>
                    <Row className={styles.row}>
                        <Col span={3} className={styles.cellLabel}>
                            平均航速
                        </Col>
                        <Col span={8} className={styles.cellInput}>
                            <InputNumber style={{ width: '100%' }} min={1} onChange={(v) => changeInfo(v, 'speed')} />
                        </Col>
                    </Row>
                </Col>
                <Col span={12} style={{ marginTop: '12px' }}>
                    <Dragger
                        name="photo"
                        multiple={false}
                        showUploadList={false}
                        className='upload-dragger'
                        beforeUpload={imgUploadCheck}
                        onChange={info => handleChange(info)}
                        customRequest={({ file }) => handleUpload({ file })}
                    >
                        {uploadArea()}
                    </Dragger>
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
                <Tabs.TabPane tab="客房介绍" key="客房介绍">
                    {renderRoom()}
                </Tabs.TabPane>
                <Tabs.TabPane tab="餐饮介绍" key="餐饮介绍">
                    {renderFood()}
                </Tabs.TabPane>
                <Tabs.TabPane tab="娱乐介绍" key="娱乐介绍">
                    {renderGame()}
                </Tabs.TabPane>
                <Tabs.TabPane tab="船舱布局" key="船舱布局">
                    {renderLayout()}
                </Tabs.TabPane>
            </Tabs>

        </PageHeaderWrapper>
    );
}

export default Page;
