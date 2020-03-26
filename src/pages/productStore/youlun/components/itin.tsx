import React from 'react';
import { Row, Col, Button, Upload, Input, message} from 'antd';
import styles from './index.less';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { upload } from '@/utils/req';
import { isEqual } from 'lodash';
import { IitinBlockProps, IitinInfoProps } from './interface';

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

class Block extends React.Component<IitinBlockProps>{
    shouldComponentUpdate = (nextProps: IitinBlockProps) => {
        if (!isEqual(nextProps.itin, this.props.itin)) {
            return true;
        }
        return false;
    };
    render() {
        const { itin, blockKey, updateInfo, deleteItin, handleChange, onRemove, handleUpload } = this.props;


        return (
            <React.Fragment>
                <Row style={{ paddingLeft: '10px', paddingTop: '10px' }} className={styles.title}>
                    <Col span={11} >
                        {`第${blockKey+1}天行程`}
                    </Col>
                    <Col span={12}>
                        行程图片
                    </Col>
                    <Col span={1}>
                        <DeleteOutlined style={{ color: 'red' }} onClick={() => deleteItin(blockKey)} />
                    </Col>
                </Row>

                <Row style={{ marginBottom: '20px', backgroundColor: 'white', paddingLeft: '10px' }}>
                    <Col span={11}>
                        <Row className={styles.row}>
                            <Col span={3} className={styles.cellLabel}>
                                出发地
                            </Col>
                            <Col span={8} className={styles.cellInput}>
                                <Input value={itin.dep_city} style={{ width: '100%' }} onChange={(e) => updateInfo(e.target.value, blockKey, 'dep_city')} />
                            </Col>
                            <Col span={3} className={styles.cellLabel}>
                                出发时间
                            </Col>
                            <Col span={8} className={styles.cellSelect}>
                                <Input value={itin.level_time} style={{ width: '100%' }} onChange={(e) => updateInfo(e.target.value, blockKey, 'level_time')} />
                            </Col>
                        </Row>
                        <Row className={styles.row}>
                            <Col span={3} className={styles.cellLabel}>
                                目的地
                            </Col>
                            <Col span={8} className={styles.cellInput}>
                                <Input value={itin.destination} style={{ width: '100%' }} onChange={(e) => updateInfo(e.target.value, blockKey, 'destination')} />
                            </Col>
                            <Col span={3} className={styles.cellLabel}>
                                到达时间
                            </Col>
                            <Col span={8} className={styles.cellSelect}>
                                <Input value={itin.arr_time} style={{ width: '100%' }} onChange={(e) => updateInfo(e.target.value, blockKey, 'arr_time')} />
                            </Col>
                        </Row>
                        <Row className={styles.row}>
                            <Col span={3} className={styles.cellLabel}>
                                早餐
                            </Col>
                            <Col span={8} className={styles.cellInput}>
                                <Input value={itin.breakfast} style={{ width: '100%' }} onChange={(e) => updateInfo(e.target.value, blockKey, 'breakfast')} />
                            </Col>
                            <Col span={3} className={styles.cellLabel}>
                                午餐
                            </Col>
                            <Col span={8} className={styles.cellSelect}>
                                <Input value={itin.lunch} style={{ width: '100%' }} onChange={(e) => updateInfo(e.target.value, blockKey, 'lunch')} />
                            </Col>
                        </Row>
                        <Row className={styles.row}>
                            <Col span={3} className={styles.cellLabel}>
                                晚餐
                            </Col>
                            <Col span={8} className={styles.cellSelect}>
                                <Input value={itin.dinner} style={{ width: '100%' }} onChange={(e) => updateInfo(e.target.value, blockKey, 'dinner')} />
                            </Col>
                            <Col span={3} className={styles.cellLabel}>
                                住宿
                            </Col>
                            <Col span={8} className={styles.cellInput}>
                                <Input value={itin.accommodation} style={{ width: '100%' }} onChange={(e) => updateInfo(e.target.value, blockKey, 'accommodation')} />
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: '20px'}}>
                            <Col span={4} className={styles.cellLabel}>
                                行程简介
                            </Col>
                            <Col span={18} className={styles.cellInput}>
                                <Input.TextArea autoSize value={itin.des} style={{ width: '100%', minHeight: '104px' }} onChange={(e) => updateInfo(e.target.value, blockKey, 'des')} />
                            </Col>
                        </Row>
                    </Col>
                    <Col span={12} style={{ marginTop: '12px' }}>
                        {
                            <Upload
                                name="pictureList"
                                listType="picture-card"
                                // @ts-ignore
                                fileList={itin.pic_arr}
                                beforeUpload={imgUploadCheck}
                                onChange={info => handleChange(info, blockKey)}
                                customRequest={({ file }) => handleUpload({ file }, blockKey)}
                                onRemove={(file) => onRemove(file, blockKey)}
                            >
                                {uploadArea()}
                            </Upload>
                        }
                    </Col>
                </Row>
            </React.Fragment>
        )
    }
}

