import React, { useEffect, useState } from 'react';
import { Input, message, Row, Col, Upload } from 'antd';
import BraftEditor, { EditorState, ControlType } from 'braft-editor'
import 'braft-editor/dist/index.css'
import { IActionPageProps } from '@/viewconfig/ActionConfig';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import renderHeaderBtns from '@/components/PageHeaderWrapper/headerBtns';

import { useActionPage, useActionBtn } from '@/utils/ActionPageHooks';
import { submit, upload } from '@/utils/req';
import { router } from 'umi';
import { InboxOutlined, LoadingOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

const imgUploadCheck = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('请上传 JPG/PNG 图片!');
        return isJpgOrPng;
    }
    return isJpgOrPng;
}

const Page: React.FC<IActionPageProps> = ({ route, location }) => {

    const initData: {
        'name': string,
        'banner': string,
        'editor': EditorState,
        'des': string,
        'des_html': string,
        'xml'?: string,
    } = {
        'name': '',
        'banner': '',
        'editor': BraftEditor.createEditorState(''),
        'des': '',
        'des_html': '',
        'xml': ''
    };
    const { authority,viewConfig } = route;
    const { state: ref } = location;

    const { data, setData, load, onCancel, cfg } = useActionPage<typeof initData>(authority,viewConfig, initData, ref);

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

    useEffect(() => {
        load().then((loadRst) => {
            let State = BraftEditor.createEditorState(loadRst.des || '');
            setData({ name: loadRst.name, banner: loadRst.banner, editor: State, des: loadRst.des, des_html: loadRst.des_html });
        });
    }, [])

    const changeName = (e: { target: { value: string; }; }) => {
        setData({ ...data, name: e.target.value });
    };

    const handleEditorChange = (HeditorState: EditorState) => {
        setData({ ...data, editor: HeditorState, des_html: HeditorState.toHTML(), des: HeditorState.toRAW() });
    };

    const controls: ControlType[] = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator'];

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
        if(uploading){
            return <LoadingOutlined/>
        }
        if (data.banner !== '') {
            return (
                <img src={data.banner} alt="图片" style={{width:'100%',height:'100%'}}/>
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
    return (
        <PageHeaderWrapper
            title={cfg.title || ''}
            extra={renderHeaderBtns(btns)}
        >
            <Row style={{ marginBottom: '20px' }}>
                <Col span={24}>
                    <span>邮轮公司名称:</span>
                </Col>
                <Col span={24}>
                    <Input
                        placeholder="请输入公司名称"
                        value={data.name}
                        onChange={changeName}
                    />
                </Col>
            </Row>
            <Row style={{ marginBottom: '20px' }}>
                <Col span={24}>
                    <span>展示大图:</span>
                </Col>
                <Col span={24}>
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
            <Row>
                <Col span={24}>
                    <span>公司介绍:</span>
                </Col>
                <Col span={24} className="editor-wrapper" style={{ backgroundColor: 'white' }}>
                    <BraftEditor
                        value={data.editor}
                        onChange={handleEditorChange}
                        controls={controls}
                    />
                </Col>
            </Row>

        </PageHeaderWrapper>
    );
}

export default Page;
