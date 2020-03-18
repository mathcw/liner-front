import React, { Component } from 'react';
import { Radio, Checkbox, Col, Button, Modal } from 'antd';
import { getEnum } from '@/utils/enum';

const { Group } = Radio;

function getField(regular:{[key:string]:object}, i:number) {
    let rst = '';
    Object.keys(regular).forEach((field, index) => {
        if (index === i && rst === '') {
            rst = field
        }
    })
    return rst;
}

function getIndex(regular:{[key:string]:object}, fd: string) {
    let rst = -1;
    Object.keys(regular).forEach((field, index) => {
        if (fd === field && rst === -1) {
            rst = index
        }
    })
    return rst;
}

export interface IFilterConfig{
    mod:string,
    field:string,
    auth_filter:any,
    type:string
}

interface IAppProps{
    cfg:IFilterConfig,
    auth:{
        filters:object
    },
    onCancel:()=>void,
    onSubmit:(mod: string,filter: object)=>void
}

interface IAppState{
    specOk:boolean,
    pem:string,
    specValue:any[],
    cfg:{
        mod:string,
        field:string,
        auth_filter:any,
        type:string,
        cascade?:string,
        enumRow?:{}
    }
}

const init = (props:IAppProps) => {
    const { cfg, auth } = props;
    const filters = auth.filters ? auth.filters : {};
    const f = filters[cfg.mod] && filters[cfg.mod][cfg.field];
    const rst :IAppState = {specOk: true, pem: 'unlmt', specValue: [],cfg:cfg };
    if (!f) {
        rst.pem = 'unlmt';
    } else if (f[0] == -1) {
        rst.pem = 'self';
    } else {
        rst.pem = 'spec';
        rst.specValue = [...f];
    }

    if (cfg.type !== 'Company') {
        if (cfg.auth_filter[cfg.field] && cfg.auth_filter[cfg.field].cascade) {
            const preField = cfg.auth_filter[cfg.field].cascade;
            const preFilter = filters[cfg.mod] && filters[cfg.mod][preField];
            let prePem = ''
            if (!preFilter) {
                prePem = 'unlmt';
            } else {
                prePem = preFilter[0] === -1 ? 'self' : 'spec';
            }
            const specOk = (prePem === 'spec');
            if (specOk) {
                rst.cfg.cascade = preField;
                rst.cfg.enumRow = filters[cfg.mod];
            }
            rst['specOk'] = specOk;
        }
    }
    return rst;
}

class FilterModalContent extends Component<IAppProps,IAppState> {

    readonly state = init(this.props);

    onRadioChange= (e:any)=> {
        this.setState({
            pem: e.target.value,
        });
    }

    onCheckboxChange = (key: string)=> {
        const { specValue } = this.state;
        if (specValue.indexOf(key) !== -1) {
            specValue.splice(specValue.indexOf(key), 1);
        } else {
            specValue.push(key)
        }
        this.setState({specValue});
    }

