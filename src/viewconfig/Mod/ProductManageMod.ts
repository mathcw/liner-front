import { ModConfigItem } from '@/viewconfig/ModConfig';

const config: ModConfigItem = {
    '产品审核': {
        read: { url: "/ProductStore/Product/read" },
        title: "产品审核",
        textSearch: {
            pd_name: { text: '产品名称' },
            id: { text: '产品编号' }
        },
        dropDownSearch: {
        },
        headerButtons: {
        },
        rowButtons: {
            审核产品: { text: '审核', show: { flow: [2] } },
        },
        pageSizeOptions: ["10", "20", "30", "50", "100"],
        pageSize: 100,
    },
    '产品维护': {
        read: { url: "/ProductStore/Product/read" },
        title: "产品维护",
        textSearch: {
            pd_name: { text: '产品名称' },
            id: { text: '产品编号' }
        },
        dropDownSearch: {
        },
        headerButtons: {
        },
        rowButtons: {
            维护产品: { text: '维护', show: { flow: [4] } },
        },
        pageSizeOptions: ["10", "20", "30", "50", "100"],
        pageSize: 100
    },
}

export default config;