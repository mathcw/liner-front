import React from 'react';
import { Upload, message, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { upload } from '@/utils/req';
import { IVideoInfoProps } from './interface';
import styles from './index.less';
const videoUploadCheck = (file: File) => {
    const isVideo = file.type === 'video/mp4'
    if (!isVideo) {
        message.error('请上传 mp4 视频!');
        return isVideo;
    }
    const isLt100M = file.size < (100*1024*1024);
    if (!isLt100M) {
      message.error('视频不能超过 100MB!');
    }
    return isVideo && isLt100M;
}

const uploadArea = (url:string) => {
    return (
        <>
            <p className="ant-upload-drag-icon">
                <PlusOutlined />
            </p>
            <p className="ant-upload-text">上传</p>
        </>
    )
}

class VideoInfo extends React.Component<IVideoInfoProps>{

    handleChange = (fileInfo: any) => {
        const { update } = this.props;
        if (fileInfo.file.status === 'uploading') {
            return;
        }
        if (fileInfo.file.status === 'done') {
            update(fileInfo.file.video);
        } else if (fileInfo.file.status === 'error') {
            message.error(`${fileInfo.file.name} 文件上传失败.`);
        }
    };

    handleUpload = (prop: { file: File }) => {
        const formData = new FormData();
        const { file } = prop;
        formData.append('file', file);
        upload(formData, 'cruiseVideo').then(res => {
            if (res.success && res.save_path) {
                const fileinfo = { file: { status: 'done', name: file.name, video: res.save_path } }
                this.handleChange(fileinfo);
            } else {
                this.handleChange({ file: { status: 'error', name: file.name } });
            }
        }, () => {
            this.handleChange({ file: { status: 'error', name: file.name } });
        })
    };

    deleteVideo = () =>{
        const { update } = this.props;
        update('');
    }
    render() {
        const { video } = this.props;
        return (
            <>
                {
                    video!== '' && 
                    <Row>
                        <Col span={21}>
                            <video controls id="video" style={{width:'100%',height:'100%'}}>
                                <source src={video}/>
                            </video>
                        </Col>
                        <Col span={3}>
                            <DeleteOutlined className={styles.icon} onClick={()=>this.deleteVideo()}/>
                        </Col>
                    </Row>

                }
                <Upload.Dragger
                    className='upload-dragger'
                    multiple={false}
                    showUploadList={false}
                    beforeUpload={videoUploadCheck}
                    onChange={info => this.handleChange(info)}
                    customRequest={({ file }) => this.handleUpload({ file })}
                >
                    {uploadArea(video)}
                </Upload.Dragger>
            </>
        )
    }
}

export default VideoInfo;