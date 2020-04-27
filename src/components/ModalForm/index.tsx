import React, { useState } from "react";
import { Select, Input, DatePicker, TimePicker, Col, InputNumber, Button, Form } from "antd";
import { getEnum } from "@/utils/enum";

import styles from "./index.less";
import moment from "moment";

const { Option } = Select;

interface ICfg {
  text: string; //label 名
  editable?: boolean; // 可否编辑
  required?: boolean; // 是否必填
  type?: string; // 类型
  width?: number; // 宽度
  cascade?: string;
  edit_path?: Array<any>|Object;
}

interface IModalForm {
  list: {
    [field: string]: ICfg;
  };
  data?: object;
  onSubmit?: (p: any) => void;
  onCancel?: () => void;
  change?: (field: string, val: any, rst: any) => object;
}

interface IValidate{
  [field:string]:{
    validateStatus:any,
    help:any
  }
}

const initData = (list: IModalForm['list'], data: IModalForm['data']) => {
  const rst = {};
  Object.keys(list).forEach((field: string) => {
    rst[field] = data ? data[field] : '';
  })
  return rst;
}

const initValidate = (list: IModalForm['list']) =>{
  const rst:IValidate = {};
  Object.keys(list).forEach((field: string) => {
    rst[field] = {
      validateStatus:null,
      help:null
    };
  })
  return rst;
}

