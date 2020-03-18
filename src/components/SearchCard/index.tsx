import React, { useState } from 'react';
import { Form, Row, Col, Input, Button, DatePicker, Select } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

import styles from './index.less';
import { IEnumCfg, getEnum,searchChange } from '@/utils/enum';
import moment from 'moment';
interface FormProps {
    reload: () => void,
    query: object,
    setQuery: React.Dispatch<React.SetStateAction<object>>,
    dropDownSearch: {[key:string]:IEnumCfg},
    textSearch: object,
}

const SearchCard: React.FC<FormProps> = ({
    reload,
    query,
    setQuery,
    dropDownSearch = {},
    textSearch = {}
}) => {
    const [expand, setExpand] = useState(false);
    const needExpand = (Object.keys(dropDownSearch).length + Object.keys(textSearch).length) > 2;
    const [form] = Form.useForm();

    const onDropDownChange = (field: React.ReactText, value: any) => {
        if (setQuery) {
            setQuery((preQuery: any) => {
                const newQuery = { ...preQuery };
                newQuery[field] = value;
                // @ts-ignore
                const rst = searchChange(dropDownSearch,field,newQuery);
                return rst;
            });
        }
    };

    const onDateChange = (field: React.ReactText, value: any) => {
        if (setQuery) {
            setQuery((preQuery: any) => {
                const newQuery = { ...preQuery };
                newQuery[field] = value;
                return newQuery;
            });
        }
    }

    const textSearchChange = (field: React.ReactText, value: any) => {
        if (setQuery) {
            setQuery((preQuery: any) => {
                const newQuery = { ...preQuery };
                newQuery[field] = value;
                return newQuery;
            });
        }
    }

    const renderSelect = (cfg: IEnumCfg, field: React.ReactText) => {
        if (query) {
            if (cfg.type === 'date') {
                const suffixIcon = <React.Fragment></React.Fragment>;
                if (query[field] && query[field] !== '' && moment.isMoment(moment(query[field]))) {
                    return (
                        <DatePicker
                            style={{ width: '100%' }}
                            placeholder={cfg.text}
                            size="small"
                            format="YYYY-MM-DD"
                            suffixIcon={suffixIcon}
                            value={moment(query[field])}
                            onChange={(date: moment.Moment | null, value: string) => onDateChange(field, value)}
                        />
                    )
                }
                return (
                    <DatePicker
                        style={{ width: '100%' }}
                        placeholder={cfg.text}
                        size="small"
                        format="YYYY-MM-DD"
                        suffixIcon={suffixIcon}
                        value={null}
                        onChange={(date: moment.Moment | null, value: string) => onDateChange(field, value)}
                    />
                )
            }

            const Enum = getEnum(cfg, query || {}) || {};
            return (
                <Select
                    showSearch
                    optionFilterProp="children"
                    value={query[field]}
                    onChange={(value: any) => onDropDownChange(field, value)}
                    placeholder={cfg.text}
                    style={{ width: '100%' }}
                >
                    {Object.keys(Enum).map(key => (
                        <Select.Option key={key} value={key}>
                            {Enum[key]}
                        </Select.Option>
                    ))}
                </Select>
            );
        }
        return null;
    };

    const renderInput = (cfg: IEnumCfg, field: React.ReactText) => {
        return (
            <Input
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => textSearchChange(field, event.target.value)}
                placeholder={`请输入${cfg.text}`}
            />
        )
    }

    const getFields = () => {
        const children = [];
        if (!expand) {
            // 未展开 一个下拉 一个input
            let dropDownFields = Object.keys(dropDownSearch);
            let textFields = Object.keys(textSearch);
            if (dropDownFields.length > 0) {
                let field = dropDownFields[0];
                children.push(
                    <Col span={8} key={field}>
                        <Form.Item
                            name={field}
                            label={dropDownSearch[field].text}
                        >
                            {renderSelect(dropDownSearch[field], field)}
                        </Form.Item>
                    </Col>
                )
            }
            if (textFields.length > 0) {
                let field = textFields[0];
                children.push(
                    <Col span={8} key={field}>
                        <Form.Item
                            name={field}
                            label={textSearch[field].text}
                        >
                            {renderInput(textSearch[field], field)}
                        </Form.Item>
                    </Col>
                )
            }
        } else {
            Object.keys(dropDownSearch).forEach((field: string) => {
                children.push(
                    <Col span={8} key={field}>
                        <Form.Item
                            name={field}
                            label={dropDownSearch[field].text}
                        >
                            {renderSelect(dropDownSearch[field], field)}
                        </Form.Item>
                    </Col>
                )
            })
            Object.keys(textSearch).forEach((field: string) => {
                children.push(
                    <Col span={8} key={field}>
                        <Form.Item
                            name={field}
                            label={textSearch[field].text}
                        >
                            {renderInput(textSearch[field], field)}
                        </Form.Item>
                    </Col>
                )
            })
        }

        return children;
    };

    const onFinish = () => {
        if (reload) reload();
    };

    const reset = () => {
        form.resetFields();
        if (setQuery) {
            setQuery({})
        }
    }

    return (
        <Form
            form={form}
            name="search form"
            className={styles.form}
            onFinish={onFinish}
        >
            {
                expand && <>
                    <Row gutter={24}>{getFields()}</Row>
                    <Row>
                        <Col
                            span={24}
                            style={{
                                textAlign: 'right',
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                搜索
                            </Button>
                            <Button
                                style={{
                                    marginLeft: 8,
                                }}
                                onClick={() => {
                                    reset();
                                }}
                            >
                                重置
                            </Button>
                            <a
                                style={{
                                    marginLeft: 8,
                                    fontSize: 12,
                                }}
                                onClick={() => {
                                    setExpand(!expand);
                                }}
                            >
                                {expand ? <UpOutlined /> : <DownOutlined />}
                                {expand ? '收起' : '展开'}
                            </a>
                        </Col>
                    </Row>

                </>
            }
            {
                !expand && <Row gutter={24}>
                    {getFields()}
                    <Col
                        span={8}
                    >
                        <Button type="primary" htmlType="submit">
                            搜索
                            </Button>
                        <Button
                            style={{
                                marginLeft: 8,
                            }}
                            onClick={() => {
                                reset();
                            }}
                        >
                            重置
                            </Button>
                        {
                            needExpand &&
                            <a
                                style={{
                                    marginLeft: 8,
                                    fontSize: 12,
                                }}
                                onClick={() => {
                                    setExpand(!expand);
                                }}
                            >
                                {expand ? <UpOutlined /> : <DownOutlined />}
                                {expand ? '收起' : '展开'}
                            </a>
                        }

                    </Col>
                </Row>
            }
        </Form>
    );
};

export default SearchCard;