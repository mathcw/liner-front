import React from 'react';
import { Row, Col, Button, Input } from 'antd';
import styles from './index.less';
import { DeleteOutlined } from '@ant-design/icons';
import { isEqual } from 'lodash';
import { IitinBlockProps, IitinInfoProps } from './interface';

class Block extends React.Component<IitinBlockProps>{
    shouldComponentUpdate = (nextProps: IitinBlockProps) => {
        if (!isEqual(nextProps.itin, this.props.itin)) {
            return true;
        }
        return false;
    };
    render() {
        const { itin, blockKey, updateInfo, deleteRoom } = this.props;
        return (
            <React.Fragment>
                <Row style={{ paddingLeft: '10px', paddingTop: '10px' }} className={styles.title}>
                    <Col span={23} >
                        行程详情
                    </Col>
                    <Col span={1}>
                        <DeleteOutlined style={{ color: 'red' }} onClick={() => deleteRoom(blockKey)} />
                    </Col>
                </Row>
                <Row style={{ paddingLeft: '10px', paddingTop: '10px' }}>
                    <Col span={23} >
                        {`第${blockKey + 1}天`}
                    </Col>
                </Row>
                <Row style={{ paddingLeft: '10px' }}>
                    <Col span={1} className={styles.cellLabel}>
                        出发地
                        </Col>
                    <Col span={4} className={styles.cellSelect}>
                        <Input value={itin.dep_city} style={{ width: '100%' }} onChange={(e) => updateInfo(e.target.value, blockKey, 'dep_city')} />
                    </Col>
                    <Col span={1} className={styles.cellLabel} style={{ marginLeft: '10px' }}>
                        出发时间
                        </Col>
                    <Col span={4} className={styles.cellInput}>
                        <Input value={itin.level_time} style={{ width: '100%' }} onChange={(e) => updateInfo(e.target.value, blockKey, 'level_time')} />
                    </Col>
                    <Col span={1} className={styles.cellLabel}>
                        目的地
                        </Col>
                    <Col span={4} className={styles.cellSelect}>
                        <Input value={itin.destination} style={{ width: '100%' }} onChange={(e) => updateInfo(e.target.value, blockKey, 'destination')} />
                    </Col>
                    <Col span={1} className={styles.cellLabel} style={{ marginLeft: '10px' }}>
                        到达时间
                        </Col>
                    <Col span={4} className={styles.cellInput}>
                        <Input value={itin.arr_time} style={{ width: '100%' }} onChange={(e) => updateInfo(e.target.value, blockKey, 'arr_time')} />
                    </Col>
                </Row>
                <Row style={{ marginBottom: '20px',paddingLeft: '10px', paddingTop: '10px' }}>
                    <Col span={2} className={styles.cellLabel}>
                        行程简介
                    </Col>
                    <Col span={18} className={styles.cellInput}>
                        <Input.TextArea autoSize value={itin.des} style={{ width: '100%',minHeight:'104px' }} onChange={(e) => updateInfo(e.target.value, blockKey, 'des')} />
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
            des: '',
            arr_time: '',
            level_time: '',
            dep_city: '',
            destination: '',
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

    render() {
        const { info } = this.props;
        return (
            <>
                <Row style={{ marginBottom: '20px' }}>
                    <Col span={24} style={{ paddingLeft: '10px' }} >
                        <Button type="primary" onClick={() => this.addItin()}>
                            添加行程
                        </Button>
                    </Col>
                </Row>
                {
                    info.map((itin, index) =>
                        <Block itin={itin} key={index}
                            blockKey={index}
                            deleteRoom={this.deleteItin}
                            updateInfo={this.changeInfo}
                        />
                    )
                }
            </>
        )
    }
}

export default ItinInfo;