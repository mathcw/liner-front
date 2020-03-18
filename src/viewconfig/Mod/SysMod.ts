import { ModConfigItem } from '@/viewconfig/ModConfig';

const config: ModConfigItem = {
    '业务流程': {
        read: { url: "/comm/FlowList/read" },
        title: "业务流程",
        textSearch: {
            name: { text: '流程名称' },
        },
        dropDownSearch: {
        },
        headerButtons: {
        },
        rowButtons: {
            修改流程: { text: "修改" },
            启停流程: { text: "启停" },
            新增分支: { text: "分支" },
            修改分支: { text: "修改分支", show: { is_branch_company: [1] }  },
            启停分支: { text: "启停分支", show: { is_branch_company: [1] }  },
        },
        list: {
            name: { text: "流程名称", width: 300 },
            branch_company_name: { text: "适用公司", width: 200 },
            flow_step: { text: "审批步骤", width: 200 },
            state: { text: "启停状态", type: "State" }
        },
        pageSizeOptions: ["10", "20", "30", "50", "100"],
        pageSize: 100
    },
    'api管理': {
        read: { url: "/comm/Api/read" },
        title: "api管理",
        textSearch: {
            name: { text: '名称' },
        },
        dropDownSearch: {
        },
        headerButtons: {
            新增api: { text: "新增" },
        },
        rowButtons: {
            修改api: { text: "修改" },
        },
        list: {
            name: { text: "名称"},
            schema_name: { text: "流程名称",type:"FlowSchema"}
        },
        pageSizeOptions: ["10", "20", "30", "50", "100"],
        pageSize: 100
    },
    '系统参数设置': {
        read: { url: "/sys/Config/read" },
        title: "参数设置",
        textSearch: {
        },
        dropDownSearch: {
        },
        headerButtons: {
        },
        rowButtons: {
        },
        pageSizeOptions: ["10", "20", "30", "50", "100"],
        pageSize: 100
    },
}

export default config;