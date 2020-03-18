import React, { useState } from 'react';
import { Modal, Col, Input, Button, Row } from 'antd';

import styles from './index.less';
import { getEnum } from '@/utils/enum';

interface IModalProps {
    history: any[],
    passOk: (v: string) => void,
    passCancel?: () => void,
    rejectOk: (v: string) => void,
    rejectCancel?: () => void
}

const renderFlow = (history: any[]) => {
    return (
        <div className={styles.content}>
            {history.map(item => (
                <>
                <Row style={{ lineHeight: '36px' }}>
                    <Col xs={12} sm={12} md={8} lg={8}>
                        操作人:{getEnum({ type: 'Account' })[item.account_id]}
                    </Col>
                    <Col xs={12} sm={12} md={8} lg={8}>
                        审批意见:{getEnum({ type: 'Opinion' })[item.opinion]}
                    </Col>
                    <Col xs={12} sm={12} md={8} lg={8}>
                        时间:{item.create_at}
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>备注:{item.comment}</Col>
                </Row>
                </>
            ))}
        </div>
    );
};

export const ApproveModal: React.FC<IModalProps> = ({ history, passOk, passCancel, rejectOk, rejectCancel }) => {
    const [comment, setComment] = useState('');
    const [passModal, setPassModal] = useState(false);
    const [rejectModal, setRejectModal] = useState(false);
    const passModalOk = () => {
        setPassModal(false);
        passOk(comment);
    }

    const passModalCancel = () => {
        setPassModal(false);
        if (passCancel)
            passCancel();
    }

    const rejectModalOk = () => {
        setRejectModal(false);
        rejectOk(comment);
    }

    const rejectModalCancel = () => {
        setRejectModal(false);
        if (rejectCancel)
            rejectCancel();
    }

    const pass = () => {
        setPassModal(true);
    }

    const reject = () => {
        setRejectModal(true);
    }

    return (<>
        <div className={styles.title}>审批记录:</div>
        <>{renderFlow(history)}</>
        <div className={styles.title}>本次备注信息:</div>
        <div className={styles.content}>
            <Input.TextArea
                value={comment}
                placeholder="请输入审批备注"
                autoSize={{ minRows: 4, maxRows: 8 }}
                onChange={e => setComment(e.target.value)}
            />
            <div className={styles.footerBtn}>
                <Button className={styles.confirm} onClick={() => pass()}>通过</Button>
                <Button className={styles.reject} onClick={() => reject()}>不通过</Button>
            </div>
        </div>
        <Modal
            title="审批通过"
            visible={passModal}
            onOk={passModalOk}
            onCancel={passModalCancel}
        >
            <p>请确认是否审批通过</p>
        </Modal>
        <Modal
            title="拒绝审批"
            visible={rejectModal}
            onOk={rejectModalOk}
            onCancel={rejectModalCancel}
        >
            <p>请确认是否拒绝审批</p>
        </Modal>
    </>)
}

