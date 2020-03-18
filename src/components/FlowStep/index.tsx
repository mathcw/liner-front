import React from 'react';
import { LoadingOutlined, RollbackOutlined } from '@ant-design/icons';
import { Steps } from 'antd';
import { colDisplay } from '@/utils/utils';
import { StepsProps } from 'antd/lib/steps';
const { Step } = Steps;
interface IStep {
    title: string | number;
    account_id: string | number;
    external_info: string;
    opinion?: | '0' | 0 | '1' | 1 | '2' | 2 | '3' | 3 | '4' | 4;
    comment: string;
    create_at: string;
    status: string | number;
    description: string;
}

function getDescription(step: IStep) {
    let description = '';
    if (step.account_id !== '0' && step.account_id !== 0) {
        description += colDisplay(step.account_id, 'Account', step);
    }

    if (step.external_info !== '') {
        description += step.external_info;
    }
    description += `于${step.create_at}`;

    if (step.opinion === '0' || step.opinion === 0) {
        description += '提交了';
    } else if (step.opinion === '1' || step.opinion === 1) {
        description += '通过了本次审批';
    } else if (step.opinion === '2' || step.opinion === 2) {
        description += '拒绝了本次审批';
    } else if (step.opinion === '3' || step.opinion === 3) {
        description += '取消了本次审批';
    } else if (step.opinion === '4' || step.opinion === 4) {
        description += '撤销了本次审批';
    }
    if (step.comment != '') {
        description += `审批备注如下:${step.comment}`;
    }
    return description;
}

function renderStep(step: IStep, key: number) {
    if (step.opinion) {
        if (step.opinion === '0') {
            return <Step key={key} title={colDisplay(step.opinion, 'Opinion', step)} description={getDescription(step)} status='finish' />
        }
        if (step.opinion === '1' || step.opinion === 1) {
            return <Step key={key} title={colDisplay(step.opinion, 'Opinion', step)} description={getDescription(step)} status='finish' />
        }
        if (step.opinion === '2' || step.opinion === 2) {
            return <Step key={key} title={colDisplay(step.opinion, 'Opinion', step)} description={getDescription(step)} status='error' />
        }
        if (step.opinion === '3' || step.opinion === 3) {
            return <Step key={key} title={colDisplay(step.opinion, 'Opinion', step)} description={getDescription(step)} icon={<RollbackOutlined />} />;
        }
        if (step.opinion === '4' || step.opinion === 4) {
            return <Step key={key} title={colDisplay(step.opinion, 'Opinion', step)} description={getDescription(step)} icon={<RollbackOutlined />} />;
        }
    } else if (step.status === '2' || step.status === 2) {
        return <Step key={key} title={step.title} description={step.description} icon={<LoadingOutlined />} />;
    }
    return null
}

interface IFlowStep extends StepsProps{
    data:IStep[]
}

const FlowSteps:React.FC<IFlowStep> = props =>{
    const {data,...rst} = props;
    return (
        <Steps {...rst}>
        {
            data.map((item:IStep,index:number) => renderStep(item,index))
        }
    </Steps>
    )
}

export default FlowSteps;