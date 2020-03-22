import React from 'react';
import { Row, Col, Button, Upload, Input, message } from 'antd';
import styles from './index.less';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { upload } from '@/utils/req';
import { isEqual } from 'lodash';
import { IFoodBlockProps, IFoodInfoProps } from './interface';

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


class Block extends React.Component<IFoodBlockProps>{
    shouldComponentUpdate = (nextProps: IFoodBlockProps) => {
        if (!isEqual(nextProps.food, this.props.food)) {
            return true;
        }
        return false;
    };
    render() {
        const { food, blockKey, updateInfo,deleteFood, handleChange, onRemove, handleUpload } = this.props;
        return (
            <React.Fragment>
                <Row style={{ paddingLeft: '10px', paddingTop: '10px' }} className={styles.title}>
                    <Col span={11} >
                        房间详情
                    </Col>
                    <Col span={12}>
                        房间图片(可传多张)
                    </Col>
                    <Col span={1}>
                        <DeleteOutlined style={{color:'red'}} onClick={()=>deleteFood(blockKey)}/>
                    </Col>
                </Row>

                <Row style={{ marginBottom: '20px', backgroundColor: 'white', paddingLeft: '10px' }}>
                    <Col span={11}>
                            <Row className={styles.row}>
                            <Col span={3} className={styles.cellLabel}>
                                餐厅名称
                            </Col>
                            <Col span={20} className={styles.cellInput}>
                                <Input value={food.restaurant} style={{ width: '100%' }} onChange={(e) => updateInfo(e.target.value, blockKey, 'restaurant')} />
                            </Col>
                        </Row>
                         <Row className={styles.row}>
                            <Col span={3} className={styles.cellLabel}>
                                餐饮简介
                            </Col>
                            <Col span={20} className={styles.cellInput}>
                                <Input.TextArea autoSize value={food.des} style={{ width: '100%',minHeight:'104px' }} onChange={(e) => updateInfo(e.target.value, blockKey, 'des')} />
                            </Col>
                        </Row>
                    </Col>
                    <Col span={12} style={{ marginTop: '12px' }}>
                        {
                            <Upload
                                name="pictureList"
                                listType="picture-card"
                                // @ts-ignore
                                fileList={food.pic_arr}
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

class FoodInfo extends React.Component<IFoodInfoProps>{
    addFood = () => {
        const { info, update } = this.props;
        info.push({
            restaurant:'',
            des: '',
            pic_arr: []
        })
        update([...info])
    }
    deleteFood =(index:number) =>{
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

    handleFoodChange = (fileInfo: any, index: number) => {
        const { info, update } = this.props;
        if (fileInfo.file.status === 'uploading') {
            return;
        }
        if (fileInfo.file.status === 'done') {
            const food = { ...info[index] };
            food.pic_arr = [...food.pic_arr, {
                uid: fileInfo.file.pic,
                name: fileInfo.file.name,
                status: 'done',
                url: fileInfo.file.pic
            }];
            info[index] = food;
            update([...info]);
        } else if (fileInfo.file.status === 'error') {
            message.error(`${fileInfo.file.name} 文件上传失败.`);
        }
    };

    onFoodRemove = (file: { uid: string }, foodIndex: number) => {
        const { info, update } = this.props;
        const food = { ...info[foodIndex] };
        const index = food.pic_arr.findIndex((value) => value.uid === file.uid);
        if (index !== -1) {
            food.pic_arr.splice(index, 1);
            info[foodIndex] = food;
            update([...info])
        }
    }

    handleFoodUpload = (prop: { file: File }, index: number) => {
        const formData = new FormData();
        const { file } = prop;
        formData.append('file', file);
        upload(formData, 'cruisePic').then(res => {
            if (res.success && res.save_path) {
                const fileinfo = { file: { status: 'done', name: file.name, pic: res.save_path } }
                this.handleFoodChange(fileinfo, index);
            } else {
                this.handleFoodChange({ file: { status: 'error', name: file.name } }, index);
            }
        }, () => {
            this.handleFoodChange({ file: { status: 'error', name: file.name } }, index);
        })
    };
    render() {
        const { info } = this.props;
        return (
            <>
                <Row style={{ marginBottom: '20px' }}>
                    <Col span={24} style={{ paddingLeft: '10px' }} >
                        <Button type="primary" onClick={() => this.addFood()}>
                            添加餐饮信息
                        </Button>
                    </Col>
                </Row>
                {
                    info.map((food, index) =>
                        <Block food={food} key={index}
                            blockKey={index}
                            deleteFood={this.deleteFood}
                            updateInfo={this.changeInfo}
                            handleChange={this.handleFoodChange}
                            onRemove={this.onFoodRemove}
                            handleUpload={this.handleFoodUpload}
                        />
                    )
                }
            </>
        )
    }
}

export default FoodInfo;