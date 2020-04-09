import { ModConfigItem } from '@/viewconfig/ModConfig';

const config: ModConfigItem = {
    '客户咨询': {
        read: { url: "/order/Zixun/read" },
        title: "客户咨询",
        textSearch: {
            name: { text: '客户姓名' },
        },
        dropDownSearch: {
        },
        rowButtons: {
            咨询详情:{ text: '详情'},
        },
        pageSizeOptions: ["10", "20", "30", "50", "100"],
        pageSize: 100
    },
    '客户订单': {
        read: { url: "/order/Order/read" },
        title: "客户订单",
        textSearch: {
            pd_name: { text: '产品名称' },
            name: { text: '客户姓名' },
        },
        dropDownSearch: {
        },
        rowButtons: {
            订单详情:{ text: '详情'},
        },
        pageSizeOptions: ["10", "20", "30", "50", "100"],
        pageSize: 100
    },

}

export default config;