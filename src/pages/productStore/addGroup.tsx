import React, { useState } from 'react';
import { Row, Col, Button, DatePicker, Input, InputNumber } from 'antd';
import moment from 'moment';
import { MinusCircleFilled, CopyFilled } from '@ant-design/icons';
import locale from 'antd/es/date-picker/locale/zh_CN';
import styles from './addGroup.less';


interface IPrice {
    room_type: string;
    location: string;
    price: number
}

interface IData {
    dep_date: string,
    price_arr: Array<IPrice>
}

interface IBlock {
    blockKey: number,
    data: IData,
    update: (index: number, v: any) => void,
    updateDetail: (index: number, priceIndex: number, field: string, v: any) => void,
    addPriceRow: (index: number) => void;
    deleteRow: (index: number) => void,
    deletePrice: (index: number, priceIndex: number) => void,
    copy: (index: number) => void,
}
class Block extends React.Component<IBlock>{
    onChange = (v: string) => {
        const { blockKey, update } = this.props;
        update(blockKey, v);
    }

    addPrice = () => {
        const { addPriceRow, blockKey } = this.props;
        addPriceRow(blockKey);
    }
    eidtDetail = (v: string | number = 1, priceIndex: number, field: string) => {
        const { updateDetail, blockKey } = this.props;
        updateDetail(blockKey, priceIndex, field, v);
    }
    delete = () => {
        const { deleteRow, blockKey } = this.props;
        deleteRow(blockKey);
    }
    deleteDetail = (priceIndex: number) => {
        const { deletePrice, blockKey } = this.props;
        deletePrice(blockKey, priceIndex);
    }
    copyBlock = () => {
        const { copy, blockKey } = this.props;
        copy(blockKey)
    }
    render() {
        const { data } = this.props;

        return (
            <>
                <Row style={{ marginBottom: '20px' }}>
                    <Col span={6}>
                        <DatePicker
                            locale={locale}
                            placeholder='选择出发日期'
                            style={{ width: "100%" }}
                            format="YYYY-MM-DD"
                            onChange={(date: moment.Moment | null, v: string) => this.onChange(v)}
                        />
                    </Col>
                    <Col span={6} style={{ marginLeft: '20px' }}>
                        <Button type="primary" onClick={() => this.addPrice()}>
                            添加价格
                        </Button>
                    </Col>
                    <Col style={{ marginLeft: '20px' }}>
                        <CopyFilled onClick={() => this.copyBlock()} style={{ color: 'blue' }} />
                    </Col>
                    <Col>
                        <MinusCircleFilled onClick={() => this.delete()} style={{ color: 'red' }} />
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <span>房型</span>
                    </Col>
                    <Col span={8}>
                        <span>房间位置</span>
                    </Col>
                    <Col span={8}>
                        <span>价格</span>
                    </Col>
                </Row>
                {
                    data.price_arr.map((item, index) => {
                        return (
                            <Row key={index} style={{ marginBottom: '20px' }}>
                                <Col span={8}>
                                    <Input value={item.room_type} onChange={(e) => this.eidtDetail(e.target.value, index, 'room_type')} style={{ width: '90%' }} />
                                </Col>
                                <Col span={8}>
                                    <Input value={item.location} onChange={(e) => this.eidtDetail(e.target.value, index, 'location')} style={{ width: '90%' }} />
                                </Col>
                                <Col span={6}>
                                    <InputNumber value={item.price} onChange={(v) => this.eidtDetail(v, index, 'price')} style={{ width: '90%' }} min={1} />
                                </Col>
                                <Col span={2}>
                                    <MinusCircleFilled onClick={() => this.deleteDetail(index)} style={{ color: 'red' }} />
                                </Col>
                            </Row>
                        )
                    })
                }
            </>
        )
    }
}

interface IProps{
    onOK:(d:IData[])=>void,
    onCancel:()=>void
}
const content = (p:IProps) => {
    const [data, setData] = useState<IData[]>([]);
    const add = () => {
        setData([...data, {
            dep_date: '',
            price_arr: []
        }])
    }
    const deleteRow = (index: number) => {
        data.splice(index, 1);
        setData([...data]);
    }
    const deletePrice = (index: number, priceIndex: number) => {
        const price_arr = [...data[index].price_arr];
        price_arr.splice(priceIndex, 1);
        data[index].price_arr = price_arr;
        setData([...data]);
    }
    const update = (index: number, v: any) => {
        data[index].dep_date = v;
        setData([...data]);
    }
    const updateDetail = (index: number, priceIndex: number, field: string, v: any) => {
        data[index].price_arr[priceIndex][field] = v;
        setData([...data]);
    }
    const addPrice = (index: number) => {
        data[index].price_arr.push({
            price: 1,
            room_type: '',
            location: ''
        })
        setData([...data]);
    }
    const copy = (index: number) => {
        const rst: IData = {
            dep_date: '',
            price_arr: [...data[index].price_arr]
        }
        setData([...data, rst]);
    }
    const submit = () =>{
        const {onOK} = p;
        onOK(data);
    }

    const cancel =() =>{
        const {onCancel} = p;
        onCancel();
    }
    return (
        <>
            <Row style={{ marginBottom: '10px' }}>
                <Col>
                    <Button onClick={add} type="primary">
                        添加团期
                    </Button>
                </Col>
            </Row>
            <Row style={{ marginBottom: '10px' }}>
                <Col>
                    团期明细
                </Col>
            </Row>
            {
                data.map((item, index) => {
                    return (
                        <Block
                            key={index}
                            blockKey={index}
                            data={item}
                            update={update}
                            updateDetail={updateDetail}
                            deleteRow={deleteRow}
                            deletePrice={deletePrice}
                            addPriceRow={addPrice}
                            copy={copy}
                        />
                    )
                })
            }
            <Row className={styles.footerBtnBox}>
                <Button
                    type="primary"
                    onClick={() => {
                        cancel();
                    }}
                    className={styles.footerBtn}
                >
                    取消
                </Button>
                <Button
                    type="primary"
                    onClick={(e) => {
                        e.preventDefault();
                        submit();
                    }}
                    className={styles.footerBtn}
                    htmlType="submit"
                >
                    确定
                </Button>
            </Row>
        </>
    )
}

export default content;