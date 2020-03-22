import React from 'react';
import { Row, Col, Button, Upload, message, InputNumber } from 'antd';
import styles from './index.less';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { upload } from '@/utils/req';
import { isEqual } from 'lodash';
import { ILayoutBlockProps, ILayoutInfoProps, Ipic } from './interface';

const imgUploadCheck = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('请上传 JPG/PNG 图片!');
        return isJpgOrPng;
    }
    return isJpgOrPng;
}

const uploadArea = (pic:Ipic) => {
    if (pic.url !== '') {
        return (
            <img src={pic.url} alt="图片" style={{width:'100%',height:'100%'}}/>
        )
    }
    return (
        <>
            <p className="ant-upload-drag-icon">
                <PlusOutlined />
            </p>
            <p className="ant-upload-text">上传</p>
        </>
    )
}


class Block extends React.Component<ILayoutBlockProps>{
    shouldComponentUpdate = (nextProps: ILayoutBlockProps) => {
        if (!isEqual(nextProps.layout, this.props.layout)) {
            return true;
        }
        return false;
    };
    render() {
        const { layout, blockKey, updateInfo,deleteLayout, handleChange, handleUpload } = this.props;
        return (
            <React.Fragment>
                <Row style={{ paddingLeft: '10px', paddingTop: '10px' }} className={styles.title}>
                    <Col span={11} >
                        甲板布局详情
                    </Col>
                    <Col span={12}>
                        甲板布局图片
                    </Col>
                    <Col span={1}>
                        <DeleteOutlined style={{color:'red'}} onClick={()=>deleteLayout(blockKey)}/>
                    </Col>
                </Row>

                <Row style={{ marginBottom: '20px', backgroundColor: 'white', paddingLeft: '10px' }}>
                    <Col span={11}>
                        <Row className={styles.row}>
                            <Col span={3} className={styles.cellLabel}>
                                所属层数
                            </Col>
                            <Col span={20} className={styles.cellInput}>
                                <InputNumber value={layout.floor} style={{ width: '100%' }} onChange={(v) => updateInfo(v, blockKey, 'floor')} />
                            </Col>
                        </Row>
                    </Col>
                    <Col span={12} style={{ marginTop: '12px' }}>
                        {
                            <Upload.Dragger
                                className='upload-dragger'
                                multiple={false}
                                showUploadList={false}
                                beforeUpload={imgUploadCheck}
                                onChange={info => handleChange(info, blockKey)}
                                customRequest={({ file }) => handleUpload({ file }, blockKey)}
                            >
                                {uploadArea(layout.pic)}
                            </Upload.Dragger>
                        }
                    </Col>
                </Row>
            </React.Fragment>
        )
    }
}

class LayoutInfo extends React.Component<ILayoutInfoProps>{
    addLayout = () => {
        const { info, update } = this.props;
        info.push({
            floor:1,
            pic:{
                uid: '',
                name: '',
                status: '',
                url: ''
            }
        })
        update([...info])
    }
    deleteLayout =(index:number) =>{
        const {info ,update} = this.props;
        info.splice(index,1);
        update([...info]) 
    }
    changeInfo = (v: any, index: number, field: string) => {
        const { info, update } = this.props;
        const rst = { ...info[index] };
        rst[field] = v;
        info[index] = rst;
        update([...info])
    }

    handleLayoutChange = (fileInfo: any, index: number) => {
        const { info, update } = this.props;
        if (fileInfo.file.status === 'uploading') {
            return;
        }
        if (fileInfo.file.status === 'done') {
            const layout = { ...info[index] };
            layout.pic =  {
                uid: fileInfo.file.pic,
                name: fileInfo.file.name,
                status: 'done',
                url: fileInfo.file.pic
            };
            info[index] = layout;
            update([...info]);
        } else if (fileInfo.file.status === 'error') {
            message.error(`${fileInfo.file.name} 文件上传失败.`);
        }
    };

    handleLayoutUpload = (prop: { file: File }, index: number) => {
        const formData = new FormData();
        const { file } = prop;
        formData.append('file', file);
        upload(formData, 'cruisePic').then(res => {
            if (res.success && res.save_path) {
                const fileinfo = { file: { status: 'done', name: file.name, pic: res.save_path } }
                this.handleLayoutChange(fileinfo, index);
            } else {
                this.handleLayoutChange({ file: { status: 'error', name: file.name } }, index);
            }
        }, () => {
            this.handleLayoutChange({ file: { status: 'error', name: file.name } }, index);
        })
    };
    render() {
        const { info } = this.props;
        return (
            <>
                <Row style={{ marginBottom: '20px' }}>
                    <Col span={24} style={{ paddingLeft: '10px' }} >
                        <Button type="primary" onClick={() => this.addLayout()}>
                            添加船舱布局
                        </Button>
                    </Col>
                </Row>
                {
                    info.map((layout, index) =>
                        <Block layout={layout} key={index}
                            blockKey={index}
                            deleteLayout={this.deleteLayout}
                            updateInfo={this.changeInfo}
                            handleChange={this.handleLayoutChange}
                            handleUpload={this.handleLayoutUpload}
                        />
                    )
                }
            </>
        )
    }
}

export default LayoutInfo;