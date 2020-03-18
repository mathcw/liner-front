import React, { useMemo } from "react";
import { Select, Input, DatePicker, TimePicker, Col, InputNumber, Button, Form } from "antd";
import { getEnum } from "@/utils/enum";

import styles from "./index.less";

const { Option } = Select;

interface ICfg {
  text: string; //label 名
  editable?: boolean; // 可否编辑
  required?: boolean; // 是否必填
  type?: string; // 类型
  width?: number; // 宽度
  cascade?: string;
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

const initData = (list: IModalForm['list'], data: IModalForm['data']) => {
  const rst = {};
  Object.keys(list).forEach((field: string) => {
    rst[field] = data ? data[field] : '';
  })
  return rst;
}

const ModalForm: React.FC<IModalForm> = ({
  list,
  data: ref,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const formData = useMemo(() => initData(list, ref), [list, ref])

  const selectChange = (value: any, field: string) => {
    const rst = {};
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
      cField = clearCascade(cField);
    }
    form.setFieldsValue(
      {...rst}
    )
  }

  const renderArraySelect = (
    cfg: any,
    field: string,
    disabled: boolean = false
  ) => {
    const formValues = form.getFieldsValue();
    const Enum = getEnum(cfg, formValues) || [];
    if (cfg.multi) {
      return <Select
        showSearch
        optionFilterProp="children"
        mode="multiple"
        getPopupContainer={node => node}
        disabled={disabled}
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
    const formValues = form.getFieldsValue();
    const Enum = getEnum(cfg, formValues) || {};
    if (cfg.multi) {
      return (
        <Select
          showSearch
          optionFilterProp="children"
          mode="multiple"
          getPopupContainer={node => node}
          onChange={(value) => selectChange(value, field)}
          disabled={disabled}
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
        onChange={(value) => selectChange(value, field)}
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
    let selectArrName = cfg.edit_path;
    if (ref) {
      const Enum = ref[selectArrName] || {};
      if (cfg.multi) {
        return (
          <Select
            showSearch
            optionFilterProp="children"
            mode="multiple"
            getPopupContainer={node => node}
            disabled={disabled}
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
      form.validateFields().then(
        (formValues: any) => {
          const rst = {};
          Object.keys(list).forEach((field: string) => {
            rst[field] = formValues[field];
            if (list[field].type && list[field].type === 'date') {
              rst[field] = formValues[field].format('YYYY-MM-DD')
            }
            if (list[field].type && list[field].type === 'time') {
              rst[field] = formValues[field].format('HH:mm')
            }
          })
          onSubmit(rst)
        }, () => {

        }
      );
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
        <Form labelCol={{ span: 7 }} wrapperCol={{ span: 16 }} form={form}
          onFinish={submit} initialValues={formData}>
          {Object.keys(list).map(field => (
            <React.Fragment key={field}>
              {list[field].editable === false && !list[field].type && (
                <Form.Item
                  style={{ margin: "12px 0" }}
                  label={list[field].text}
                  name={field}
                >
                  <Input readOnly />
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
                    name={field}
                  >
                    <Input readOnly />
                  </Form.Item>
                )}
              {list[field].editable === false &&
                list[field].type &&
                list[field].type === "ArrayEdit" && (
                  <Form.Item
                    style={{ margin: "12px 0" }}
                    label={list[field].text}
                    name={field}
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
                    name={field}
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
                    name={field}
                  >
                    {renderEnumSelect(list[field], field, true)}
                  </Form.Item>
                )}
              {list[field].editable !== false && !list[field].type && (
                <Form.Item
                  style={{ margin: "12px 0" }}
                  label={list[field].text}
                  name={field}
                  rules={[{ required: true, message: `请输入${list[field].text}` }]}
                >
                  <Input
                  />
                </Form.Item>
              )}
              {list[field].editable !== false && list[field].type === "number" && (
                <Form.Item
                  style={{ margin: "12px 0" }}
                  label={list[field].text}
                  name={field}
                  rules={[{ required: list[field].required, message: `请输入${list[field].text}` }]}
                >
                  <InputNumber />
                </Form.Item>
              )}
              {list[field].editable !== false && list[field].type === "date" && (
                <Form.Item
                  style={{ margin: "12px 0" }}
                  label={list[field].text}
                  name={field}
                  rules={[{ required: list[field].required, message: `请输入${list[field].text}` }]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                  />
                </Form.Item>
              )}
              {list[field].editable !== false && list[field].type === "time" && (
                <Form.Item
                  style={{ margin: "12px 0" }}
                  label={list[field].text}
                  name={field}
                  rules={[{ required: list[field].required, message: `请输入${list[field].text}` }]}
                >
                  <TimePicker
                    style={{ width: "100%" }}
                    format="HH:mm"
                  />
                </Form.Item>
              )}
              {list[field].editable !== false &&
                list[field].type === "ArrayEdit" && (
                  <Form.Item
                    style={{ margin: "12px 0" }}
                    label={list[field].text}
                    name={field}
                    rules={[{ required: list[field].required, message: `请输入${list[field].text}` }]}
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
                    name={field}
                    rules={[{ required: list[field].required, message: `请输入${list[field].text}` }]}
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
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => {
                      //@ts-ignore
                      return !!list[field].cascade && (prevValues[list[field].cascade] !== currentValues[list[field].cascade]);
                    }}
                  >
                    {({ getFieldValue }) => {
                      if (!list[field].cascade) {
                        return (
                          <Form.Item
                            style={{ margin: "12px 0" }}
                            label={list[field].text}
                            name={field}
                            rules={[{ required: list[field].required, message: `请输入${list[field].text}` }]}>
                            {renderEnumSelect(list[field], field)}
                          </Form.Item>
                        )
                      }
                      // @ts-ignore
                      const shouldUpdate = getFieldValue(list[field].cascade) !== '' && getFieldValue(list[field].cascade) !== undefined && getFieldValue(list[field].cascade) !== null;
                      return shouldUpdate ? (
                        <Form.Item
                          style={{ margin: "12px 0" }}
                          label={list[field].text}
                          name={field}
                          rules={[{ required: list[field].required, message: `请输入${list[field].text}` }]}>
                          {renderEnumSelect(list[field], field)}
                        </Form.Item>
                      ) : <Form.Item
                        style={{ margin: "12px 0" }}
                        label={list[field].text}
                        name={field}
                        rules={[{ required: list[field].required, message: `请输入${list[field].text}` }]}>
                          {renderEnumSelect(list[field], field)}
                        </Form.Item>;
                    }}
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
