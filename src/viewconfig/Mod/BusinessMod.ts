import { ModConfigItem } from '@/viewconfig/ModConfig';

const config: ModConfigItem = {
    '邮轮公司': {
        read: { url: "/business/CruiseCompany/read" },
        title: "邮轮公司",
        textSearch: {
            name: { text: '邮轮公司' },
        },
        dropDownSearch: {
        },
        headerButtons: {
            新增邮轮公司: { text: "新增" }
        },
        rowButtons: {
            修改邮轮公司: { text: "修改" },
            启停邮轮公司: { text: '启停' },
        },
        list: {
            name: { text: "邮轮公司" },
            ship_nums: { text: "名下船舶" },
        },
        pageSizeOptions: ["10", "20", "30", "50", "100"],
        pageSize: 100
    },
    '邮轮设置': {
        read: { url: "/business/CruiseShip/read" },
        title: "邮轮设置",
        textSearch: {
            name: { text: '船舶名称' },
            company_name: { text: '邮轮公司' },
        },
        dropDownSearch: {
        },
        headerButtons: {
            新增邮轮: { text: "新增" }
        },
        rowButtons: {
            修改邮轮: { text: "修改" },
            启停邮轮: { text: "启停" },
        },
        pageSizeOptions: ["10", "20", "30", "50", "100"],
        pageSize: 100
    },
    '数据字典': {
        read: { url: "/business/CommDct/read" },
        title: "数据字典",
        textSearch: {
            name: { text: '字典名称' },
        },
        dropDownSearch: {
            type_id: { text: "数据类型", type: "Business" },
        },
        headerButtons: {
            新增数据字典: { text: "新增" }
        },
        rowButtons: {
            修改数据字典: { text: "修改" },
            启停数据字典: { text: "启停" }
        },
        pageSizeOptions: ["10", "20", "30", "50", "100"],
        pageSize: 100
    },
    '城市设置': {
        read: { url: "/business/City/read" },
        title: "城市设置",
        textSearch: {
            name: { text: '名称' },
        },
        dropDownSearch: {
            country: { text: "国家", type: "Country" }
        },
        headerButtons: {
            新增城市: { text: "新增" }
        },
        rowButtons: {
            修改城市: { text: "修改" },
            启停城市: { text: "启停" }
        },
        list: {
            country: { text: "国家", type: "Country", width: 200 },
            name: { text: "名称", width: 300 },
            state: { text: "启停状态", type: "State" }
        },
        pageSizeOptions: ["10", "20", "30", "50", "100"],
        pageSize: 100
    },
}

export default config;