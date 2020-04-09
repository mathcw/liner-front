import React from 'react';
import { Row, Col, Button, Upload, Input, message } from 'antd';
import styles from './index.less';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { upload } from '@/utils/req';
import { isEqual } from 'lodash';
import { IGameBlockProps, IGameInfoProps } from './interface';

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


class Block extends React.Component<IGameBlockProps>{
    shouldComponentUpdate = (nextProps: IGameBlockProps) => {
        if (!isEqual(nextProps.game, this.props.game)) {
            return true;
        }
        return false;
    };
    render() {
        const { game, blockKey, updateInfo,deleteGame, handleChange, onRemove, handleUpload } = this.props;
        return (
            <React.Fragment>
                <Row style={{ paddingLeft: '10px', paddingTop: '10px' }} className={styles.title}>
                    <Col span={11} >
                        娱乐设施详情
                    </Col>
                    <Col span={12}>
                        娱乐设施图片(可传多张)
                    </Col>
                    <Col span={1}>
                        <DeleteOutlined style={{color:'red'}} onClick={()=>deleteGame(blockKey)}/>
                    </Col>
                </Row>

                <Row style={{ marginBottom: '20px', backgroundColor: 'white', paddingLeft: '10px' }}>
                    <Col span={11}>
                            <Row className={styles.row}>
                            <Col span={3} className={styles.cellLabel}>
                                设施名称
                            </Col>
                            <Col span={20} className={styles.cellInput}>
                                <Input value={game.name} style={{ width: '100%' }} onChange={(e) => updateInfo(e.target.value, blockKey, 'name')} />
                            </Col>
                        </Row>
                         <Row className={styles.row}>
                            <Col span={3} className={styles.cellLabel}>
                                设施简介
                            </Col>
                            <Col span={20} className={styles.cellInput}>
                                <Input.TextArea autoSize value={game.des} style={{ width: '100%',minHeight:'104px' }} onChange={(e) => updateInfo(e.target.value, blockKey, 'des')} />
                            </Col>
                        </Row>
                    </Col>
                    <Col span={12} style={{ marginTop: '12px' }}>
                        {
                            <Upload
                                name="pictureList"
                                listType="picture-card"
                                // @ts-ignore
                                fileList={game.pic_arr}
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

class GameInfo extends React.Component<IGameInfoProps>{
    addGame = () => {
        const { info, update } = this.props;
        info.push({
            name:'',
            des: '',
            pic_arr: []
        })
        update([...info])
    }
    deleteGame =(index:number) =>{
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

    handleGameChange = (fileInfo: any, index: number) => {
        const { info, update } = this.props;
        if (fileInfo.file.status === 'uploading') {
            return;
        }
        if (fileInfo.file.status === 'done') {
            const game = { ...info[index] };
            game.pic_arr = [...game.pic_arr, {
                uid: fileInfo.file.pic,
                name: fileInfo.file.name,
                status: 'done',
                url: fileInfo.file.pic
            }];
            info[index] = game;
            update([...info]);
        } else if (fileInfo.file.status === 'error') {
            message.error(`${fileInfo.file.name} 文件上传失败.`);
        }
    };

    onGameRemove = (file: { uid: string }, gameIndex: number) => {
        const { info, update } = this.props;
        const game = { ...info[gameIndex] };
        const index = game.pic_arr.findIndex((value) => value.uid === file.uid);
        if (index !== -1) {
            const pic_arr = [...game.pic_arr];
            pic_arr.splice(index, 1);
            game.pic_arr = pic_arr;
            info[gameIndex] = game;
            update([...info])
        }
    }

    handleGameUpload = (prop: { file: File }, index: number) => {
        const formData = new FormData();
        const { file } = prop;
        formData.append('file', file);
        upload(formData, 'cruisePic').then(res => {
            if (res.success && res.save_path) {
                const fileinfo = { file: { status: 'done', name: file.name, pic: res.save_path } }
                this.handleGameChange(fileinfo, index);
            } else {
                this.handleGameChange({ file: { status: 'error', name: file.name } }, index);
            }
        }, () => {
            this.handleGameChange({ file: { status: 'error', name: file.name } }, index);
        })
    };
    render() {
        const { info } = this.props;
        return (
            <>
                <Row style={{ marginBottom: '20px' }}>
                    <Col span={24} style={{ paddingLeft: '10px' }} >
                        <Button type="primary" onClick={() => this.addGame()}>
                            添加娱乐信息
                        </Button>
                    </Col>
                </Row>
                {
                    info.map((game, index) =>
                        <Block game={game} key={index}
                            blockKey={index}
                            deleteGame={this.deleteGame}
                            updateInfo={this.changeInfo}
                            handleChange={this.handleGameChange}
                            onRemove={this.onGameRemove}
                            handleUpload={this.handleGameUpload}
                        />
                    )
                }
            </>
        )
    }
}

export default GameInfo;