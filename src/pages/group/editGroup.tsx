import React, { useState } from 'react';
import { Row, Col, Button, Input, InputNumber, DatePicker } from 'antd';
import { MinusCircleFilled } from '@ant-design/icons';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/zh_CN';
import styles from './editGroup.less';


interface IPrice {
    room_type: string;
    location: string;
    price: number;
    duoren_price?:number
}

interface IData {
    dep_date: string,
    price_arr: Array<IPrice>
}

interface IBlock {
    data: IData,
    update:(v:any)=>void;
    updateDetail: (priceIndex: number, field: string, v: any) => void,
    addPriceRow: () => void;
    deletePrice: (priceIndex: number) => void,
}

const limit = (v:string) =>{
    return v.replace(/^(0+)|[^\d]+/g,'')
}
class Block extends React.Component<IBlock>{
    onChange = (v: string) => {
        const { update } = this.props;
        update(v);
    }
    addPrice = () => {
        const { addPriceRow  } = this.props;
        addPriceRow();
    }
    eidtDetail = (v: string | number = 1, priceIndex: number, field: string) => {
        const { updateDetail  } = this.props;
        updateDetail( priceIndex, field, v);
    }
    deleteDetail = (priceIndex: number) => {
        const { deletePrice } = this.props;
        deletePrice(priceIndex);
    }
    render() {
        const { data } = this.props;

        return (
            <>
                <Row style={{ marginBottom: '20px' }}>
                    <Col span={6}>
                        <DatePicker
                            locale={locale}
                            value={moment(data.dep_date)}
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
                </Row>
                <Row>
                    <Col span={8}>
                        <span>房型</span>
                    </Col>
                    <Col span={8}>
                        <span>一/二人价</span>
                    </Col>
                    <Col span={8}>
                        <span>三/四人价</span>
                    </Col>
                </Row>
                {
                    data.price_arr.map((item, index) => {
                        return (
                            <Row key={index} style={{ marginBottom: '20px' }}>
                                <Col span={8}>
                                    <Input value={item.room_type} onChange={(e) => this.eidtDetail(e.target.value, index, 'room_type')} style={{ width: '90%' }} />
                                </Col>
                                {/* <Col span={8}>
                                    <Input value={item.location} onChange={(e) => this.eidtDetail(e.target.value, index, 'location')} style={{ width: '90%' }} />
                                </Col> */}
                                <Col span={6}>
                                    <InputNumber step={1} value={item.price} onChange={(v) => this.eidtDetail(v, index, 'price')} style={{ width: '90%' }} min={1} formatter={limit} parser={limit}/>
                                </Col>
                                <Col span={6}>
                                    <InputNumber step={1} value={item.duoren_price} onChange={(v) => this.eidtDetail(v, index, 'duoren_price')} style={{ width: '90%' }} formatter={limit} parser={limit}/>
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
    originData:IData,
    onOK:(d:IData)=>void,
    onCancel:()=>void
}
const content = (p:IProps) => {
    const [data, setData] = useState<IData>(p.originData);
    const update = ( v: any) => {
        data.dep_date = v;
        setData({...data});
    }
    const deletePrice = (priceIndex: number) => {
        const price_arr = [...data.price_arr];
        price_arr.splice(priceIndex, 1);
        data.price_arr = price_arr;
        setData({...data});
    }
    const updateDetail = (priceIndex: number, field: string, v: any) => {
        data.price_arr[priceIndex][field] = v;
        setData({...data});
    }
    const addPrice = () => {
        data.price_arr.push({
            price: 1,
            room_type: '',
            location: ''
        })
        setData({...data});
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
                    团期明细
                </Col>
            </Row>
            <Block
                data={data}
                update={update}
                updateDetail={updateDetail}
                deletePrice={deletePrice}
                addPriceRow={addPrice}
            />
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