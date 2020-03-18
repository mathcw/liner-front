import React, { Component } from 'react';
import {Select} from 'antd';
import {SelectProps} from 'antd/lib/select';

const { Option } = Select;

function getSmallOptions(options:any,search:string,len:number,retentionValue:any){
    const newOptions = {};
    if(Object.keys(options).length > 100){
        let i = 0;
        if(search===''){
            Object.keys(options).map((key)=>{
                if(i<=len-1){
                    newOptions[key] = options[key];
                    i+=1;
                }
            })
        }else{
            Object.keys(options).map((key)=>{
                if(i<=len-1){
                    if(options[key].indexOf(search)!==-1){
                        newOptions[key] = options[key];
                        i+=1;
                    }
                }
            })
        }
        if(retentionValue){
            if(Array.isArray(retentionValue)){
                retentionValue.forEach((key)=>{
                    if(options[key])
                        newOptions[key] = options[key];
                })
            }else if(options[retentionValue]){
                newOptions[retentionValue] = options[retentionValue];
            }
        }
        return newOptions;
    }
    return {...options};
}

interface ISelectProps{
    options:{},
    type:string
}

interface ISelectState{
    smallOptions:{},
    search:string,
    curLength:number,
    preType:string
}

const init = (prop:ISelectProps & SelectProps) => {
    const {options={},value,type} = prop; 
    const rst = {
        smallOptions:getSmallOptions(options,'',100,value),
        search:'',
        curLength:100,
        preType:type,
    }
    return rst;
}

class FastSelect extends Component<ISelectProps & SelectProps , ISelectState> {
    
    readonly state = init(this.props);

    static getDerivedStateFromProps(nextProps: ISelectProps & SelectProps,preState :ISelectState) {
        const { type } = nextProps;
        if( (type || preState.preType) && type !== preState.preType) {
            return {
                smallOptions: getSmallOptions(nextProps.options, '', 100,nextProps.value),
                preType:type
            };
        }
        return null;
    }

    onSelectSearch(search:string){
        const {options,onSearch,value} = this.props;
        setTimeout(()=>{
            const smallOptions = getSmallOptions(options, search, 100,value);
            this.setState({smallOptions,search});
          },300)
        if(onSearch){
            onSearch(search);
        }
    }

    onOptionSelect(value:any,optionP:any){
        const {options} = this.props;
        this.setState({...this.state,smallOptions:options,search:''});
        const { onSelect } = this.props;
        if(onSelect){
            onSelect(value,optionP);
        }
    }

    onPopupScroll(e:any){
        e.persist();
        const { target } = e;
        if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
            const { curLength,search } = this.state;
            const {options,value} = this.props;
            const nextLength = curLength + 100;
            const smallOptions = getSmallOptions(options, search,nextLength,value);
            this.setState({smallOptions,curLength:nextLength});
        }
    }

    onSelectFocus(){
        const {options,onFocus,value} = this.props;
        const {search} = this.state;
        const smallOptions = getSmallOptions(options, search, 100,value);
        this.setState({smallOptions});
        if(onFocus){
            onFocus();
        }
    }

    onSelectChange(v:any,optionP:any){
        const {options,onChange} = this.props;
        const {search} = this.state;
        const smallOptions = getSmallOptions(options, search, 100,v);
        this.setState({smallOptions});
        if(onChange){
            onChange(v,optionP);
        }
    }

    render() {
        const {onSearch,onSelect,options,onFocus,onChange,...restProps} = this.props;
        const {smallOptions} = this.state;
        return (
          <Select 
            onSearch={(s) =>this.onSelectSearch(s)}
            onSelect={(v:any,optionP:any)=>this.onOptionSelect(v,optionP)}
            onPopupScroll={(e)=>this.onPopupScroll(e)}
            onFocus={()=>this.onSelectFocus()}
            onChange={(v:any,optionP:any)=>this.onSelectChange(v,optionP)}
            filterOption={false}
            {
                ...restProps 
            }
          >
            {Object.keys(smallOptions).map(item => (
              <Option value={item} key={item}>
                {options[item]}
              </Option>
            ))}
          </Select>
        )
    }
}

export default FastSelect;
