import React from 'react';
import { Row, Col, Button, Select, Upload, Input, message } from 'antd';
import styles from './index.less';
import { getEnum } from '@/utils/enum';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { upload } from '@/utils/req';
import { isEqual } from 'lodash';
import { IroomBlockProps, IroomInfoProps } from './interface';

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
const uploadArea = () => {
    return (
        <>
            <PlusOutlined />
            <div className="ant-upload-text">上传</div>
        </>
    )
}


class Block extends React.Component<IroomBlockProps>{
    shouldComponentUpdate = (nextProps: IroomBlockProps) => {
        if (!isEqual(nextProps.room, this.props.room)) {
            return true;
        }
        return false;
    };
    render() {
        const { room, blockKey, updateInfo,deleteRoom, handleRoomChange, onRoomRemove, handleRoomUpload } = this.props;
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
                        <DeleteOutlined style={{color:'red'}} onClick={()=>deleteRoom(blockKey)}/>
                    </Col>
                </Row>
                <Row style={{ marginBottom: '20px', backgroundColor: 'white', paddingLeft: '10px' }}>
                    <Col span={11}>
                        <Row className={styles.row}>
                            <Col span={3} className={styles.cellLabel}>
                                房型
                            </Col>
                            <Col span={8} className={styles.cellSelect}>
                                <Select
                                    style={{ width: '100%' }}
                                    showSearch
                                    optionFilterProp='children'
                                    onChange={(v) => (updateInfo(v, blockKey, 'room_type'))}
                                    value={room.room_type}
                                >
                                    {
                                        renderOptions(getEnum('RoomType'))
                                    }
                                </Select>
                            </Col>
                            <Col span={3} className={styles.cellLabel} style={{ marginLeft: '10px' }}>
                                客房类型
                            </Col>
                            <Col span={8} className={styles.cellSelect}>
                                <Select
                                    style={{ width: '100%' }}
                                    showSearch
                                    optionFilterProp='children'
                                    onChange={(v) => (updateInfo(v, blockKey, 'room_kind'))}
                                    value={room.room_kind}
                                >
                                    {
                                        renderOptions(getEnum('RoomKind'))
                                    }
                                </Select>
                            </Col>
                        </Row>
                        <Row className={styles.row}>
                            <Col span={3} className={styles.cellLabel}>
                                客房面积
                        </Col>
                            <Col span={8} className={styles.cellInput}>
                                <Input value={room.room_area} style={{ width: '100%' }} onChange={(e) => updateInfo(e.target.value, blockKey, 'room_area')} />
                            </Col>
                            <Col span={3} className={styles.cellLabel} style={{ marginLeft: '10px' }}>
                                容纳人数
                        </Col>
                            <Col span={8} className={styles.cellInput}>
                                <Input value={room.num_of_people} style={{ width: '100%' }} onChange={(e) => updateInfo(e.target.value, blockKey, 'num_of_people')} />
                            </Col>
                        </Row>
                        <Row className={styles.row}>
                            <Col span={3} className={styles.cellLabel}>
                                所属楼层
                        </Col>
                            <Col span={8} className={styles.cellInput}>
                                <Input value={room.floor} style={{ width: '100%' }} onChange={(e) => updateInfo(e.target.value, blockKey, 'floor')} />
                            </Col>
                        </Row>
                        <Row className={styles.row}>
                            <Col span={3} className={styles.cellLabel}>
                                房间简介
                            </Col>
                            <Col span={20} className={styles.cellInput}>
                                <Input.TextArea autoSize value={room.des} style={{ width: '100%',minHeight:'104px' }} onChange={(e) => updateInfo(e.target.value, blockKey, 'des')} />
                            </Col>
                        </Row>
                    </Col>
                    <Col span={12} style={{ marginTop: '12px' }}>
                        {
                            <Upload
                                name="pictureList"
                                listType="picture-card"
                                // @ts-ignore
                                fileList={room.pic_arr}
                                beforeUpload={imgUploadCheck}
                                onChange={info => handleRoomChange(info, blockKey)}
                                customRequest={({ file }) => handleRoomUpload({ file }, blockKey)}
                                onRemove={(file) => onRoomRemove(file, blockKey)}
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

class RoomInfo extends React.Component<IroomInfoProps>{
    addRoom = () => {
        const { info, update } = this.props;
        info.push({
            room_area: '',
            room_type: '',
            room_kind: '',
            num_of_people: '',
            floor: '',
            des: '',
            pic_arr: []
        })
        update([...info])
    }
    deleteRoom =(index:number) =>{
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

    handleRoomChange = (fileInfo: any, index: number) => {
        const { info, update } = this.props;
        if (fileInfo.file.status === 'uploading') {
            return;
        }
        if (fileInfo.file.status === 'done') {
            const room = { ...info[index] };
            room.pic_arr = [...room.pic_arr, {
                uid: fileInfo.file.pic,
                name: fileInfo.file.name,
                status: 'done',
                url: fileInfo.file.pic
            }];
            info[index] = room;
            update([...info]);
        } else if (fileInfo.file.status === 'error') {
            message.error(`${fileInfo.file.name} 文件上传失败.`);
        }
    };

    onRoomRemove = (file: { uid: string }, roomIndex: number) => {
        const { info, update } = this.props;
        const room = { ...info[roomIndex] };
        const index = room.pic_arr.findIndex((value) => value.uid === file.uid);
        if (index !== -1) {
            room.pic_arr.splice(index, 1);
            info[roomIndex] = room;
            update([...info])
        }
    }

    handleRoomUpload = (prop: { file: File }, index: number) => {
        const formData = new FormData();
        const { file } = prop;
        formData.append('file', file);
        upload(formData, 'cruisePic').then(res => {
            if (res.success && res.save_path) {
                const fileinfo = { file: { status: 'done', name: file.name, pic: res.save_path } }
                this.handleRoomChange(fileinfo, index);
            } else {
                this.handleRoomChange({ file: { status: 'error', name: file.name } }, index);
            }
        }, () => {
            this.handleRoomChange({ file: { status: 'error', name: file.name } }, index);
        })
    };
    render() {
        const { info } = this.props;
        return (
            <>
                <Row style={{ marginBottom: '20px' }}>
                    <Col span={24} style={{ paddingLeft: '10px' }} >
                        <Button type="primary" onClick={() => this.addRoom()}>
                            添加房间信息
                        </Button>
                    </Col>
                </Row>
                {
                    info.map((room, index) =>
                        <Block room={room} key={index}
                            blockKey={index}
                            deleteRoom={this.deleteRoom}
                            updateInfo={this.changeInfo}
                            handleRoomChange={this.handleRoomChange}
                            onRoomRemove={this.onRoomRemove}
                            handleRoomUpload={this.handleRoomUpload}
                        />
                    )
                }
            </>
        )
    }
}

export default RoomInfo;