    submit = () => {
        const { pem, specValue, cfg } = this.state;
        const { onSubmit, auth } = this.props;
        const filters = auth.filters ? auth.filters :{};
        const { mod, field, type, auth_filter } = cfg;
        let filter = filters[mod];
        let i = -1;
        let fd = field;
        if (onSubmit) {
            switch (pem) {
                case 'unlmt':
                    if (!filter) {
                        break;
                    }
                    delete filter[field];
                    switch (type) {
                        case 'Company':
                        case 'Supplier':
                            i = getIndex(auth_filter, field);
                            delete filter[getField(auth_filter, i + 1)];
                            delete filter[getField(auth_filter, i + 2)];
                            break;
                        case 'Department':
                        case 'SupplierDepartment':
                            i = getIndex(auth_filter, field);
                            delete filter[getField(auth_filter, i + 1)];
                            break;
                        case 'SupplierSales':
                        case 'Employee':
                            break;
                        default:
                            break;
                    }
                    break;
                case 'spec':
                    if (specValue.length === 0) {
                        Modal.error({
                            title: '请选择项目',
                            content: '请选择项目',
                        })
                        return;
                    }
                    filter = filter || {};
                    filter[field] = specValue;
                    switch (type) {
                        case 'Company':
                        case 'Supplier':
                            i = getIndex(auth_filter, field);
                            delete filter[getField(auth_filter, i + 1)];
                            delete filter[getField(auth_filter, i + 2)];
                            break;
                        case 'SupplierDepartment':
                        case 'Department':
                            i = getIndex(auth_filter, field);
                            delete filter[getField(auth_filter, i + 1)];
                            break;
                        case 'SupplierSales':
                        case 'Employee':
                            break;
                        default:
                            break;
                    }
                    break;
                case 'self':
                    filter = filter || {};
                    filter[field] = [-1];
                    switch (type) {
                        case 'Company':
                        case 'Supplier':
                            i = getIndex(auth_filter, field);
                            delete filter[getField(auth_filter, i + 1)];
                            delete filter[getField(auth_filter, i + 2)];
                            break;
                        case 'Department':
                        case 'SupplierDepartment':
                            i = getIndex(auth_filter, field);
                            filter[getField(auth_filter, i - 1)] = [-1];
                            delete filter[getField(auth_filter, i + 1)];
                            break;
                        case 'Employee':
                        case 'SupplierSales':
                            i = getIndex(auth_filter, field);
                            while (auth_filter[fd].cascade) {
                                fd = auth_filter[fd].cascade;
                                filter[fd] = [-1];
                            }
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    break;
            }

            onSubmit(cfg.mod, filter);
        }
    }

    cancel = () => {
        const { onCancel } = this.props;
        if (onCancel) {
            onCancel();
        }
    }

    render() {
        const { specOk, pem, specValue, cfg } = this.state;
        let options = {};
        if (cfg.type === 'Company') {
            options = getEnum({ type: cfg.type });
        } else {
            options = getEnum({ type: cfg.type, cascade: cfg.cascade }, cfg.enumRow, cfg.cascade);
        }
        return (
          <div>
            <Group onChange={this.onRadioChange} value={pem}>
              <Radio value="unlmt">无限制</Radio>
              {
                specOk &&
                <Radio value="spec">限指定</Radio>
              }
              <Radio value="self">限本人</Radio>
            </Group>
            {
                pem === 'spec' && cfg.type === 'Department' &&
                <div>
                  {
                      Object.keys(options).map(key =>
                        <Checkbox
                          key={`${cfg.type}/${key}`}
                          onChange={() => this.onCheckboxChange(key)}
                          checked={specValue.indexOf(key) !== -1}
                        >
                          {options[key]}
                        </Checkbox>,
                      )
                  }
                </div>
            }
            {
                pem === 'spec' && cfg.type !== 'Department' &&
                <div>
                  {
                      Object.keys(options).map(key =>
                        <Checkbox
                          key={`${cfg.type}/${key}`}
                          onChange={() => this.onCheckboxChange(key)}
                          checked={specValue.indexOf(key) !== -1}
                        >
                          {options[key]}
                        </Checkbox>,
                      )
                  }
                </div>
            }
            <Col style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                }}>
                <Button
                    style={{
                        display: 'inline-block',
                        marginRight: '16px',
                        marginBottom: 0,
                        marginTop: 0,
                    }}
                    type="primary"
                    onClick={e => {
                        this.cancel();
                    }}
                >
                    取消
                </Button>
                <Button
                    style={{
                        display: 'inline-block',
                        marginRight: '16px',
                        marginBottom: 0,
                        marginTop: 0,
                    }}
                    type="primary"
                    onClick={e => {
                        this.submit();
                    }}
                >
                    确定
                </Button>
            </Col>
          </div>
        );
  }
}

export default FilterModalContent;