class ItinInfo extends React.Component<IitinInfoProps>{
    addItin = () => {
        const { info, update } = this.props;
        info.push({
            des:'',
            arr_time:'',
            level_time:'',
            dep_city:'',
            destination:'',
            breakfast:'',
            lunch:'',
            dinner:'',
            accommodation:'',
            pic_arr: []
        })
        update([...info])
    }
    deleteItin = (index: number) => {
        const { info, update } = this.props;
        info.splice(index, 1);
        update([...info])
    }
    changeInfo = (v: any, index: number, field: string) => {
        const { info, update } = this.props;
        const rst = { ...info[index] };
        rst[field] = v;
        info[index] = rst;
        update([...info])
    }

    handleChange = (fileInfo: any, index: number) => {
        const { info, update } = this.props;
        if (fileInfo.file.status === 'uploading') {
            return;
        }
        if (fileInfo.file.status === 'done') {
            const itin = { ...info[index] };
            itin.pic_arr = [...itin.pic_arr, {
                uid: fileInfo.file.pic,
                name: fileInfo.file.name,
                status: 'done',
                url: fileInfo.file.pic
            }];
            info[index] = itin;
            update([...info]);
        } else if (fileInfo.file.status === 'error') {
            message.error(`${fileInfo.file.name} 文件上传失败.`);
        }
    };

    onRemove = (file: { uid: string }, foodIndex: number) => {
        const { info, update } = this.props;
        const itin = { ...info[foodIndex] };
        const index = itin.pic_arr.findIndex((value) => value.uid === file.uid);
        if (index !== -1) {
            itin.pic_arr.splice(index, 1);
            info[foodIndex] = itin;
            update([...info])
        }
    }

    handleUpload = (prop: { file: File }, index: number) => {
        const formData = new FormData();
        const { file } = prop;
        formData.append('file', file);
        upload(formData, 'cruisePic').then(res => {
            if (res.success && res.save_path) {
                const fileinfo = { file: { status: 'done', name: file.name, pic: res.save_path } }
                this.handleChange(fileinfo, index);
            } else {
                this.handleChange({ file: { status: 'error', name: file.name } }, index);
            }
        }, () => {
            this.handleChange({ file: { status: 'error', name: file.name } }, index);
        })
    };
    render() {
        const { info } = this.props;
        return (
            <>
                <Row style={{ marginBottom: '20px' }}>
                    <Col span={24} style={{ paddingLeft: '10px' }} >
                        <Button type="primary" onClick={() => this.addItin()}>
                            添加行程信息
                        </Button>
                    </Col>
                </Row>
                {
                    info.map((itin, index) =>
                        <Block itin={itin} key={index}
                            blockKey={index}
                            deleteItin={this.deleteItin}
                            updateInfo={this.changeInfo}
                            handleChange={this.handleChange}
                            onRemove={this.onRemove}
                            handleUpload={this.handleUpload}
                        />
                    )
                }
            </>
        )
    }
}

export default ItinInfo;