const ModalForm: React.FC<IModalForm> = ({
  list,
  data: ref,
  onSubmit,
  onCancel,
}) => {
  const [data,setData] = useState<{}>(initData(list, ref));
  const [validate,setValidate] = useState<IValidate>(initValidate(list));

  const onChange = (value: any, field: string) => {
    const rst = {};
    rst[field] = value;
    const clearCascade = (checkField: string) => {
      let nField = null;
      Object.keys(list).forEach((key) => {
        if (list[key].cascade && (list[key].cascade === checkField)) {
          nField = key;
          rst[nField] = '';
        }
      })
      return nField;
    }
    let cField = clearCascade(field);
    while (cField) {
      if(list[cField].required){
        validate[cField] = {
          validateStatus:'error',
          help:`请输入${list[cField].text}`
        }
        setValidate({...validate})
      }
      cField = clearCascade(cField);
    }
    setData({...data,...rst});
    if(list[field].required){
      if(value === null ||value === undefined || value === '' || (Array.isArray(value) && value.length ===0)){
        validate[field] = {
          validateStatus:'error',
          help:`请输入${list[field].text}`
        }
        setValidate({...validate})
      }else{
        validate[field] = {
          validateStatus:null,
          help:null
        }
        setValidate({...validate})
      }
    }
  }

  const renderArraySelect = (
    cfg: any,
    field: string,
    disabled: boolean = false
  ) => {
    const Enum = cfg.edit_path || [];
    if (cfg.multi) {
      return <Select
        showSearch
        optionFilterProp="children"
        mode="multiple"
        getPopupContainer={node => node}
        disabled={disabled}
        value={data[field]}
        onChange={(value) => onChange(value, field)}
      >
        {Object.keys(Enum).map(key => (
          <Option key={key} value={Enum[key]}>
            {Enum[key]}
          </Option>
        ))}
      </Select>
    }
    return (
      <Select
        showSearch
        optionFilterProp="children"
        getPopupContainer={node => node}
        disabled={disabled}
        onChange={(value) => onChange(value, field)}
      >
        {Object.keys(Enum).map(key => (
          <Option key={key} value={Enum[key]}>
            {Enum[key]}
          </Option>
        ))}
      </Select>
    );
  };

  const renderEnumSelect = (
    cfg: any,
    field: string,
    disabled: boolean = false
  ) => {
    const Enum = getEnum(cfg, data) || {};
    if (cfg.multi) {
      return (
        <Select
          showSearch
          optionFilterProp="children"
          mode="multiple"
          getPopupContainer={node => node}
          onChange={(value) => onChange(value, field)}
          disabled={disabled}
          value={data[field]}
        >
          {Object.keys(Enum).map(key => (
            <Option key={key} value={key}>
              {Enum[key]}
            </Option>
          ))}
        </Select>
      );
    }
    return (
      <Select
        showSearch
        optionFilterProp="children"
        getPopupContainer={node => node}
        disabled={disabled}
        value={data[field]}
        onChange={(value) => onChange(value, field)}
      >
        {Object.keys(Enum).map(key => (
          <Option key={key} value={key}>
            {Enum[key]}
          </Option>
        ))}
      </Select>
    );
  };

  const renderPairEditSelect = (
    cfg: any,
    field: string,
    disabled: boolean = false
  ) => {
    if (ref) {
      const Enum = cfg.edit_path || {};
      if (cfg.multi) {
        return (
          <Select
            showSearch
            optionFilterProp="children"
            mode="multiple"
            getPopupContainer={node => node}
            disabled={disabled}
            value={data[field]}
            onChange={(value) => onChange(value, field)}
          >
            {Object.keys(Enum).map(key => (
              <Option key={key} value={key}>
                {Enum[key]}
              </Option>
            ))}
          </Select>
        );
      }
      return (
        <Select
          showSearch
          optionFilterProp="children"
          getPopupContainer={node => node}
          disabled={disabled}
          value={data[field]}
          onChange={(value) => onChange(value, field)}
        >
          {Object.keys(Enum).map(key => (
            <Option key={key} value={key}>
              {Enum[key]}
            </Option>
          ))}
        </Select>
      );
    }
    return null;
  };

  const submit = () => {
    if (onSubmit) {
      let check = true;
      Object.keys(list).forEach((field: string) => {
        if( check && validate[field].validateStatus == 'error'){
          check = false;
        }
        if( list[field].required && (data[field]===null || data[field] === undefined || data[field] ==='')){
          check = false;
          validate[field] = {
            validateStatus:'error',
            help:`请输入${list[field].text}`
          }
          setValidate({...validate})
        }
      })
      if(!check){
        return ;
      }
      onSubmit(data);
    }
  };

  const cancel = () => {
    if (onCancel) {
      onCancel();
    }
  };
  
  return (
    <React.Fragment>
      <Col className={styles.ModalForm}>
        <Form labelCol={{ span: 7 }} wrapperCol={{ span: 16 }}
          onFinish={submit}>
          {Object.keys(list).map(field => (
            <React.Fragment key={field}>
              {list[field].editable === false && !list[field].type && (
                <Form.Item
                  style={{ margin: "12px 0" }}
                  label={list[field].text}
                >
                  <Input value={data[field]} readOnly />
                </Form.Item>
              )}
              {list[field].editable === false &&
                list[field].type &&
                (list[field].type === "number" ||
                  list[field].type === "date" ||
                  list[field].type === "time") && (
                  <Form.Item
                    style={{ margin: "12px 0" }}
                    label={list[field].text}
                  >
                    <Input value={data[field]} readOnly />
                  </Form.Item>
                )}
              {list[field].editable === false &&
                list[field].type &&
                list[field].type === "ArrayEdit" && (
                  <Form.Item
                    style={{ margin: "12px 0" }}
                    label={list[field].text}
                  >
                    {renderArraySelect(list[field], field, true)}
                  </Form.Item>
                )}
              {list[field].editable === false &&
                list[field].type &&
                list[field].type == "PairEdit" && (
                  <Form.Item
                    style={{ margin: "12px 0" }}
                    label={list[field].text}
                  >
                    {renderPairEditSelect(list[field], field)}
                  </Form.Item>
                )}
              {list[field].editable === false &&
                list[field].type &&
                list[field].type !== "number" &&
                list[field].type !== "date" &&
                list[field].type !== "time" &&
                list[field].type !== "ArrayEdit" &&
                list[field].type !== "PairEdit" && (
                  <Form.Item
                    style={{ margin: "12px 0" }}
                    label={list[field].text}
                  >
                    {renderEnumSelect(list[field], field, true)}
                  </Form.Item>
                )}
              {list[field].editable !== false && !list[field].type && (
                <Form.Item
                  style={{ margin: "12px 0" }}
                  label={list[field].text}
                  required={list[field].required}
                  validateStatus={validate[field].validateStatus}
                  help={validate[field].help}
                >
                  <Input
                  value={data[field]}
                  onChange={(e)=>onChange(e.target.value,field)}
                  />
                </Form.Item>
              )}
              {list[field].editable !== false && list[field].type === "number" && (
                <Form.Item
                  style={{ margin: "12px 0" }}
                  label={list[field].text}
                  required={list[field].required}
                  validateStatus={validate[field].validateStatus}
                  help={validate[field].help}
                >
                  <InputNumber 
                  value={data[field]}
                  onChange={(v)=>onChange(v,field)}
                  />
                </Form.Item>
              )}
              {list[field].editable !== false && list[field].type === "date" && (
                <Form.Item
                  style={{ margin: "12px 0" }}
                  label={list[field].text}
                  required={list[field].required}
                  validateStatus={validate[field].validateStatus}
                  help={validate[field].help}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                    value={moment(data[field]).isValid() ? moment(data[field]) : undefined}
                    onChange={(date: moment.Moment | null, value: string)=>{onChange(value,field)}}
                  />
                </Form.Item>
              )}
              {list[field].editable !== false && list[field].type === "time" && (
                <Form.Item
                  style={{ margin: "12px 0" }}
                  label={list[field].text}
                  required={list[field].required}
                  validateStatus={validate[field].validateStatus}
                  help={validate[field].help}
                >
                  <TimePicker
                    style={{ width: "100%" }}
                    format="HH:mm"
                    value={moment(data[field]).isValid() ? moment(data[field]) : undefined}
                    onChange={(date: moment.Moment | null, value: string)=>{onChange(value,field)}}
                  />
                </Form.Item>
              )}
              {list[field].editable !== false &&
                list[field].type === "ArrayEdit" && (
                  <Form.Item
                    style={{ margin: "12px 0" }}
                    label={list[field].text}
                    required={list[field].required}
                    validateStatus={validate[field].validateStatus}
                    help={validate[field].help}
                  >
                    {renderArraySelect(list[field], field)}
                  </Form.Item>
                )}
              {list[field].editable !== false &&
                list[field].type &&
                list[field].type == "PairEdit" && (
                  <Form.Item
                    style={{ margin: "12px 0" }}
                    label={list[field].text}
                    required={list[field].required}
                    validateStatus={validate[field].validateStatus}
                    help={validate[field].help}
                  >
                    {renderPairEditSelect(list[field], field)}
                  </Form.Item>
                )}

              {
                list[field].editable !== false &&
                list[field].type &&
                list[field].type !== "text" &&
                list[field].type !== "number" &&
                list[field].type !== "date" &&
                list[field].type !== "time" &&
                list[field].type !== "ArrayEdit" &&
                list[field].type !== "PairEdit" && (
                  <Form.Item
                    style={{ margin: "12px 0" }}
                    label={list[field].text}
                    required={list[field].required}
                    validateStatus={validate[field].validateStatus}
                    help={validate[field].help}
                    >
                    {renderEnumSelect(list[field], field)}
                  </Form.Item>
                )}
            </React.Fragment>
          ))}
          <Form.Item className={styles.footerBtnBox}>
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
          </Form.Item>
        </Form>
      </Col>
    </React.Fragment>
  );
}


export default ModalForm;
