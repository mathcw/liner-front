import { ModConfigItem } from '@/viewconfig/ModConfig';

const config: ModConfigItem = {
    '产品管理': {
        read: { url: "/productStore/Product/read" },
        title: "产品管理",
        textSearch: {
            name :{text:'产品名称'},
            pd_num: { text: '船次编号' }
        },
        dropDownSearch: {
            cruise_company_id: { text: '邮轮公司',type:'CruiseCompany' },
            ship_id:{text:'邮轮',type:'CruiseShip'}
        },
        headerButtons: {
            新增产品: { text :'新增'},
        },
        rowButtons: {
            修改产品:{ text: '修改'},
            复制产品:{ text: '复制'},
            新增团期:{ text: '开团'},
            设为首页推荐产品:{text:'推荐'},
        },
        pageSizeOptions: ["10", "20", "30", "50", "100"],
        pageSize: 100,
    },

    '班期管理': {
        read: { url: "/productStore/Group/read" },
        title: "班期管理",
        textSearch: {
            name :{text:'产品名称'},
            pd_num: { text: '船次编号' },
            min_price:{text:'最低价'},
        },
        dropDownSearch: {
            cruise_company_id: { text: '邮轮公司',type:'CruiseCompany' },
            ship_id:{text:'邮轮',type:'CruiseShip'},
            dep_date:{text:'出发日期',type:'date'},
        },
        rowButtons: {
            修改班期:{ text: '修改'},
            删除班期:{ text: '删除'}
        },
        pageSizeOptions: ["10", "20", "30", "50", "100"],
        pageSize: 100,
    },
}

export default config;